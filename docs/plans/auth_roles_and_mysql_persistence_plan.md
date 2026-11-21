# Authentication Architecture & Local MySQL Persistence Plan

**Module:** Role-Based Auth (Mobile OTP + Admin Password) & Local MySQL Persistence Verification  
**Reference Understanding Doc:** [auth_roles_and_mysql_persistence_understanding.md](../understanding/auth_roles_and_mysql_persistence_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Infrastructure & .NET Connection String**:
   - Update `DependencyInjection.cs` to resolve `USERNAME` and `PASSWORD` from `backend/.env` using `EnvLoader`.
   - Configure MySQL connection builder with `localhost:3306`, database `chara_chhavani_db`, `utf8mb4`.
2. **Unified Auth Controller & CQRS**:
   - `AuthController` (`/api/v1/auth`) with:
     - `mobile/send-otp` (for all standard users: Farmer, Vet, Officer, Operator)
     - `mobile/verify-otp` (validates OTP, provisions or retrieves user entity)
     - `admin/login` (validates username and password for Admin Dashboard)
   - CQRS Commands:
     - `SendMobileOtpCommand`
     - `VerifyMobileOtpCommand`
     - `AdminLoginCommand`
3. **Shared API Client (`packages/api-client`)**:
   - Update `auth` service namespace in client SDK to support both `mobile` (OTP) and `admin` (username/password).
4. **Local MySQL Database Migration & Setup**:
   - Create database `chara_chhavani_db` in MySQL 8.0.
   - Run `init_schema.sql` (or EF Core migration) to create all tables with spatial indexes.
5. **Data Store & Retrieval Verification**:
   - Run verification script in C# / SQL to insert sample data and select it back.
   - Assert all records exist in MySQL.
6. **Sign-off & Commit**.

---

## Granular Atomic Task List

- [x] **Task 1: Wire up Dynamic MySQL Connection String with `backend/.env`**
  - Scope: Update `DependencyInjection.cs` to read `USERNAME` and `PASSWORD` from `EnvLoader`.
  - Target: `backend/src/CharaChhavani.Infrastructure/DependencyInjection.cs`
- [x] **Task 2: Implement Role-Based Authentication (Mobile OTP & Admin Password)**
  - Scope: `AuthController`, CQRS commands (`SendMobileOtpCommand`, `VerifyMobileOtpCommand`, `AdminLoginCommand`), DTOs.
  - Target: `backend/src/CharaChhavani.Application/Auth/`, `backend/src/CharaChhavani.WebApi/Controllers/AuthController.cs`
- [x] **Task 3: Update Shared Client SDK for Auth**
  - Scope: TypeScript methods for `auth.sendMobileOtp`, `auth.verifyMobileOtp`, `auth.adminLogin`.
  - Target: `packages/api-client/src/`
- [x] **Task 4: Initialize MySQL Database & Run Migration**
  - Scope: Create `chara_chhavani_db` and apply tables schema.
  - Target: Local MySQL 8.0 server (`localhost:3306`)
- [x] **Task 5: Execute Data Store and Retrieval Verification**
  - Scope: Test inserting and querying records in MySQL.
  - Target: Live MySQL verification script
