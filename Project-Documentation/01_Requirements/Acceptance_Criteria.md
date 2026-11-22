# Acceptance Criteria (Gherkin BDD Format)
## Chara Chhavani Management System

---

## 1. Feature: Mobile Authentication & Security

```gherkin
Feature: Mobile OTP Login for Standard Personas
  As a registered user (Farmer, Vet, Operator, Officer)
  I want to receive an OTP on my mobile phone
  So that I can authenticate without passwords

  Scenario: Successful OTP dispatch and login
    Given a user enters a valid 10-digit mobile number "9822012345"
    And specifies role "Farmer"
    When the user requests OTP
    Then the API returns HTTP 200 with message "OTP sent successfully"
    And when the user submits OTP "123456"
    Then the system returns a valid JWT Bearer token
    And user profile is authenticated

  Scenario: Admin dashboard login with Username and Password
    Given an administrator accesses the Web Admin portal
    When the admin enters username "admin" and password "AdminPassword@123"
    Then the system returns HTTP 200 with an Admin JWT token
    And grants access to statewide management controls
```

---

## 2. Feature: Cattle Admission & Spatial Geofence Verification

```gherkin
Feature: Strict Point-in-Polygon Animal Admission (Rule 9.6)
  As a Cattle Camp Operator
  I want to admit approved livestock only when present inside the camp
  So that ghost cattle claims are strictly prevented

  Scenario: Successful admission inside camp geofence
    Given an animal with code "ANM-2026-0001" has verification status "Verified"
    And the animal is not currently admitted in any camp
    And the Paithan camp has active capacity remaining
    And the device GPS coordinates are latitude 19.82 and longitude 75.33
    When the operator submits the admission request with a photo
    Then NetTopologySuite confirms the point is inside the polygon
    And the system returns HTTP 201 Created
    And the camp active animal count increments by 1

  Scenario: Admission rejected when device is outside camp geofence
    Given an animal with code "ANM-2026-0001" has verification status "Verified"
    And the device GPS coordinates are latitude 18.00 and longitude 74.00
    When the operator attempts to admit the animal
    Then the system returns HTTP 422 Unprocessable Entity
    And displays "Coordinates are OUTSIDE the registered geofence"
    And no admission record is created

  Scenario: Attempting offline admission under Rule 9.6
    Given the operator's mobile device is offline
    When the operator attempts to enqueue an animal admission
    Then the OfflineActionQueue throws "ERR_ONLINE_GEOFENCE_REQUIRED"
    And the action is refused from offline storage
```

---

## 3. Feature: Fodder Stock Inventory & Feeding Ledgers

```gherkin
Feature: Fodder Inventory & Non-Negative Balance Enforcement
  As a Camp Operator
  I want to record fodder purchases and daily feeding
  So that government fodder subsidies are verified

  Scenario: Recording fodder purchase with quintal normalization
    Given a camp with ID 1 has 500 kg of Green Fodder in store
    When the operator records a purchase of 2000 kg (20 Quintals) at Rs. 400 per Quintal
    Then the system stores the purchase record
    And the camp store stock increases to 2500 kg

  Scenario: Preventing negative stock balance during feeding
    Given a camp has 300 kg of available Dry Fodder
    When the operator attempts to record a feeding distribution of 500 kg
    Then the system rejects the transaction with HTTP 422 Unprocessable Entity
    And displays "Cannot feed more than available stock"
    And the available balance remains 300 kg
```

---

## 4. Feature: Statutory Audit Reports & Excel Compatibility

```gherkin
Feature: RFC 4180 CSV Export with UTF-8 BOM
  As a State Government Auditor
  I want to download audit logs for admissions, fodder, expenses, and inspections
  So that I can open reports in Microsoft Excel without Marathi text distortion

  Scenario: Exporting fodder reconciliation audit report
    Given the admin requests "/api/v1/admin/reports/export?reportType=fodder"
    When the response is generated
    Then the HTTP status code is 200 OK
    And the Content-Type is "text/csv; charset=utf-8"
    And the first three bytes of the byte stream are UTF-8 BOM "\uFEFF"
    And Devanagari text renders flawlessly in spreadsheet applications
```
