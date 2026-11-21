# Multi-Stage Dockerfile for ASP.NET Core 8.0 WebAPI
# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first to leverage Docker layer caching
COPY ["CharaChhavani.sln", "./"]
COPY ["src/CharaChhavani.Domain/CharaChhavani.Domain.csproj", "src/CharaChhavani.Domain/"]
COPY ["src/CharaChhavani.Application/CharaChhavani.Application.csproj", "src/CharaChhavani.Application/"]
COPY ["src/CharaChhavani.Infrastructure/CharaChhavani.Infrastructure.csproj", "src/CharaChhavani.Infrastructure/"]
COPY ["src/CharaChhavani.WebApi/CharaChhavani.WebApi.csproj", "src/CharaChhavani.WebApi/"]
COPY ["tests/CharaChhavani.UnitTests/CharaChhavani.UnitTests.csproj", "tests/CharaChhavani.UnitTests/"]

# Restore NuGet dependencies
RUN dotnet restore "CharaChhavani.sln"

# Copy remaining source code
COPY . .

# Run test suite to guarantee zero broken builds in image
RUN dotnet test "tests/CharaChhavani.UnitTests/CharaChhavani.UnitTests.csproj" -c Release --no-restore

# Publish release artifacts
WORKDIR "/src/src/CharaChhavani.WebApi"
RUN dotnet publish "CharaChhavani.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Production Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Configure ASP.NET Core environment
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 5000

# Copy published application
COPY --from=build /app/publish .

# Run as unprivileged non-root user for security hardening
USER $APP_UID

ENTRYPOINT ["dotnet", "CharaChhavani.WebApi.dll"]
