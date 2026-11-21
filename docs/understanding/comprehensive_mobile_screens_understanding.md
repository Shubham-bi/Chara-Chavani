# Stage 2: Understanding Document - Comprehensive Mobile Screens & Workflow Suite

## 1. Business Context & Target Users
The **Chara Chhavani Management System (चारा छावणी व्यवस्थापन प्रणाली)** serves four primary operational user roles in drought-affected rural Maharashtra:
1. **Drought-Affected Farmers (शेतकरी)**: Need to manage their profile (Aadhaar, landholding 7/12 & 8A) and view the status of their registered animals (Pending, Verified, Admitted, Released, Rejected).
2. **Government Veterinary Doctors (पशुधन विकास अधिकारी / डॉक्टर)**: Need a dashboard to see incoming verification queues and an immutable history of conducted inspections.
3. **Cattle Camp Operators (छावणी चालक / व्यवस्थापक)**: In addition to admissions and inventory, they must execute safe animal releases back to farmers, log new fodder procurement receipts, and account for daily operational expenditures (water tankers, electricity, security labor, sanitation).
4. **Taluka & District Monitoring Officers (महसूल व कृषी अधिकारी)**: Need an interactive mobile field inspection checklist to verify physical animal headcount against system numbers, audit water/fodder availability, and immediately flag discrepancies.

---

## 2. Functional Requirements & Business Rules

### Module A: Farmer App Suite (FSD 1.2, 1.5)
- **FarmerProfileScreen**: Form with Aadhaar number format (`\d{12}`), Village, Taluka, District, Land Holding (Hectares), and 7/12 extract upload flag.
- **MyAnimalsScreen**: Tabbed filter displaying registered cattle cards with verification badges, RFID/tag numbers, breed names, and admission status.

### Module B: Veterinary Doctor App Suite (FSD 2.2, 2.5)
- **VetDashboardScreen**: Metric cards for Pending Verifications, Approved This Month, Rejected, and active inspection taluka.
- **VetHistoryScreen**: Historical verification audit trail with animal tags, owner names, health certificates, and GPS coordinates.

### Module C: Chhavani Operator App Suite (FSD 4.6, 4.8, 4.13)
- **AnimalReleaseScreen**: Search admitted cattle, record release reason (Farmer Request, Drought Ended, Medical Referral), operator confirmation, and receipt generation.
- **FodderPurchaseScreen**: Record incoming truckloads with supplier name, fodder type (Green, Dry, Silage, Feed), gross weight, tare weight, net quintals, and rate per quintal.
- **DailyExpenseScreen**: Record daily expenses categorized under WaterTanker, Labor, Electricity, ShedMaintenance, Medicines, Disinfection, or Miscellaneous.

### Module D: Government Officer App Suite (FSD 3.4, Field Inspection Form)
- **CampInspectionFormScreen**: GPS-tagged inspection capturing physical cattle headcount, system headcount, water availability score, fodder condition score, cleanliness rating (1-5), and automated discrepancy alerts.

---

## 3. UI/UX Guardrails & Non-Functional Requirements
- **Responsive Layout**: Zero horizontal scroll or cut-offs on 320dp budget devices, standard 375dp–414dp phones, and 600dp+ tablets.
- **Devanagari Metrics**: Marathi text must maintain $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ to prevent diacritic clipping.
- **Touch Targets**: All interactive buttons, tabs, and inputs must maintain a minimum touch target of $48 \times 48\text{ dp}$.
- **Rule 9.6 Compliance**: Admissions and releases must never be submitted offline; non-critical drafts may queue offline.

---

## 4. Architectural Contracts
- **Controller Layer**: Encapsulates `@chara-chhavani/api-client` service calls, validates parameters, and returns typed DTOs.
- **View Layer**: Generates layout trees using `@chara-chhavani/ui-core` style resolvers (`ResponsiveTextStyleResolver`, `ResponsiveCardStyleResolver`, `ResponsiveButtonStyleResolver`, `ResponsiveGridResolver`).
- **Orchestrator Layer**: Manages active screen state, session hydration, and action callbacks.
