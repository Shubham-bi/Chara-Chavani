# Local MySQL Configuration via .env & Data Persistence - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Requirement
The user requires local MySQL database integration for the Chara Chhavani backend:
1. Database credentials (`USERNAME` and `PASSWORD`) must be stored in `backend/.env` using those exact variable names.
2. The ASP.NET Core WebAPI backend and EF Core tools must parse `backend/.env` at runtime/design-time and dynamically construct the MySQL connection string:
   $$\text{Server}=\text{localhost};\text{Port}=3306;\text{Database}=\text{chara\_chhavani\_db};\text{User}=\{\text{USERNAME}\};\text{Password}=\{\text{PASSWORD}\};\dots$$
3. Data storage and retrieval must be formally verified against the live local MySQL 8.0 server.

---

## 2. Technical Architecture & Constraints
- **MySQL Version:** MySQL Community Server 8.0.42 on `localhost:3306`.
- **Database Name:** `chara_chhavani_db` with `utf8mb4` character set.
- **Environment Parser:** In .NET 8, environment variables can be parsed directly from `backend/.env` using an idempotent custom `.env` loader in `Program.cs` and `DependencyInjection.cs`.
  - It strips quotes (e.g. `"NewPassword@123"` -> `NewPassword@123`) and trims whitespace around key-value pairs (`USERNAME = root` -> `USERNAME` = `root`).
  - It populates `Environment.SetEnvironmentVariable(...)` so that both `IConfiguration` and runtime connection builders pick up the exact `USERNAME` and `PASSWORD`.
- **Database Initialization:**
  - Execute database creation `CREATE DATABASE IF NOT EXISTS chara_chhavani_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.
  - Execute schema migration using `dotnet ef database update` or `init_schema.sql`.
- **Data Persistence Verification:**
  - Store: Insert a new cattle camp entity (`Chhavani`), a registered farmer (`Farmer`), an animal (`Animal`), and a camp inspection (`CampInspection`) into MySQL.
  - Retrieve: Query the database to verify spatial NetTopologySuite polygon/point parsing, foreign key relations, and accurate decimal quantities.

---

## 3. Verification Criteria
1. Backend successfully loads `USERNAME` and `PASSWORD` from `backend/.env`.
2. MySQL `chara_chhavani_db` schema is created and migrated.
3. Test suite or integration script executes INSERT and SELECT against `localhost:3306` with zero errors.
