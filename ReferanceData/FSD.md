 **Screen-wise Functional Specification (FSD) – Version 1.0** based on the BRD.

This will translate the business requirements into actual application screens, fields, buttons, validations and user actions.

# **Screen-wise functional specification**

**Application coverage**

Farmer App&#x20;

Mobile



Vet Doctor App&#x20;

Mobile



Officer App&#x20;

Mobile



Chara Chhavani App&#x20;

Mobile



Admin Dashboard&#x20;

Web



# Screen-wise Functional Specification (FSD)

## Chara Chhavani Management System

**Version:** 1.0 – Draft\
**Reference:** BRD Version 1.0

---

# 1. Farmer Mobile Application

## 1.1 Login / Registration Screen

**Purpose:** Allow farmers to access the application.

Fields:

- Mobile number
- OTP

Actions:

- Send OTP
- Verify OTP
- Register profile (for new users)

## 1.2 Farmer Profile Screen

Fields:

- Farmer name
- Mobile number
- Address
- Village
- Taluka
- District
- State

Actions:

- Save profile
- Edit profile
- View profile

## 1.3 Dashboard Screen

Display:

- Farmer information
- Total registered animals
- Pending verification animals
- Verified animals
- Rejected animals
- Admitted animals

Actions:

- Register new animal
- View animals
- View profile

## 1.4 Animal Registration Screen

Fields:

- Animal type (dropdown)
- Breed (dropdown or configured list)
- Gender
- Age
- Identification/tag number (if applicable)
- Animal photograph
- Other required animal details

Actions:

- Capture/upload photograph
- Submit registration

Validations:

- Mandatory fields must be completed.
- Each animal must receive a unique system-generated ID.
- Duplicate identification numbers should be checked where applicable.

## 1.5 My Animals Screen

Display animal list with:

- Animal ID
- Animal type
- Breed
- Registration date
- Verification status
- Current admission status

Filters:

- All
- Pending
- Verified
- Rejected
- Admitted
- Released

Action:

- View animal details

## 1.6 Animal Details Screen

Display:

- Animal information
- Animal photograph
- Registration details
- Verification status
- Verification remarks
- Admission history

Actions:

- Edit rejected animal details
- Resubmit for verification

---

# 2. Government Veterinary Doctor Mobile Application

## 2.1 Login Screen

Fields:

- Registered mobile number
- OTP

## 2.2 Dashboard Screen

Display:

- Pending verification count
- Verified count
- Rejected count

Actions:

- View pending animals
- View verification history

## 2.3 Pending Verification List

Display:

- Animal ID
- Farmer name
- Farmer village
- Animal type
- Registration date

Actions:

- View details
- Start verification

## 2.4 Animal Verification Details Screen

Display:

- Farmer details
- Animal details
- Submitted photograph
- Animal identification details
- Farmer's registered location

Fields:

- Verification result
- Remarks
- Verification photograph (if required)

Actions:

- Approve
- Reject

Validations:

- Rejection requires a reason.
- Verification date and doctor ID must be recorded.
- Current GPS location should be captured during the verification visit.

## 2.5 Verification History Screen

Display:

- Animal ID
- Farmer name
- Verification date
- Result
- Remarks

---

# 3. Officer Mobile Application

## 3.1 Login Screen

Fields:

- Registered mobile number
- OTP

## 3.2 Dashboard Screen

Display:

- Registered Chara Chhavani count
- Registered owner count
- Camp registration summary

## 3.3 Register Chara Chhavani Screen

Fields:

- Camp name
- Camp address
- Village
- Taluka
- District
- State
- Camp location
- Configurable animal capacity
- Owner/operator details

Owner/operator fields:

- Owner name
- Mobile number
- Address

Actions:

- Save camp
- Register owner/operator

## 3.4 Camp Location and Geofence Screen

Features:

- Display map
- Capture/select camp location
- Draw camp boundary
- Edit boundary
- Save geofence

Validations:

- Geofence must be a valid geographical area.
- Camp location must be associated with its geofence.

## 3.5 Registered Camps Screen

Display:

- Camp name
- Owner name
- Location
- Capacity
- Registration status

Actions:

- View camp
- View owner details

---

# 4. Chara Chhavani Owner/Operator Mobile Application

## 4.1 Login Screen

Fields:

- Registered mobile number
- OTP

## 4.2 Dashboard Screen

Display:

- Camp name
- Total camp capacity
- Currently admitted animals
- Available capacity
- Today's feeding summary
- Store stock summary
- In Farm stock summary
- Today's expenses

Quick actions:

- Admit animal
- Record fodder purchase
- Record In Farm stock
- Record feeding
- Add expense

## 4.3 Animal Search Screen

Search using:

- Animal ID
- Farmer mobile number
- Animal tag number (if applicable)

Display:

- Animal ID
- Farmer name
- Animal type
- Verification status
- Current admission status

Action:

- Start admission

Validation:

- Only verified animals can be admitted.
- Already admitted animals cannot be admitted again.
- Camp capacity must be available.

## 4.4 Animal Admission Screen

Display:

- Animal details
- Farmer details
- Animal ID

Fields/actions:

- Capture animal photograph
- Capture current GPS coordinates
- Admission date and time

System validations:

- Current location must be inside the registered camp geofence.
- Available camp capacity must be greater than zero.
- Animal must have verified status.

On successful admission:

- Generate admission record.
- Update camp animal count.

## 4.5 Admitted Animals Screen

Display:

- Animal ID
- Animal type
- Farmer name
- Admission date

Filters:

- Animal type
- Admission date

Actions:

- View details
- Release animal

## 4.6 Animal Release Screen

Display:

- Animal information
- Admission details

Fields:

- Release date and time
- Release remarks (if required)

Action:

- Confirm release

System updates:

- Mark admission record as released.
- Decrease active camp animal count.
- Release available camp capacity.

## 4.7 Seller Management Screen

Display:

- Seller name
- Mobile number
- Seller type

Seller types:

- Farmer
- Other seller

Actions:

- Register seller
- View seller details

If the seller is already registered as a farmer, reuse the existing farmer information.

## 4.8 Fodder Purchase Screen

Fields:

- Seller
- Purchase date
- Fodder type
- Quantity
- Unit
- Rate per unit
- Total amount

Actions:

- Save purchase

System calculation:

Total Amount = Quantity × Rate

On successful entry:

- Increase Store stock.
- Record purchase transaction.

## 4.9 In Farm Stock Entry Screen

Fields:

- Entry date
- Farmer/source (if applicable)
- Fodder type
- Quantity
- Unit
- Remarks (optional)

Actions:

- Save stock entry

On successful entry:

- Increase In Farm stock.

## 4.10 Stock Overview Screen

Display separately:

**Store**

- Fodder type
- Available quantity
- Unit

**In Farm**

- Fodder type
- Available quantity
- Unit

Actions:

- View stock history
- Add stock adjustment

## 4.11 Stock Adjustment Screen

Fields:

- Stock location (Store/In Farm)
- Fodder type
- Adjustment type (Increase/Decrease)
- Quantity
- Unit
- Reason

Actions:

- Save adjustment

Validations:

- Quantity must be greater than zero.
- Decrease adjustment cannot exceed available stock.
- Reason is mandatory.

## 4.12 Feeding Entry Screen

Fields:

- Feeding date
- Feeding time
- Animal type/group
- Fodder type
- Stock location (Store/In Farm)
- Quantity
- Unit

Actions:

- Save feeding entry

System operations:

- Deduct quantity from selected stock location.
- Save feeding transaction.
- Update available stock.

Validations:

- Selected stock must be available.
- Quantity must not exceed available stock.
- Animal group must have active admitted animals.

## 4.13 Feeding History Screen

Display:

- Date
- Time
- Animal type
- Fodder type
- Stock location
- Quantity
- Unit

Filters:

- Date range
- Animal type
- Fodder type

## 4.14 Expense Entry Screen

Fields:

- Expense date
- Expense category
- Amount
- Description (optional)

Categories:

- Labour charges
- Water expenses
- Electricity
- Transportation
- Other

Actions:

- Save expense

## 4.15 Expense History Screen

Display:

- Date
- Expense category
- Amount
- Description

Filters:

- Date range
- Expense category

---

# 5. Admin Officer Web Dashboard

## 5.1 Login Screen

Fields:

- Username/mobile number
- Password or configured authentication method

## 5.2 Dashboard Screen

Display:

- Total registered farmers
- Total registered animals
- Pending animal verification
- Verified animals
- Total Chara Chhavani centres
- Total active admitted animals
- Total camp capacity
- Overall Store and In Farm stock
- Total fodder purchase amount
- Total operational expenses

## 5.3 Chara Chhavani Registration Screen

Fields:

- Camp name
- Address
- Village
- Taluka
- District
- State
- Camp location
- Animal capacity

Owner/operator details:

- Name
- Mobile number
- Address

Actions:

- Register camp
- Register/link owner
- Save details

## 5.4 Geofence Management Screen

Features:

- Interactive map
- Search location
- Draw camp boundary
- Edit boundary
- Save boundary

Display:

- Camp location
- Geofence boundary
- Camp information

## 5.5 Camp Management Screen

Display:

- Camp name
- Owner/operator
- Location
- Capacity
- Active animal count
- Available capacity
- Camp registration status

Actions:

- View details
- Edit permitted details
- View geofence

## 5.6 Farmer Management Screen

Display:

- Farmer ID
- Farmer name
- Mobile number
- Village
- Total registered animals

Actions:

- Search farmer
- View farmer profile
- View associated animals

## 5.7 Animal Management Screen

Display:

- Animal ID
- Farmer
- Animal type
- Verification status
- Current camp
- Admission status

Filters:

- Verification status
- Animal type
- Camp
- Admission status

## 5.8 Fodder and Stock Monitoring Screen

Display:

- Camp
- Fodder type
- Store stock
- In Farm stock
- Total available stock

Actions:

- View stock transactions
- View purchase history
- View feeding history
- View adjustment history

## 5.9 Expense Monitoring Screen

Display:

- Camp
- Expense category
- Date
- Amount

Filters:

- Camp
- Date range
- Expense category

## 5.10 Reports Screen

Available reports:

- Farmer registration
- Animal registration
- Veterinary verification
- Camp-wise animal admission
- Animal release
- Camp capacity utilization
- Fodder purchase
- Store stock
- In Farm stock
- Feeding consumption
- Stock adjustments
- Operational expenses

---

# 6. Common Dropdown Configuration

The following values should be configurable or centrally maintained where appropriate:

- Animal types
- Animal breeds
- Fodder types
- Measurement units
- Expense categories
- Rejection reasons, if standardized
- Stock adjustment reasons, if standardized

Initial measurement units may include:

- Kilogram (Kg)
- Quintal
- Ton
- Bundle

Final units must be confirmed by the business team.

# 7. Important System Validations

1. Unique animal ID generation.
2. Duplicate animal identification checks.
3. Verified status required before admission.
4. Geofence validation before admission.
5. Camp capacity validation.
6. Prevention of simultaneous active admissions.
7. Stock availability validation.
8. Prevention of negative stock.
9. Mandatory reason for stock adjustment.
10. Automatic stock updates following purchases, In Farm entries and feeding.

# 8. Pending Decisions

The following requirements are not yet finalized:

1. Exact animal registration fields.
2. Exact farmer registration fields.
3. Veterinary verification location accuracy rules.
4. Whether Officer registration requires Admin approval.
5. Whether camp owners can edit their camp information.
6. Whether capacity is measured simply by animal count.
7. Whether stock units must be identical for every fodder type.
8. Whether GPS failure should prevent admission or allow a separately authorized exception.
9. Whether offline admission is required.
10. Whether operators can edit or cancel previously recorded transactions.

---

**End of Screen-wise Functional Specification – Version 1.0**

## **2. Recommended next step**

Before UI design and development, I recommend finalizing the following three items:

- **Master data:** Animal types, breeds, fodder types and measurement units.
- **Field definitions:** Exact farmer, animal, vet and camp registration fields.
- **Permissions:** What Officer, Admin and Camp Owner can create, edit and approve.

These will help convert the FSD into development-ready screen designs and API requirements.
