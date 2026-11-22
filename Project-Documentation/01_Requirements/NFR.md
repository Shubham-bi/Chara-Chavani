# Non-Functional Requirements (NFR)
## Chara Chhavani Management System

---

## 1. Performance & Latency Requirements (NFR-PERF)
- **NFR-PERF-01 (API Response Latency)**: 95% of standard CRUD API requests must complete within $\le 200\text{ ms}$ under nominal loads.
- **NFR-PERF-02 (Geofence Calculation Speed)**: NetTopologySuite spatial ray-casting (`Polygon.Contains(Point)`) must execute in $\le 50\text{ ms}$.
- **NFR-PERF-03 (High Volume Export Streaming)**: Generating CSV reports for up to 10,000 admission records must complete in $\le 3\text{ seconds}$ without buffering entire datasets into memory.
- **NFR-PERF-04 (Database Query Optimization)**: All spatial queries on camp boundaries and animal GPS points must utilize MySQL `SPATIAL INDEX`.

---

## 2. Security & Compliance Requirements (NFR-SEC)
- **NFR-SEC-01 (Role-Based Access Control - RBAC)**: Strict separation of permissions between `Farmer`, `VetDoctor`, `CampOperator`, `Officer`, and `Admin`.
- **NFR-SEC-02 (Credential Separation)**: Mobile users must never use passwords; authentication is strictly governed by verified mobile OTP. Dashboard administrators authenticate using salted/hashed passwords.
- **NFR-SEC-03 (PII Protection)**: Farmer Aadhaar numbers must be masked (`XXXXXXXX1234`) on public dashboards and exports.
- **NFR-SEC-04 (Anti-Tampering / Audit Logging)**: Inspection logs and animal admission records are immutable once committed; soft-deletions and updates preserve audit timestamps.

---

## 3. Reliability & Availability Requirements (NFR-REL)
- **NFR-REL-01 (Uptime SLA)**: Core WebAPI and database must maintain 99.9% uptime during active drought disaster declarations.
- **NFR-REL-02 (Database Transaction Safety)**: All stock adjustments, feeding deductions, and admissions must run inside atomic database transactions (`Serializable` / `Read Committed`) to prevent race conditions during concurrent entries.
- **NFR-REL-03 (Anti-Fraud Offline Policy - Rule 9.6)**: Offline caching of draft registrations is permitted, but live animal admission and release actions must fail immediately if internet/geofencing connectivity is absent.

---

## 4. Usability & Accessibility Requirements (NFR-UX)
- **NFR-UX-01 (Bilingual Support)**: Complete user interface localization in Marathi (मराठी) and English.
- **NFR-UX-02 (Devanagari Font Metrics)**: Explicit line-height ratio $\text{lineHeight} \ge 1.35 \times \text{fontSize}$ across all mobile views to eliminate diacritic clipping.
- **NFR-UX-03 (Touch Target Sizing)**: Minimum interactive touch target of $48 \times 48\text{ dp}$ for all buttons, inputs, and tabs on touchscreens.
- **NFR-UX-04 (WCAG 2.1 AA Compliance)**: All text and interactive components must satisfy the 4.5:1 minimum contrast ratio against background surfaces.

---

## 5. Compatibility & Portability (NFR-COMP)
- **NFR-COMP-01 (Mobile Operating Systems)**: Compatible with Android 8.0 (API 26) through Android 14+, and iOS 14.0+.
- **NFR-COMP-02 (Responsive Form Factors)**: Zero horizontal overflow or content cutoff across $320\text{ dp}$ budget phones, standard $375\text{ dp}$–$414\text{ dp}$ devices, and $600\text{ dp}+$ tablets.
- **NFR-COMP-03 (Containerized Deployment)**: Full system deployable via Docker Compose on Linux and Windows Server environments.
