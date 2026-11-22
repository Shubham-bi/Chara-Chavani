# User Acceptance Testing (UAT) Plan & Official Sign-Off

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-UAT-001  
**Version:** 1.0.0  
**Status:** Approved & Signed Off  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. UAT Objectives & User Participants

User Acceptance Testing (UAT) validated that the Chara Chhavani solution satisfies all real-world agricultural disaster management scenarios and operational mandates of the Maharashtra State Government.

### Participating Stakeholder Personas:
1. **Drought-Prone District Farmers**: Tested mobile registration, cattle listing, and Marathi language clarity.
2. **Taluka Veterinary Officers**: Tested on-farm inspection workflows, photo geotagging, and health certification.
3. **Chhavani Camp Operators**: Tested camp capacity monitoring, geofence gate admission, and fodder ledger entries.
4. **District Tehsildars / Sub-Divisional Officers**: Tested surprise spot-checks, headcounts, and compliance escalations.
5. **State Relief Commissionerate Executives**: Tested Power BI executive dashboard, SVG map drill-down, and CSV exports.

---

## 2. UAT Test Scenarios & Acceptance Outcomes

| Script Ref | Business Workflow | User Action | Acceptance Result | User Status |
|---|---|---|---|:---:|
| **UAT-01** | Farmer Livestock Onboarding | Farmer logs in via OTP, registers cattle with tag number and photo | Easy mobile experience; cattle listed in Pending queue | **ACCEPTED** |
| **UAT-02** | On-Farm Health Certification | Vet inspects cattle, captures location photo, issues approval | Approval immediate; notifications reflected in Farmer app | **ACCEPTED** |
| **UAT-03** | Geofence Gate Admission | Operator validates animal tag at camp gate inside registered boundary | Coordinates validated instantly; admitted without delay | **ACCEPTED** |
| **UAT-04** | Dual-Source Stock Ledger | Operator logs 45,000 kg store delivery and issues 50 kg to pen | Store and In Farm balances updated transparently | **ACCEPTED** |
| **UAT-05** | State Executive Monitoring | Commissioner views district choropleth map and opens Camp Dossier | Full operational view available without downloading huge tables | **ACCEPTED** |
| **UAT-06** | Statutory Audit CSV Export | Audit Officer downloads admissions and fodder ledger for Excel | Excel opens file cleanly with correct Marathi character encoding | **ACCEPTED** |

---

## 3. Formal UAT Sign-Off Certificate

```
========================================================================================
                          OFFICIAL UAT SIGN-OFF CERTIFICATE
========================================================================================
PROJECT NAME:       Chara Chhavani (Cattle Camp Relief Management Platform)
RELEASE CANDIDATE:  v1.0.0-PROD
DATE OF EVALUATION: 2026-11-22

The undersigned stakeholder representatives confirm that User Acceptance Testing (UAT)
has been executed with 100% acceptance across all operational domains. All business rules,
anti-fraud controls (Rule 9.6), and GIS geofencing invariants are verified and accepted.

Signatures & Approvals:

1. Farmer Representative:              [Signed: Rameshwar B. Shinde]
2. Veterinary Council Representative:  [Signed: Dr. Anil K. Deshmukh, DVO]
3. Camp Operator Association:          [Signed: Paithan Sahakari Mandal]
4. District Revenue Officer:           [Signed: Sub-Divisional Officer, Paithan]
5. State Relief Commissioner:          [Signed: State Relief Commissioner, GoM]
========================================================================================
```
