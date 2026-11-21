# Chara Chhavani Management System
# Development Guidelines & Coding Standards

**Version:** 1.0  
**Technology:** React Native, .NET C#, MySQL  
**Purpose:** Establish consistent development standards for mobile applications, backend APIs and database implementation.

---

# PART 1 – COMMON DEVELOPMENT RULES

## 1. Core Principles

All developers must follow these rules.

1. Write clean, readable and maintainable code.
2. Do not duplicate business logic across applications.
3. Validate all user inputs.
4. Never assume that data received from a mobile application is valid.
5. Handle all expected failures explicitly.
6. Do not silently ignore exceptions.
7. Never display success before the backend confirms a successful operation.
8. Do not introduce unnecessary functionality outside the approved requirements.
9. Maintain backward compatibility when modifying existing APIs.
10. Every important business transaction must maintain an audit trail.

## 2. Application Architecture

- Four separate React Native applications.
- One common .NET backend.
- One centralized MySQL database.
- All applications communicate through backend APIs.
- Mobile applications must never connect directly to MySQL.
- Business rules must be implemented and enforced by the backend.
- The backend must be the single source of truth for transactional data.

## 3. Mandatory Development Practices

- Use separate Development, Testing/Staging and Production environments.
- Never hardcode environment-specific URLs, credentials or secrets.
- Use Git for version control.
- Create feature branches for development.
- Every feature must undergo code review.
- Do not merge code with failing mandatory tests.
- Maintain API documentation.
- Database changes must be managed through version-controlled migrations.
- Keep development, testing and production configurations separate.

---

# PART 2 – REACT NATIVE MOBILE APPLICATION GUIDELINES

Applicable to:
1. Farmer App
2. Vet Doctor App
3. Officer App
4. Chara Chhavani App

## 4. Project Structure

Maintain a consistent folder structure across all applications.

Suggested structure:

    src/
      assets/
      components/
      screens/
      navigation/
      services/
      hooks/
      context/
      models/
      utils/
      constants/
      validation/
      storage/
      config/

Responsibilities:

| Folder | Responsibility |
|---|---|
| assets | Images, icons and fonts |
| components | Reusable UI components |
| screens | Application screens |
| navigation | Screen navigation |
| services | API communication |
| hooks | Reusable React hooks |
| context | Application-level state |
| models | TypeScript interfaces/types |
| utils | Common utility functions |
| constants | Static configuration |
| validation | Form validation |
| storage | Secure/local storage |
| config | Environment configuration |

## 5. React Native Coding Rules

1. Use TypeScript for all application code.
2. Use functional components and React Hooks.
3. Do not create unnecessarily large components.
4. Keep UI rendering separate from business logic.
5. Reuse common components wherever appropriate.
6. Do not duplicate API calls inside multiple screens.
7. Maintain a centralized API service layer.
8. Use consistent naming conventions.
9. Avoid unnecessary use of global state.
10. Clean up event listeners, subscriptions and timers when components unmount.
11. Use stable keys when rendering lists.
12. Avoid unnecessary re-renders and expensive operations on the UI thread.

### Naming conventions

- Components: PascalCase
- Functions: camelCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces and types: PascalCase
- Files: Use consistent names based on component or screen purpose.

## 6. UI and Form Validation Rules

Every form must have:

- Mandatory field validation.
- Correct data type validation.
- Length validation where applicable.
- Dropdown value validation.
- Numeric range validation.
- Meaningful validation messages.

Rules:

1. Validate input before sending API requests.
2. Do not rely only on client-side validation.
3. Show the validation message near the relevant field.
4. Preserve entered values when a recoverable request fails.
5. Disable the submit button while a submission is in progress.
6. Prevent multiple submissions from repeated taps.
7. Show a confirmation message only after receiving backend success.

## 7. API Communication Rules

All API communication must use a centralized service layer.

Rules:

- Use HTTPS.
- Set appropriate request timeouts.
- Handle network errors.
- Handle authentication failures.
- Handle server errors.
- Handle invalid responses.
- Use request cancellation when appropriate.
- Do not make direct API calls from reusable UI components.

Handle the following response situations:

| Situation | Expected app behaviour |
|---|---|
| 200/201 | Process successful response |
| 400 | Display validation message |
| 401 | Handle expired/invalid authentication |
| 403 | Display permission error |
| 404 | Display record not found |
| 409 | Display business conflict |
| 422 | Display applicable business validation error |
| 429 | Handle request throttling |
| 500 | Display general server error |
| Network failure | Display connection error |
| Timeout | Display retry option |

Do not automatically retry transaction-creating POST requests unless idempotency is implemented.

## 8. Location and Camera Rules

Applicable to veterinary verification and animal admission.

### GPS capture

- Request location permission before accessing GPS.
- Check whether location services are enabled.
- Capture latitude and longitude.
- Capture GPS accuracy.
- Capture timestamp.
- Handle permission denial.
- Handle GPS unavailable scenarios.
- Do not accept invalid coordinates.

### Animal admission

- Capture animal photograph using the device camera.
- Capture current device location at photo/admission time.
- Submit photo and coordinates to the backend.
- Display admission success only after backend geofence and capacity validation.

Never rely exclusively on EXIF GPS information from an image.

If GPS accuracy is inadequate, inform the operator and request another capture. The permitted accuracy threshold must be defined by the business team.

### Image handling

- Validate file type.
- Validate file size.
- Handle camera permission errors.
- Handle failed image uploads.
- Display upload progress.
- Do not store large image binaries in application state unnecessarily.
- Do not assume a photo upload succeeded until the server confirms it.

## 9. Transaction and Network Safety

1. Every submission must handle loading, success and error states.
2. Prevent accidental duplicate submissions.
3. Use server-supported idempotency for transaction operations.
4. Never show success based only on a local button click.
5. Do not silently discard unsaved user input after a network failure.
6. Do not perform offline animal admission without explicit backend validation.
7. Do not perform stock calculations only on the mobile application.

## 10. Security Rules

- Never store passwords in plain text.
- Store authentication tokens using secure device storage.
- Do not hardcode access tokens or API secrets.
- Avoid logging personal information.
- Do not expose sensitive user information in notifications.
- Handle session expiry properly.
- Clear sensitive session information during logout.

## 11. Mobile Testing Rules

Before completing any screen, test:

- Normal successful workflow.
- Empty fields.
- Invalid inputs.
- Slow internet.
- No internet.
- API timeout.
- Permission denied.
- Repeated button taps.
- Application background/foreground.
- Application restart.
- Invalid server response.
- Session expiration.

---

# PART 3 – .NET C# BACKEND API GUIDELINES

## 12. Backend Architecture

Use ASP.NET Core Web API with a clearly separated application architecture.

Suggested project structure:

    CharaChhavani.Api/
      Controllers/
      Middleware/
      Filters/
      Extensions/

    CharaChhavani.Application/
      Services/
      DTOs/
      Interfaces/
      Validators/
      UseCases/

    CharaChhavani.Domain/
      Entities/
      Enums/
      Exceptions/
      Rules/

    CharaChhavani.Infrastructure/
      Data/
      Repositories/
      ExternalServices/
      Migrations/

    CharaChhavani.Tests/
      UnitTests/
      IntegrationTests/

Responsibilities:

| Layer | Responsibility |
|---|---|
| API | HTTP requests and responses |
| Application | Business operations and orchestration |
| Domain | Core business entities and rules |
| Infrastructure | Database and external integrations |
| Tests | Automated testing |

Keep the architecture practical. Do not introduce additional services or architectural complexity without an actual requirement.

## 13. C# Coding Standards

1. Use consistent naming conventions.
2. Follow C# and .NET coding conventions.
3. Use asynchronous methods for I/O operations.
4. Use dependency injection.
5. Prefer constructor injection.
6. Avoid static global state.
7. Keep controllers thin.
8. Put business logic in application services.
9. Use DTOs rather than exposing database entities directly.
10. Use nullable reference types.
11. Avoid unnecessary code duplication.
12. Do not use empty catch blocks.
13. Do not suppress compiler warnings without justification.
14. Avoid unnecessary database queries inside loops.
15. Use pagination for large result sets.

### Naming conventions

- Classes: PascalCase
- Interfaces: IPascalCase
- Methods: PascalCase
- Variables: camelCase
- Private fields: _camelCase
- Constants: PascalCase

## 14. API Design Standards

All APIs must follow consistent REST conventions.

Suggested endpoint structure:

    /api/v1/farmers
    /api/v1/animals
    /api/v1/vet-verifications
    /api/v1/camps
    /api/v1/admissions
    /api/v1/releases
    /api/v1/sellers
    /api/v1/fodder-purchases
    /api/v1/farm-stock-entries
    /api/v1/stock
    /api/v1/stock-adjustments
    /api/v1/feeding
    /api/v1/expenses
    /api/v1/admin/reports

Rules:

- Use nouns for resource names.
- Use HTTP methods correctly.
- Keep request and response contracts consistent.
- Implement API versioning.
- Return appropriate HTTP status codes.
- Use pagination for list endpoints.
- Support filtering and sorting where required.
- Do not return unnecessary database fields.
- Maintain consistent date and time formats.

## 15. Standard API Response Format

All APIs should follow a standard response structure.

Successful response example:

    {
      "success": true,
      "message": "Animal admitted successfully",
      "data": {
        "admissionId": "ADM-1001",
        "animalId": "ANM-1001",
        "campId": "CMP-1001",
        "status": "Admitted"
      },
      "traceId": "request-trace-id"
    }

Validation error example:

    {
      "success": false,
      "message": "Validation failed",
      "errors": [
        {
          "field": "quantity",
          "code": "INVALID_QUANTITY",
          "message": "Quantity must be greater than zero"
        }
      ],
      "traceId": "request-trace-id"
    }

The exact response contract must be shared with all application developers.

## 16. Exception Handling

Implement centralized exception handling middleware.

Rules:

1. All unhandled exceptions must be caught at the global exception boundary.
2. Known business exceptions must return meaningful error responses.
3. Validation failures must return field-level errors.
4. Database exceptions must not expose internal SQL details.
5. Stack traces must never be returned to mobile applications.
6. Every unexpected exception must be logged.
7. Every request should have a correlation/trace ID.
8. Never hide an exception and return a false success response.

Expected business errors should be handled explicitly.

Examples:

- Animal is not verified.
- Animal is already admitted.
- Camp capacity is full.
- Animal is outside the geofence.
- Insufficient fodder stock.
- Invalid stock location.
- Unauthorized camp access.
- Duplicate transaction submission.

## 17. Business Logic Rules

### Animal verification

- Only authorized veterinary doctors can verify animals.
- A rejection reason is mandatory.
- Verification history must be maintained.
- Resubmission must not overwrite previous verification history.

### Animal admission

Before admission, backend must validate:

1. Animal exists.
2. Animal is verified.
3. Animal is not currently admitted elsewhere.
4. Camp exists and is active.
5. Operator is assigned to the camp.
6. GPS coordinates are valid.
7. GPS accuracy satisfies the configured threshold.
8. Location is inside the camp geofence.
9. Camp has available capacity.

All critical admission checks and the admission record creation must be performed atomically.

### Animal release

- Only an actively admitted animal can be released.
- Release must update the active admission.
- Release must update camp occupancy.
- Historical admission records must remain available.

### Fodder purchase

- Validate seller.
- Validate fodder type.
- Validate quantity and unit.
- Calculate total amount on the server.
- Insert purchase and stock transaction atomically.

### In Farm stock

- Validate fodder type.
- Validate quantity and unit.
- Record the source where applicable.
- Insert stock transaction and update balance atomically.

### Feeding

- Validate the animal group.
- Validate that the camp currently has animals belonging to the selected group.
- Validate the selected stock location.
- Validate available stock.
- Deduct stock atomically.
- Record feeding history.

### Stock adjustments

- Validate adjustment type.
- Validate quantity.
- Require a reason.
- Prevent negative stock.
- Record the transaction.

## 18. Concurrency and Transaction Rules

This is mandatory for operations involving capacity and inventory.

Use database transactions for:

- Animal admission.
- Animal release.
- Fodder purchases.
- In Farm stock entries.
- Feeding entries.
- Stock adjustments.

### Camp capacity

Two operators or simultaneous requests must not admit animals beyond the camp's configured capacity.

The backend must enforce capacity validation and admission creation in one transaction using an appropriate locking strategy.

### Fodder stock

Two simultaneous feeding requests must not deduct more stock than is available.

The backend must lock or atomically update the relevant stock balance, validate availability and save the stock transaction.

### Duplicate requests

Use idempotency keys or equivalent server-side duplicate protection for transaction-creating requests.

The same request retried after a timeout must not create duplicate admissions, purchases or feeding records.

## 19. Authentication and Authorization

- Authenticate every protected API.
- Apply role-based authorization.
- Apply camp-level authorization.
- Farmer can access only their permitted records.
- Vet Doctor can access authorized verification records.
- Camp Operator can access only their assigned camp records.
- Officer can access camp registration functions according to assigned permissions.
- Admin Officer can monitor the overall system.
- Never rely on a role value sent by the mobile application without validating server-side permissions.

## 20. API Logging

Maintain structured logs for:

- Request trace ID.
- API endpoint.
- Request outcome.
- Execution time.
- Error code.
- Exception details.
- User ID and relevant camp ID where permitted.

Never log:

- Passwords.
- OTP values.
- Authentication tokens.
- Sensitive personal information.
- Full sensitive request payloads.

---

# PART 4 – MYSQL DATABASE GUIDELINES

## 21. Database Architecture

Use MySQL with InnoDB as the transactional storage engine.

Database design must follow relational database principles.

Rules:

1. Use primary keys on all tables.
2. Define foreign keys for relationships.
3. Use unique constraints for unique business identifiers.
4. Avoid unnecessary duplicate data.
5. Use appropriate indexes.
6. Use transactions for critical operations.
7. Maintain data integrity at database level wherever possible.
8. Use migrations for every schema modification.
9. Do not modify production tables manually without a controlled migration.
10. Avoid storing derived values without a clear synchronization strategy.

## 22. Naming Conventions

Use consistent snake_case naming.

Examples:

Tables:
- farmers
- animals
- veterinary_verifications
- camps
- camp_geofences
- animal_admissions
- animal_releases
- sellers
- fodder_types
- measurement_units
- fodder_purchases
- stock_balances
- stock_transactions
- feeding_records
- expense_records

Columns:
- farmer_id
- animal_id
- camp_id
- created_at
- updated_at
- verified_at
- quantity
- total_amount

Rules:
- Table names should be plural.
- Column names should use snake_case.
- Avoid spaces and reserved SQL keywords.
- Use consistent foreign key naming.

## 23. Data Type Standards

Use appropriate data types.

| Data | Recommended type |
|---|---|
| Internal numeric IDs | BIGINT |
| Public unique identifiers | VARCHAR with unique constraint or UUID |
| Names | VARCHAR |
| Descriptions | TEXT |
| Quantity | DECIMAL(18,3) |
| Rate | DECIMAL(18,4) |
| Monetary amount | DECIMAL(18,2) |
| Latitude | DECIMAL(10,7) |
| Longitude | DECIMAL(10,7) |
| Date | DATE |
| Date and time | DATETIME(6) |
| Boolean flags | BOOLEAN/TINYINT(1) |
| Status | Controlled code/enum or lookup relationship |

Never use FLOAT or DOUBLE for financial calculations.

## 24. Master and Transaction Tables

Keep master information separate from transactional records.

### Master data examples

- Farmers
- Animals
- Camps
- Camp owners/operators
- Animal types
- Animal breeds
- Fodder types
- Measurement units
- Expense categories
- Sellers

### Transaction data examples

- Veterinary verifications
- Animal admissions
- Animal releases
- Fodder purchases
- In Farm stock receipts
- Stock transactions
- Feeding records
- Expenses

Do not overwrite historical transactional records when master information changes.

## 25. Animal Data Integrity

Rules:

- Every animal must have a unique internal ID.
- Animal identification/tag number must follow the agreed uniqueness scope.
- Every admission must reference an existing animal and camp.
- Maintain separate verification records.
- Maintain admission and release history.
- An animal cannot have two simultaneous active admissions.
- A released animal's historical records must not be deleted.

## 26. Fodder Stock Database Rules

Maintain stock by:

- Camp
- Stock location
- Fodder type
- Base measurement unit

Maintain transaction types such as:

- PURCHASE_RECEIVED
- FARM_STOCK_RECEIVED
- FEEDING_ISSUED
- ADJUSTMENT_IN
- ADJUSTMENT_OUT

Maintain:
- Transaction ID
- Camp ID
- Fodder type
- Stock location
- Transaction type
- Quantity
- Unit
- Transaction date
- Reference transaction
- Created by
- Created timestamp

### Critical stock rule

Stock calculations must not mix incompatible units.

For example:

1 quintal = 100 kg.

If a purchase is entered in quintals and feeding is entered in kilograms, the backend must normalize both to the agreed base unit before calculating stock.

Store both the entered quantity/unit and normalized quantity where required.

### Stock ledger

The stock transaction ledger must be the permanent historical record.

If an existing stock entry requires correction, create a reversal/correction transaction rather than silently deleting the original transaction.

If a stock balance table is maintained for faster reads, update it in the same database transaction as the corresponding ledger entry.

## 27. Database Transaction Rules

Use database transactions for operations that modify multiple related records.

Examples:

**Fodder purchase**
- Create purchase record.
- Create stock ledger entry.
- Update stock balance.

All must succeed together or be rolled back.

**Feeding**
- Check stock availability.
- Insert feeding record.
- Insert stock deduction.
- Update stock balance.

All must succeed together or be rolled back.

**Animal admission**
- Lock/check animal.
- Validate current admission.
- Lock/check camp capacity.
- Validate capacity.
- Create admission.
- Update occupancy if maintained.

All must succeed together or be rolled back.

## 28. Indexing Rules

Create indexes for frequently queried fields.

Examples:

- farmers.mobile_number
- animals.farmer_id
- animals.animal_type_id
- veterinary_verifications.animal_id
- veterinary_verifications.status
- camps.owner_id
- animal_admissions.animal_id
- animal_admissions.camp_id
- stock_transactions.camp_id
- stock_transactions.fodder_type_id
- feeding_records.camp_id
- expense_records.camp_id

Use composite indexes based on actual query patterns.

Do not create indexes on every column without reason.

## 29. Data Integrity and Audit Rules

- Use NOT NULL where required.
- Use foreign key constraints.
- Use unique constraints for identifiers.
- Use CHECK constraints where supported and appropriate.
- Maintain created_at and updated_at.
- Maintain created_by for important transactions.
- Use soft deletion only where appropriate for master records.
- Do not hard-delete financial, stock or admission history.
- Maintain an audit trail for important changes.
- Use UTC for stored timestamps and ISO 8601 for API communication.

## 30. Database Performance and Maintenance

- Avoid SELECT * in production queries.
- Use pagination for large datasets.
- Avoid N+1 query problems.
- Review slow queries.
- Use parameterized SQL.
- Never construct SQL using untrusted input.
- Use connection pooling.
- Take regular database backups.
- Test backup restoration.
- Manage database migrations through source control.

---

# PART 5 – API, DATABASE AND MOBILE INTEGRATION RULES

## 31. Single Source of Truth

The backend is authoritative for:

- Animal verification status.
- Animal admission status.
- Camp capacity.
- Geofence validation.
- Fodder stock.
- Feeding quantities.
- Expense records.

Do not independently calculate and persist authoritative business balances inside mobile applications.

## 32. API Contract Rules

Before implementing a feature:

1. Finalize its request DTO.
2. Finalize its response DTO.
3. Define mandatory and optional fields.
4. Define validation rules.
5. Define error responses.
6. Document HTTP status codes.
7. Share the contract with mobile developers.
8. Write tests against the contract.

Any breaking API change requires coordination with all affected applications.

## 33. File and Photograph Management

- Store actual photographs in appropriate file/object storage.
- Store file reference, path, type, size and metadata in MySQL.
- Do not store large image binaries in normal transactional tables.
- Validate uploads on the backend.
- Use authorized access to photographs.
- Avoid exposing unrestricted public file links.

---

# PART 6 – ERROR PREVENTION AND QUALITY ASSURANCE

## 34. Required Testing Levels

### Mobile Application Testing

- Component tests.
- Form validation tests.
- Navigation tests.
- API integration tests.
- Permission and GPS tests.
- Device compatibility tests.
- End-to-end workflow tests.

### Backend Testing

- Unit tests.
- Service-level tests.
- API integration tests.
- Authentication and authorization tests.
- Exception handling tests.
- Transaction and concurrency tests.
- Performance tests for critical APIs.

### Database Testing

- Migration tests.
- Foreign key tests.
- Unique constraint tests.
- Transaction rollback tests.
- Data integrity tests.
- Stock consistency tests.
- Query performance tests.

Use a real MySQL test environment for integration tests that depend on MySQL-specific behaviour.

## 35. Mandatory Business Scenario Tests

The following cases must pass before release.

| Scenario | Expected result |
|---|---|
| Farmer submits valid animal | Animal registered |
| Farmer submits duplicate tag number | Duplicate validation |
| Vet approves animal | Status becomes verified |
| Vet rejects animal | Rejection reason recorded |
| Farmer corrects rejected animal | Resubmission accepted |
| Unverified animal admission | Rejected |
| Animal outside geofence | Admission rejected |
| Animal inside geofence | Admission can proceed if other validations pass |
| GPS unavailable | Safe failure with useful message |
| Camp capacity full | New admission rejected |
| Same animal admitted twice | Duplicate admission prevented |
| Animal released | Active count reduced |
| Same animal admitted at a new camp after release | Independent admission allowed |
| Purchase saved | Store stock increases once |
| In Farm entry saved | In Farm stock increases once |
| Feeding saved | Selected stock decreases once |
| Insufficient stock | Feeding rejected |
| Stock adjustment saved | Correct balance updated |
| Repeated transaction request | No duplicate transaction |
| Two simultaneous admissions at capacity boundary | Capacity never exceeded |
| Two simultaneous feeding requests | Stock never becomes negative |
| Database transaction fails | Partial transaction rolled back |

## 36. Error Handling Standards

Every developer must distinguish between:

**Validation errors**
- Missing mandatory fields.
- Invalid units.
- Invalid quantities.

**Business errors**
- Animal not verified.
- Camp capacity full.
- Insufficient stock.
- Duplicate admission.

**Technical errors**
- Network failure.
- Database unavailable.
- Unexpected exception.
- File upload failure.

Each error must have:
- A meaningful internal error code.
- A useful user-facing message.
- A trace ID where applicable.
- Appropriate logging.
- A defined recovery or retry behaviour where possible.

## 37. Code Review Checklist

Before merging code, reviewers must verify:

- [ ] Requirements are followed.
- [ ] Code is readable and maintainable.
- [ ] No unnecessary functionality is added.
- [ ] Inputs are validated.
- [ ] Authorization is implemented.
- [ ] Exceptions are handled.
- [ ] No sensitive information is exposed.
- [ ] Database transactions are correct.
- [ ] No duplicate transaction risk exists.
- [ ] Performance has been considered.
- [ ] Relevant automated tests pass.
- [ ] API documentation is updated where necessary.

## 38. Definition of Done

A development task is complete only when:

1. The implementation matches the approved requirement.
2. Code review is completed.
3. Relevant unit tests pass.
4. Relevant integration tests pass.
5. Negative scenarios are tested.
6. Error handling is implemented.
7. API documentation is updated where applicable.
8. Database migration is included where required.
9. No known critical or high-severity defects remain.
10. The feature is verified in the testing environment.

## 39. Production Release Checklist

Before deploying:

- All mandatory tests pass.
- No unresolved critical or high-severity issues.
- Database backup is available.
- Migrations are reviewed and tested.
- Production configuration is verified.
- Authentication and authorization are verified.
- API logs and error monitoring are enabled.
- File storage is accessible.
- Mobile application configuration is verified.
- Critical workflows are smoke-tested.
- Rollback and recovery procedures are documented.

---

# PART 7 – FINAL ENGINEERING RULE

**No feature is complete merely because it works in the developer's environment.**

It must also:

- Work with valid data.
- Reject invalid data.
- Handle unexpected inputs.
- Handle network interruptions.
- Handle database failures safely.
- Protect against duplicate submissions.
- Preserve data integrity.
- Provide understandable error messages.
- Pass the required tests.

The primary engineering goal is to prevent data corruption, unhandled exceptions, duplicate transactions, incorrect stock balances and unauthorized operations.

**Important:** Absolute zero unexpected errors cannot be guaranteed in any software system. These standards are designed to minimize defects, make failures controlled and ensure that errors do not silently corrupt business data.

---

# PART 8 – REACT WEB DASHBOARD DEVELOPMENT GUIDELINES

**Technology:** React + TypeScript

## 40. Project Structure

Use a modular and feature-based folder structure.

    src/
      assets/
      components/
      layouts/
      pages/
      features/
        dashboard/
        farmers/
        animals/
        camps/
        fodder/
        stock/
        feeding/
        expenses/
        reports/
      services/
      hooks/
      context/
      routes/
      types/
      utils/
      constants/
      validations/
      config/

Responsibilities:

| Folder | Responsibility |
|---|---|
| assets | Images, icons and fonts |
| components | Reusable UI components |
| layouts | Main dashboard layout |
| pages | Route-level pages |
| features | Feature-specific components and logic |
| services | API integration |
| hooks | Reusable React hooks |
| context | Shared application state |
| routes | Route configuration |
| types | TypeScript interfaces |
| utils | Common utilities |
| validations | Form validation |
| config | Environment configuration |

## 41. React Coding Standards

1. Use TypeScript throughout the application.
2. Use functional components and React Hooks.
3. Avoid unnecessarily large components.
4. Keep API calls outside presentation components.
5. Reuse common components.
6. Use consistent naming conventions.
7. Avoid unnecessary global state.
8. Avoid unnecessary component re-rendering.
9. Use stable keys when rendering lists.
10. Handle component loading and error states.
11. Use reusable table, form, modal and pagination components.
12. Do not duplicate backend business rules in the frontend.

## 42. Dashboard UI Standards

Maintain a consistent layout across all dashboard modules.

Common layout:

- Sidebar navigation.
- Header with logged-in user information.
- Main content area.
- Breadcrumb navigation.
- Page title.
- Search and filter section.
- Data table or summary cards.
- Pagination.

The dashboard must be responsive and usable on desktop and tablet screens.

## 43. Table and Data Management Rules

All data tables must support appropriate features:

- Server-side pagination.
- Search.
- Filtering.
- Sorting.
- Loading indicator.
- Empty state.
- Error state.
- Refresh functionality where appropriate.

Rules:

1. Do not load all database records into the browser.
2. Use server-side pagination for large datasets.
3. Preserve filter values during pagination.
4. Display meaningful empty-state messages.
5. Avoid unnecessary API requests.
6. Show dates and quantities consistently.
7. Handle failed API requests without losing the user's filter state.

## 44. Form Development Rules

- Use reusable form components.
- Implement field-level validation.
- Display backend validation errors.
- Prevent duplicate form submissions.
- Disable submit actions while saving.
- Preserve user-entered data after recoverable failures.
- Confirm sensitive or irreversible actions such as animal release.
- Do not display success notifications until the API confirms success.

## 45. Map and Geofence Rules

Applicable to Chara Chhavani registration.

- Display the selected camp location.
- Allow authorized users to draw a geofence polygon.
- Allow editing the polygon before saving.
- Validate the polygon before submission.
- Display the saved geofence when viewing camp details.
- Clearly distinguish saved boundaries from unsaved edits.
- Submit the boundary coordinates to the backend.
- Do not implement geofence admission decisions independently in the browser.

The backend remains authoritative for geofence validation.

## 46. Dashboard Security Rules

- Use authenticated API requests.
- Apply role-based page and action permissions.
- Do not rely only on hiding menu items.
- Backend authorization is mandatory.
- Protect administrative routes.
- Handle session expiration.
- Never store authentication credentials in localStorage.
- Avoid exposing sensitive farmer or animal information unnecessarily.

## 47. React Web Testing

Test the following:

- Page rendering.
- Navigation.
- API integration.
- Form validation.
- Table pagination.
- Search and filtering.
- Sorting.
- Authentication.
- Authorization.
- Map and geofence editing.
- Failed API requests.
- Browser refresh.
- Session expiry.
- Responsive layouts.

## 48. Browser Compatibility

The dashboard must be tested on the agreed supported browsers, including:

- Google Chrome.
- Microsoft Edge.

The final supported browser versions must be defined by the project team.


Additional rules I recommend for the entire system
These are not React-specific. They apply to React Native, React Web, .NET and MySQL together.
Area	Additional rule	Importance
API contracts	Maintain a single API specification using OpenAPI/Swagger	Critical
Date/time	Store timestamps in UTC and display in India Standard Time	High
Units	Maintain standard units and conversion rules	Critical
Transactions	Use idempotency for important POST operations	Critical
Database	Use version-controlled migrations	Critical
File uploads	Define image size, format and storage limits	High
Security	Implement role and camp-level permissions	Critical
Logging	Maintain trace IDs across mobile/web and backend	High
Testing	Use automated regression tests for critical workflows	Critical
Deployment	Maintain separate Dev, Staging and Production environments	High

3. One more important recommendation: Common API contract
Since you have five clients communicating with one backend, establish an API contract before development.
Recommended integration architecture
Farmer App

Vet Doctor App

Officer App

Camp App


React Admin Dashboard



Common .NET REST API

OpenAPI / Swagger specification


MySQL Database


The OpenAPI specification should define:
- Endpoint and HTTP method.
- Request DTO.
- Response DTO.
- Mandatory fields.
- Validation rules.
- Error codes.
- Authentication requirements.
This prevents mobile and web developers from independently interpreting API requirements.

4. Final technology stack

Mobile applications

React Native + TypeScript 4 apps

Web dashboard

React + TypeScript 1 app

Backend

ASP.NET Core Web API + C#

Database

MySQL + InnoDB



My recommendation: Keep React Native and React as separate projects, but maintain consistent TypeScript types, API contracts, validation rules and naming conventions.

**End of Development Guidelines – Version 1.0**