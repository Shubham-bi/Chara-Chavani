# All Applications Chrome Multi-View Portal - Understanding Document

## 1. Business Context & User Requirement
The user requested: **"run all app in chrome view"**.

In the **Chara Chhavani** ecosystem, there are 5 core applications serving distinct actors in Maharashtra's drought relief administration:
1. **🏛️ State Relief Administration Web Dashboard (`web-admin`)**: Executive monitoring, Google Maps GIS visualization, camp capacity utilization rankings, statutory audit reports (admissions, fodder balance, operational expenses, spot inspection logs), and RFC 4180 Excel CSV exports.
2. **🌾 Farmer Mobile Application (`mobile-farmer`)**: Self-service portal for drought-affected farmers to authenticate via mobile OTP, view registered livestock, check veterinary approval status, register new animals, and track relief admissions.
3. **🏕️ Chhavani Camp Operator Mobile Application (`mobile-chhavani`)**: On-ground camp gate operations, GPS geofence-validated cattle admissions, store and in-farm fodder inventory balance tracking, daily feeding issuance, and itemized operational expense logging.
4. **🩺 Veterinary Doctor Mobile Application (`mobile-vet`)**: Clinical health assessments, ear-tag confirmation, GPS location-stamped verification visits at farmer homesteads, and formal approval/rejection certification.
5. **👮 Government Inspection Officer Mobile Application (`mobile-officer`)**: Surprise spot audits by Tehsildars, BDOs, and Animal Husbandry Officers, conducting physical cattle headcounts against digital database counts, discrepancy detection, sanitation scores, and formal inspection reports.

### The Objective
Deliver a unified, high-fidelity **Chrome Multi-App Portal & Mobile Simulator** hosted at `http://localhost:3000` allowing users and QA teams to:
- Seamlessly run and inspect all 5 applications in Google Chrome.
- Switch between the State Admin Dashboard and any mobile app using a persistent top App Switcher bar.
- Run mobile apps in an authentic **Chrome Smartphone Viewport Frame** (simulating 375x667 / 390x844 with status bar, touch targets $\ge 48\text{dp}$, and bilingual Marathi/English UI).
- Provide a **"Quad Chrome Multi-View"** showing all 4 mobile actor applications side-by-side for live multi-actor lifecycle demonstrations.
- Connect every mobile app to live backend REST endpoints on `http://localhost:5000` (backed by the comprehensive seeded database).
- Use the **Browser Subagent** to navigate Chrome to `http://localhost:3000`, interact with each app, and visually verify rendering.

---

## 2. Functional Requirements & Technical Specifications

### 2.1 Top Persistent App Switcher Bar
Located at the very top of `http://localhost:3000`:
- **🏛️ State Admin Dashboard** (`#app-tab-admin`)
- **🌾 Farmer App** (`#app-tab-farmer`)
- **🏕️ Camp Operator App** (`#app-tab-chhavani`)
- **🩺 Vet Doctor App** (`#app-tab-vet`)
- **👮 Inspection Officer App** (`#app-tab-officer`)
- **📱 Quad-App Multi-View** (`#app-tab-quad`)
- Device frame toggle: `📱 Mobile Phone Frame` vs `💻 Full Width Screen`.
- Actor role selector dropdown: `#role-selector`.

### 2.2 Live App Implementations & Views

#### A. Farmer Mobile View
- **Farmer Profile Banner**: Kisan Tukaram Jadhav, Mobile `9890123456`, Pachod, Paithan.
- **Registered Livestock Cards** (`.action-card`): Displays cattle tags (`MH-20-4001`, `MH-20-4002`), breed (Gir, Khillari), verification status badge (`Approved`), and admission camp link.
- **Animal Registration Modal/Form**: Add new cattle with tag, breed selector, gender, and age.
- **Relief Subsidy & Fodder Allocation Tracker**: Active days in camp and statutory fodder quota.

#### B. Camp Operator Mobile View
- **Camp Banner**: Paithan Taluka Shasan-Manya Chara Chhavani (`CHV-MH-PAITHAN-001`).
- **Gate Admission Action Card** (`.action-card`):
  - Cattle tag lookup / scanner input.
  - Device GPS coordinate capture.
  - Interactive Geofence Validator button calling `GET /api/v1/camps/{id}/validate-point`.
- **Fodder Stock Dashboard**: Store Stock (15,000 kg) & In-Farm Stock (4,000 kg).
- **Daily Ration Issuance**: Log feeding entries for Cows, Bullocks, Buffaloes.
- **Operational Expense Logging**: Quick form for Labour, Water Tanker, Electricity, and Transport.

#### C. Veterinary Doctor Mobile View
- **Doctor Profile**: Dr. R. K. Shinde (`DOC-MH-AUR-01`), Taluka Veterinary Officer.
- **Verification Queue Card** (`.action-card`): Lists animals pending clinical inspection.
- **Clinical Examination Action**: Ear-tag check, health remarks, GPS stamping, and One-Click Approve / Reject.
- **Inspection History**: Log of verified animals.

#### D. Government Inspection Officer Mobile View
- **Officer Profile**: Dr. Anand Deshmukh, District Animal Husbandry Officer.
- **Surprise Spot Audit Action Card** (`.action-card`):
  - Camp selector dropdown (`Paithan`, `Ambad`, `Georai`, `Madha`).
  - Headcount Audit: Physical Animal Count input vs Live System Headcount.
  - Automatic Discrepancy Calculation (`Physical - System`).
  - Water Availability selector (`Adequate`, `Scarce`, `Critical`).
  - Fodder Condition selector (`Satisfactory`, `Deficient`, `Critical`).
  - Cleanliness score (1 to 5 rating).
  - Submit Inspection Report directly to `POST /api/v1/officer/inspections`.

#### E. Quad Chrome Multi-View
- Displays all 4 mobile applications simultaneously in a 4-column responsive grid.
- Allows demonstrating the complete lifecycle in real-time within a single Chrome window.

---

## 3. Data Flow & Cross-Actor Synergy
1. Farmer registers animal in **Farmer App**.
2. Vet Doctor inspects and approves animal in **Vet App**.
3. Camp Operator validates GPS geofence and admits animal in **Operator App**.
4. State Executive monitors updated headcount and capacity utilization in **Admin Dashboard**.
5. Officer performs spot headcount audit in **Officer App** and reports findings.

---

## 4. Verification Criteria
1. `npm run lint:all` passes with 0 errors.
2. `npm run typecheck` passes with 0 errors.
3. Playwright E2E suite passes 100% green.
4. Browser subagent opens Chrome at `http://localhost:3000`, navigates between all apps, exercises interactions, and verifies visual fidelity.
