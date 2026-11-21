# Fodder Inventory, Feeding, Adjustments & Expenses Understanding Document
**Module:** Fodder Stock, Feeding, Adjustments & Operational Expenses  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Workflows 3, 4, 5), [FSD.md](../../ReferanceData/FSD.md) (Sections 4.7–4.14), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
- **Target User:** Chara Chhavani Operators and Admin Auditors.
- **Workflow Context:** Cattle camps consume tons of green fodder, dry fodder, and concentrate feeds daily. The system must account for every kilogram purchased or brought from farms, track inventory per camp across dual sources (`Store` vs `In Farm`), log group feedings, record verified wastage/adjustments, and log day-to-day camp operational expenses (labour, water tankers, electricity).

---

## 2. Functional Requirements & Invariants

### 2.1 Dual Stock Tracking & Purchases
* **Dual Sources:**
  1. `Store`: Fodder purchased from registered commercial sellers or registered farmers.
  2. `InFarm`: Fodder harvested from farm sources.
* **Atomic Balance Update:** Every purchase entry atomically increments `AvailableQuantity` in `fodder_stocks` for that `(ChhavaniId, Source, FodderType)`.
* **Amount Calculation:** $\text{TotalAmount} = \text{Quantity} \times \text{RatePerUnit}$ computed and verified on the server.

### 2.2 Feeding Management
* Feeding is logged by **Animal Type / Group** (Cow, Buffalo, Bullock, Goat, Sheep) rather than per individual animal.
* Operator selects Camp, Stock Source, Animal Type, Fodder Type, and Quantity.
* **Strict Non-Negative Invariant:**
  $$\text{AvailableStock} - \text{QuantityIssued} \ge 0$$
  If available stock is insufficient, the transaction must fail with an explicit business error (`"INSUFFICIENT_FODDER_STOCK"`).

### 2.3 Stock Adjustments
* Used for wastage, spoilage, shrinkage, or audit calibration.
* `AdjustmentType`: `Increase` or `Decrease`.
* Decrement cannot exceed available stock.
* **Mandatory Reason:** A non-empty text justification is strictly required.

### 2.4 Operational Expense Management
* Captures Date, Category (`Labour`, `Water`, `Electricity`, `Transportation`, `Other`), Amount ($> 0$), and optional Description.
* Clearly separated from fodder procurement costs in reports.

---

## 3. Data Flow & API Contracts

### Endpoints
* `POST /api/v1/fodder/purchases`: Record purchase (increments `Store` stock atomically).
* `POST /api/v1/fodder/in-farm`: Record in-farm stock entry (increments `InFarm` stock atomically).
* `GET /api/v1/fodder/stock/{campId}`: Overview of current stock by source and fodder type.
* `POST /api/v1/fodder/feeding`: Record daily feeding entry (decrements stock atomically with non-negative guard).
* `POST /api/v1/fodder/adjustments`: Record stock adjustment with mandatory reason.
* `POST /api/v1/expenses`: Record operational expense.
* `GET /api/v1/expenses/camp/{campId}`: List camp expenses with category totals.
