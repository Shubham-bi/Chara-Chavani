# Deployment Architecture & Container Topology

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Platform:** Docker / Docker Compose / Kubernetes (MeghRaj NIC Cloud / AWS)  
**Lead DevOps Architect:** Lead DevOps & Cloud Security Engineer  

---

## 1. Container Topology & Network Architecture

```mermaid
flowchart TB
    Internet([Public Internet / 4G Field Clients]) --> WAF[Cloud WAF & DDoS Shield]
    WAF --> ALB[Application Load Balancer / Nginx Reverse Proxy\nSSL Termination (*.maharashtra.gov.in)]
    
    subgraph PrivateVPC["Secure Government Private VPC (10.0.0.0/16)"]
        subgraph AppSubnet["Application Subnet (10.0.1.0/24)"]
            WebApi1["WebAPI Container 1\nASP.NET Core 8 (:8080)"]
            WebApi2["WebAPI Container 2\nASP.NET Core 8 (:8080)"]
            WebAdmin["Web Admin Container\nNode.js Express (:3000)"]
        end
        
        subgraph DataSubnet["Database Subnet (10.0.2.0/24)"]
            MySQLPrimary[("MySQL 8.0 Primary\nSpatial SRID 4326 (:3306)")]
            MySQLReplica[("MySQL 8.0 Read Replica\n(:3306)")]
            RedisCluster[("Redis In-Memory Cache\n(:6379)")]
        end
        
        subgraph StorageSubnet["Persistent Volume Storage"]
            PVUploads["NFS / EFS Storage Volume\n/app/storage/uploads"]
            PVMySQL["Persistent Volume\n/var/lib/mysql"]
        end
    end

    ALB -->|/api/* & /index.html| WebApi1
    ALB -->|/api/* & /index.html| WebApi2
    ALB -->|/admin*| WebAdmin
    
    WebApi1 --> MySQLPrimary
    WebApi2 --> MySQLPrimary
    WebApi1 --> MySQLReplica
    WebApi2 --> MySQLReplica
    WebApi1 --> RedisCluster
    WebApi2 --> RedisCluster
    
    WebApi1 --> PVUploads
    WebApi2 --> PVUploads
    MySQLPrimary --> PVMySQL
```

---

## 2. Dockerfile Specifications

### 2.1 Backend WebAPI: Multi-Stage Build (`backend/Dockerfile`)

```dockerfile
# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for caching restore layer
COPY ["src/CharaChhavani.Domain/CharaChhavani.Domain.csproj", "src/CharaChhavani.Domain/"]
COPY ["src/CharaChhavani.Application/CharaChhavani.Application.csproj", "src/CharaChhavani.Application/"]
COPY ["src/CharaChhavani.Infrastructure/CharaChhavani.Infrastructure.csproj", "src/CharaChhavani.Infrastructure/"]
COPY ["src/CharaChhavani.WebApi/CharaChhavani.WebApi.csproj", "src/CharaChhavani.WebApi/"]
RUN dotnet restore "src/CharaChhavani.WebApi/CharaChhavani.WebApi.csproj"

# Copy source and build
COPY src/ src/
WORKDIR "/src/src/CharaChhavani.WebApi"
RUN dotnet build -c Release -o /app/build
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image (Hardened Linux)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Install curl for container health check
RUN apk add --no-cache curl

# Run as non-root user for security compliance
USER app

COPY --from=build /app/publish .

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

ENTRYPOINT ["dotnet", "CharaChhavani.WebApi.dll"]
```

---

## 3. Docker Compose Orchestration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: chara-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword2026!
      MYSQL_DATABASE: charachhavanidb
      MYSQL_USER: charauser
      MYSQL_PASSWORD: CharaPassword2026!
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default-authentication-plugin=mysql_native_password
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: chara-backend
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - DB_CONNECTION_STRING=Server=db;Port=3306;Database=charachhavanidb;User=charauser;Password=CharaPassword2026!;CharSet=utf8mb4;TreatTinyAsBoolean=true;
    ports:
      - "5000:8080"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - uploads_data:/app/storage/uploads

  web-admin:
    build:
      context: ./apps/web-admin
      dockerfile: Dockerfile
    container_name: chara-web-admin
    restart: always
    environment:
      - PORT=3000
      - API_BASE_URL=http://backend:8080/api/v1
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mysql_data:
  uploads_data:
```

---

## 4. Health Checks & Production Monitoring Probes

* **Liveness Probe:** `GET http://localhost:5000/api/v1/health`
  * Checks application process memory and worker thread availability. Returns `200 OK`.
* **Readiness Probe:** `GET http://localhost:5000/api/v1/health?full=true`
  * Executes a lightweight SQL ping `SELECT 1` against MySQL and verifies Redis connectivity.
  * If the database is unreachable, returns `503 Service Unavailable`, preventing the ALB from directing traffic to unready containers.
