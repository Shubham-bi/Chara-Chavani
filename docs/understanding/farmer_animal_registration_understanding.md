# Farmer & Animal Registration Understanding Document
**Module:** Farmer Management & Animal Registration  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Workflow 1), [FSD.md](../../ReferanceData/FSD.md) (Section 1), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
- **Target User:** Farmers living in drought-affected areas who own livestock (cattle, buffaloes, goats, etc.) and wish to register their animals for subsidized fodder and shelter at government-approved Chara Chhavanis.
- **Farmer Persona:** Uses the **Farmer Mobile Application** with mobile OTP login, maintains their address profile, registers animals with photographs, tracks verification status, and resubmits rejected animals with corrections.

---

## 2. Functional Requirements & Invariants

### 2.1 Farmer Profile & Auth Flow
* **Authentication:** Mobile number validation (10 digits starting with 6–9). OTP simulation/verification returning a secure session token and farmer profile.
* **Farmer Profile:** Captures Full Name, Mobile, Village, Taluka, District, State (`Maharashtra`), and optional `IsRegisteredSeller` flag (allowing farmers to supply fodder to camps).
* **Idempotency:** A farmer with an existing mobile number updates their profile rather than creating a duplicate farmer record.

### 2.2 Animal Registration & Life Cycle
* **System-Generated Unique ID:** Format `ANM-YYYYMMDD-XXXX` (guaranteed unique in the database).
* **Tag Number:** Optional RFID/ear tag number; if provided, checked for duplicates within active records.
* **Initial Status:**
  * `VerificationStatus`: `Pending`
  * `CurrentStatus`: `Registered`
* **Photograph Requirement:** Mandatory photo URL captured at registration time.
* **Resubmission Flow:** If an animal was `Rejected` by a veterinary doctor, the farmer can update the details/photograph and trigger `Resubmit`, transitioning status back to `Pending` while preserving past verification remarks in audit history.

---

## 3. Data Flow & API Contracts

### Endpoints
* `POST /api/v1/farmers/auth/send-otp`: Sends 6-digit OTP to farmer's mobile number.
* `POST /api/v1/farmers/auth/verify-otp`: Verifies OTP and returns farmer profile/token.
* `POST /api/v1/farmers/profile`: Create or update farmer profile.
* `GET /api/v1/farmers/{id}`: Fetch farmer profile with summary counts (Total, Pending, Verified, Rejected, Admitted).
* `POST /api/v1/farmers/{farmerId}/animals`: Register a new animal with auto-generated ID.
* `GET /api/v1/farmers/{farmerId}/animals`: List farmer's animals with status filtering (`Pending`, `Approved`, `Rejected`, `Admitted`).
* `GET /api/v1/animals/{id}`: Detailed view of animal including verification history and current camp.
* `PUT /api/v1/animals/{id}/resubmit`: Resubmit a rejected animal for veterinary verification.
