# API Specification & OpenAPI Documentation

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Specification Version:** OpenAPI 3.0.1  
**Base URL:** `http://localhost:5000/api/v1` (Production: `https://charachhavani.maharashtra.gov.in/api/v1`)  
**Swagger UI:** `http://localhost:5000/swagger`  
**Standard Response Wrapper:** All endpoints return `ApiResponse<T>`:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": [],
  "traceId": "00-84a1e94119d8544bb1d5a73e445ba0b1-38290f91a5e12e34-01"
}
```

---

## 1. Controller Routing Matrix

| Controller | Route | Description | Auth Roles Permitted |
|---|---|---|---|
| `AuthController` | `/api/v1/auth` | User login, token refresh, OTP dispatch | Anonymous / Public |
| `CampsController` | `/api/v1/camps` | Camp registration, geofence verification, stats | Operator, Officer, Admin |
| `AdmissionsController` | `/api/v1/admissions` | Cattle admission & release (Rule 9.6 Online Enforced) | CampOperator |
| `AnimalsController` | `/api/v1/animals` | Animal lookup by ear-tag, history, photo retrieve | All Authenticated |
| `FarmersController` | `/api/v1/farmers` | Farmer registration, 7/12 extract, bank account | Operator, Admin |
| `FodderController` | `/api/v1/fodder` | Daily feeding distribution, inward stocks ($1\text{ Q} = 100\text{ Kg}$) | Operator, Officer |
| `VetController` | `/api/v1/vet` | Medical exams, vaccinations, mortality certification | VetDoctor, Officer |
| `OfficerController` | `/api/v1/officer` | Surprise inspections, discrepancy audits, camp approvals | TalukaOfficer, DistrictOfficer, Admin |
| `MasterDataController` | `/api/v1/master`, `/api/v1/masterdata` | Breeds, categories, talukas, feed types lookup | Anonymous / Authenticated |
| `ExpensesController` | `/api/v1/expenses` | Daily expenses, water tanker billing, vouchers | Operator, Officer, Admin |
| `AdminController` | `/api/v1/admin` | State command metrics, user management, audit logs | SuperAdmin |
| `HealthController` | `/api/v1/health` | Liveness, readiness, MySQL connection probe | Anonymous / Monitoring |
| `ExportController` | `/api/v1/export` | Statutory CSV exports with UTF-8 BOM (`\uFEFF`) | Officer, Admin |

---

## 2. Core Endpoint Specifications

### 2.1 Authentication: `POST /api/v1/auth/login`
Authenticates a user and issues an 8-hour Bearer JWT token.

* **Request Body:**
  ```json
  {
    "username": "operator_paithan",
    "password": "Password123!"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresAt": "2026-11-22T15:30:00Z",
      "user": {
        "id": 14,
        "username": "operator_paithan",
        "fullName": "Suresh Kale",
        "role": "CampOperator",
        "campId": 104,
        "district": "Chhatrapati Sambhajinagar"
      }
    },
    "errors": [],
    "traceId": "00-84a1e94119d8..."
  }
  ```

---

### 2.2 Geofence Verification: `POST /api/v1/camps/{id}/verify-location`
Validates whether field operator coordinates reside inside the sanctioned camp boundary polygon.

* **Request Parameters:** `id` (int, path)
* **Request Body:**
  ```json
  {
    "latitude": 19.8214,
    "longitude": 75.3341
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Location verified inside camp geofence",
    "data": {
      "campId": 104,
      "isInside": true,
      "distanceFromCenterMeters": 14.2,
      "sanctionedCapacity": 1000,
      "currentOccupancy": 842
    },
    "errors": [],
    "traceId": "00-29aef10..."
  }
  ```
* **Failure Response (403 Forbidden):**
  ```json
  {
    "success": false,
    "message": "Geofence Violation: Coordinates (19.4795, 75.0123) are outside sanctioned camp boundary.",
    "data": null,
    "errors": ["Outside camp geofence by 38.4 kilometers."],
    "traceId": "00-99def11..."
  }
  ```

---

### 2.3 Animal Admission (Rule 9.6 Online Enforced): `POST /api/v1/admissions/admit`
Registers a cattle admission with compulsory live coordinates and photo verification.

* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "campId": 104,
    "tagNumber": "MH-14-8841",
    "farmerId": 52,
    "breed": "Khillari",
    "category": "Large",
    "gender": "Female",
    "ageMonths": 48,
    "weightKg": 380.50,
    "latitude": 19.8214,
    "longitude": 75.3341,
    "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Animal admitted successfully",
    "data": {
      "admissionId": 381,
      "animalId": 1042,
      "tagNumber": "MH-14-8841",
      "campId": 104,
      "admissionTimestamp": "2026-11-22T08:14:22Z",
      "subsidyRatePerDay": 120.00
    },
    "errors": [],
    "traceId": "00-fa4901..."
  }
  ```

---

### 2.4 Daily Fodder Record: `POST /api/v1/fodder/distribution`
Logs daily distributed fodder and water with metric conversion and idempotency protection.

* **Request Body:**
  ```json
  {
    "campId": 104,
    "distributionDate": "2026-11-22",
    "greenFodderQuintals": 126.30,
    "dryFodderQuintals": 84.20,
    "concentratesKg": 1684.00,
    "waterLiters": 28400.00,
    "cattleCount": 842,
    "idempotencyKey": "e4299b82-7d23-41bb-98a7-681bcae5e194"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Fodder distribution recorded successfully",
    "data": {
      "distributionId": 921,
      "campId": 104,
      "totalFeedKg": 22734.00,
      "averageKgPerCattle": 27.00
    },
    "errors": [],
    "traceId": "00-bb8401..."
  }
  ```

---

### 2.5 Statutory CSV Export: `GET /api/v1/export/feeding-csv?campId=104`
Streams CSV data encoded with UTF-8 BOM (`\uFEFF`) and RFC 4180 headers for MS Excel compatibility.

* **Response Headers:**
  * `Content-Type: text/csv; charset=utf-8`
  * `Content-Disposition: attachment; filename="Chhavani_Feeding_104_20261122.csv"`
* **Payload Preview:**
  ```csv
  तारीख,छावणी कोड,छावणीचे नाव,एकूण जनावरे,हिरवा चारा (क्विंटल),सुका चारा (क्विंटल),खाद्य पेंड (किलो),पाणी (लिटर)
  2026-11-22,CHH-PAITHAN-001,पैठण चारा छावणी,842,126.30,84.20,1684.00,28400.00
  ```
