# System Configuration & Environment Runbook

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Classification:** Confidential - Internal Operational Runbook  

---

## 1. Overview & Isolation Design

The Chara Chhavani platform consists of an ASP.NET Core 8 WebAPI (`backend/src/CharaChhavani.WebApi`), a Web Administration portal (`apps/web-admin`), a shared UI library (`packages/ui-core`), and a MySQL 8.0 spatial database.

To eliminate host OS variable collisions (notably on Windows environments where ambient OS variables like `USERNAME` or `COMPUTERNAME` can hijack application configuration), configuration loading is managed via a dedicated `EnvLoader.cs` which explicitly reads local `.env` files into application memory without relying on unstable shell defaults.

---

## 2. Port Allocations & Network Topology

| Service / Component | Protocol | Localhost Port | Production Port | Host Binding |
|---|---|---|---|---|
| **ASP.NET Core WebAPI** | HTTP / HTTPS | `5000` | `8080` (Internal) / `443` (Public ALB) | `0.0.0.0` or `localhost` |
| **Web Admin Server (Node.js)** | HTTP | `3000` | `3000` (Internal) / `443` (Public ALB) | `0.0.0.0` or `localhost` |
| **Master Unified Portal** | HTTP | `5000` (`/index.html`) | Same as WebAPI | Embedded in `wwwroot` |
| **Swagger UI Documentation** | HTTP | `5000` (`/swagger`) | Disabled in Prod / Auth Only | Embedded in `wwwroot` |
| **MySQL 8.0 Database** | TCP / MySQL | `3306` | `3306` (Private VPC subnet only) | Private Subnet |
| **Redis Cache** | TCP / RESP | `6379` | `6379` (Private VPC subnet only) | Private Subnet |

---

## 3. Environment Variables Specification

### 3.1 Backend WebAPI (`backend/.env`)

```ini
# ==============================================================================
# CHARA CHHAVANI BACKEND ENVIRONMENT CONFIGURATION
# ==============================================================================

# ASP.NET Core Hosting Environment
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://0.0.0.0:5000

# Database Configuration (MySQL 8.0 with NetTopologySuite Spatial Extension)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=charachhavanidb
DB_USER=root
DB_PASSWORD=SecureDbPassword2026!
DB_CONNECTION_STRING="Server=localhost;Port=3306;Database=charachhavanidb;User=root;Password=SecureDbPassword2026!;CharSet=utf8mb4;TreatTinyAsBoolean=true;"

# JWT Security Credentials
JWT_SECRET=CharaChhavaniSuperSecretEnterpriseKeyWith256BitsMinimumSecurity2026!
JWT_ISSUER=CharaChhavaniAuthService
JWT_AUDIENCE=CharaChhavaniClients
JWT_EXPIRY_MINUTES=480

# Logging & Telemetry
LOG_LEVEL=Information
SERILOG_MINIMUM_LEVEL=Information

# Geofence & Anti-Fraud Thresholds
GEOFENCE_TOLERANCE_METERS=25.0
REQUIRE_ONLINE_FOR_ADMISSION=true
REQUIRE_ONLINE_FOR_RELEASE=true

# Storage Buckets (Local / S3)
STORAGE_PROVIDER=Local
STORAGE_LOCAL_ROOT=./storage/uploads
```

### 3.2 Web Admin Portal (`apps/web-admin/.env`)

```ini
# Web Admin Port
PORT=3000
NODE_ENV=development

# Backend WebAPI Upstream
API_BASE_URL=http://localhost:5000/api/v1
PUBLIC_API_URL=http://localhost:5000/api/v1

# Session Security
SESSION_SECRET=ChhavaniAdminSessionSecureKey99482
```

---

## 4. `EnvLoader.cs` Isolation Implementation

Located in `backend/src/CharaChhavani.WebApi/Configuration/EnvLoader.cs`:

```csharp
public static class EnvLoader
{
    public static void Load(string envPath)
    {
        if (!File.Exists(envPath)) return;

        foreach (var line in File.ReadAllLines(envPath))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith('#'))
                continue;

            var parts = trimmed.Split('=', 2);
            if (parts.Length != 2) continue;

            var key = parts[0].Trim();
            var val = parts[1].Trim().Trim('"', '\'');

            // Force override to ensure host OS variables (like Windows USERNAME) do not corrupt app config
            Environment.SetEnvironmentVariable(key, val);
        }
    }
}
```

---

## 5. Security & Secret Rotation Runbook

1. **JWT Secret Rotation:** Rotate the 256-bit key every 90 days. During rotation, configure dual-signing in `JwtBearerOptions` for a 24-hour overlapping grace window.
2. **Database Credentials:** Stored strictly in AWS Secrets Manager or HashiCorp Vault in staging/production environments; never committed to git repositories.
3. **Audit Verification:** Verify zero sensitive credentials in client bundles (`packages/api-client` and `packages/ui-core`).
