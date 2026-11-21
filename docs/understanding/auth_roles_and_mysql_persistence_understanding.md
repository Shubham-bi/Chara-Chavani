# Authentication Architecture (Mobile OTP vs Admin Password) & MySQL Persistence - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Requirement Analysis
The user has specified two foundational architectural requirements:

### 1.1 Role-Based Authentication Architecture
1. **Mobile Users (Farmers, Veterinary Doctors, Officers, Chhavani Operators):**
   - **Primary Login:** `MobileNumber` with OTP verification.
   - Rural users do not maintain passwords. Authentication is powered by mobile number verification with simulated OTP in test/demo mode (`123456`).
   - Validates existence or provisions user profile based on role (Farmer, Vet, Officer, Operator).
2. **System Administrator (Web Admin Dashboard):**
   - **Primary Login:** `Username` and `Password`.
   - The Web Admin Dashboard is restricted to authorized state administrators.
   - Requires credential challenge (`Username` + `Password`) returning an Admin JWT/Session token with `Admin` claims.

### 1.2 Local MySQL Integration & Verification
1. Database credentials stored in `backend/.env`:
   ```env
   USERNAME=root
   PASSWORD=NewPassword@123
   ```
2. Dynamic connection string built at startup:
   $$\text{Server}=\text{localhost};\text{Port}=3306;\text{Database}=\text{chara\_chhavani\_db};\text{User}=\{\text{USERNAME}\};\text{Password}=\{\text{PASSWORD}\};\text{CharSet}=\text{utf8mb4};$$
3. Create `chara_chhavani_db` schema in MySQL 8.0 on `localhost:3306`.
4. Verify end-to-end data storage and retrieval (store a record and retrieve it with full field fidelity).

---

## 2. Technical Design & Contracts

### 2.1 Unified Authentication Endpoints (`/api/v1/auth`)
- `POST /api/v1/auth/mobile/send-otp`
  - Input: `{ "mobileNumber": "9876543210", "role": "Farmer" | "VetDoctor" | "Officer" | "CampOperator" }`
  - Output: Success message (and simulated OTP in development).
- `POST /api/v1/auth/mobile/verify-otp`
  - Input: `{ "mobileNumber": "9876543210", "otp": "123456", "role": "..." }`
  - Output: `AuthTokenResponse` with `Token`, `UserId`, `Role`, `DisplayName`.
- `POST /api/v1/auth/admin/login`
  - Input: `{ "username": "admin", "password": "AdminPassword@123" }`
  - Output: `AdminAuthResponse` with `Token`, `Username`, `Role: "Admin"`.

### 2.2 Local MySQL Connection & Schema Migration
- `EnvLoader` parses `backend/.env` and injects `USERNAME` and `PASSWORD` into `ApplicationDbContext`.
- Apply DDL using `mysql.exe` or EF Core.
- Run automated persistence script to insert and select data.
