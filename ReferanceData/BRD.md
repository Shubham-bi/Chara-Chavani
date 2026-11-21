Chara Chhavani Management System

The objective remains a simple system for managing farmers, animals, Chara Chhavani operations, fodder stock and expenses.
1. Confirmed application structure
You will have four separate mobile applications and one web dashboard.
Mobile applications
Four separate apps

Farmer App

Farmer and animal registration, verification status


Vet Doctor App

Animal verification at farmer location


Officer App

Responsibilities yet to be finalized


Chara Chhavani App

Animal admission, fodder stock, feeding and expenses




Web application
Admin Officer Dashboard

Register Chara Chhavani and owners, define geofences, monitor overall system data.


2. Updated end-to-end workflows
Workflow 1: Farmer registration to animal admission
1. Farmer registration
   
   Farmer registers through the Farmer App.
2. Animal registration
   
   Farmer registers every animal separately and submits its details.
3. Veterinary verification
   
   Government Vet Doctor visits the farmer's location, checks the animal and verifies the submitted details.
4. Verification result
   
   Vet approves or rejects the animal. If rejected, the farmer can correct details and resubmit for verification.
5. Animal arrival at Chara Chhavani
   
   Farmer takes the verified animal to a Chara Chhavani.
6. Admission by operator
   
   Operator captures the animal's photo and location. The system validates that the photo's captured location is within the registered Chara Chhavani geofence.
7. Admission confirmation
   
   Animal becomes admitted to that Chara Chhavani.
Important recommendation:

Keep these two location validations separate:
- Veterinary verification: GPS location should correspond to the farmer's location.
- Animal admission: GPS location should be within the Chara Chhavani geofence.
For admission, store the photo, capture timestamp, latitude, longitude and Chara Chhavani ID.

Also, don't rely only on the photo's embedded GPS metadata. Capture the device's current location at the time of taking the photo and validate it against the geofence.
Workflow 2: Chara Chhavani registration and geofence
1. Admin/Office registers Chara Chhavani
   
   Enters camp details and owner/operator details.
2. Geofence creation
   
   Admin draws the boundary of the Chara Chhavani on a map.
3. Camp activation
   
   The Chara Chhavani and its owner/operator are registered in the system and can use the Chara Chhavani App.






















9











My suggestion is to use a polygon geofence rather than only a circular radius because actual camp boundaries may not be circular.
Workflow 3: Fodder purchase and stock
There are two stock sources:
Stock source	Meaning
Store	Fodder purchased from registered sellers and stored at the camp
In Farm	Fodder produced or available from a farmer's own farm

Both contribute to stock, but the source/location must remain identifiable.

Purchase entry:
Field	Example
Seller	Farmer A
Date	22-Nov-2026
Fodder type	Green fodder
Quantity	500
Unit	Kg
Rate	₹5
Total	₹2,500

The purchase amount should be recorded, not an actual payment transaction.
Workflow 4: Feeding and stock adjustment
Feeding is recorded by animal type/group, not individually.

For example:
Animal type	Fodder type	Quantity issued
Cow	Green fodder	100 kg
Goat	Dry fodder	20 kg
Buffalo	Green fodder	80 kg

The stock decreases when feeding is recorded.

For stock adjustments, the operator can enter:
- Adjustment type: Increase / Decrease
- Quantity
- Unit
- Reason
Workflow 5: Operational expenses
Expense category
Labour charges
Water expenses
Electricity
Transportation
Other operational expenses

Each expense should capture date, category, amount and optional description.

Purchase expenses and operational expenses should be separately identifiable in reports.
3. Updated functional modules
Based on the confirmed scope, I would divide the system into these modules.
Module	Main functionality
Farmer Management	Farmer registration and profile
Animal Management	Individual animal registration
Veterinary Verification	Verification, rejection and resubmission
Chara Chhavani Management	Camp and owner registration, geofence
Animal Admission	Photo, GPS validation and admission
Animal Release/Transfer	Record animal exit and transfer
Seller Management	Seller registration and farmer-as-seller
Fodder Management	Purchase, source and stock
Feeding Management	Daily feeding by animal type
Stock Adjustment	Wastage, damage and corrections
Expense Management	Operational expenses
Admin Dashboard	Overall monitoring and reports

This is a sufficient functional scope. I would not add a separate accounting, payment, payroll, procurement approval or advanced inventory module.
4. Important business rules
I recommend confirming these rules before development.
No.	Business rule
1	Every animal must have a unique system-generated ID.
2	Only verified animals can be admitted.
3	An animal cannot be admitted to two camps simultaneously.
4	Admission requires successful geofence validation.
5	An animal's release must update the camp's active animal count.
6	Every fodder purchase increases the corresponding stock.
7	Every feeding entry decreases the corresponding stock.
8	Stock cannot become negative.
9	Stock adjustment requires a reason.
10	A farmer can also be a registered seller.

One additional point: once an animal is admitted, its current Chara Chhavani should be maintained as part of its record.