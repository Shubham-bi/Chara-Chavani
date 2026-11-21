# Fodder Inventory, Feeding, Adjustments & Expenses Plan & Task List

**Module:** Fodder Stock, Feeding, Adjustments & Operational Expenses  
**Reference Understanding Doc:** [fodder_feeding_expense_understanding.md](../understanding/fodder_feeding_expense_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Application Layer (CQRS Commands & Queries)**:
   * `RecordFodderPurchaseCommand`: Validates seller, quantity, rate; server-computes total; upserts `FodderStock` (`Store`); creates purchase record.
   * `RecordFeedingCommand`: Validates stock availability; decrements stock atomically; enforces non-negative invariant; records feeding entry.
   * `RecordStockAdjustmentCommand`: Validates reason; applies adjustment; prevents negative balance.
   * `GetCampStockOverviewQuery`: Returns balances for all fodder types broken down by `Store` and `InFarm`.
   * `RecordExpenseCommand`: Validates amount and category; creates operational expense record.
   * `GetCampExpensesQuery`: Returns expenses with summary breakdown by category.
2. **WebApi Layer**:
   * `FodderController` (`/api/v1/fodder`) for stock, purchases, feeding, and adjustments.
   * `ExpensesController` (`/api/v1/expenses`) for camp operational expenses.
3. **Verification & Testing**:
   * Unit tests covering:
     * Non-negative stock guard during feeding.
     * Insufficient stock rejection.
     * Dual-source isolation (`Store` stock vs `InFarm` stock).
     * Mandatory adjustment reason constraint.
     * Purchase total calculation on server.

---

## Granular Atomic Task List

- [x] **Task 1: Implement Fodder & Expense DTOs**
  - Scope: `FodderStockItemDto`, `CampStockOverviewDto`, `PurchaseRecordResultDto`, `FeedingRecordResultDto`, `StockAdjustmentResultDto`, `ExpenseDto`, `CampExpenseSummaryDto`.
  - Target: `CharaChhavani.Application/Fodder/DTOs/` & `CharaChhavani.Application/Expenses/DTOs/`
- [x] **Task 2: Implement Fodder CQRS Commands, Queries & Validators**
  - Scope: `RecordFodderPurchaseCommand`, `RecordFeedingCommand`, `RecordStockAdjustmentCommand`, `GetCampStockOverviewQuery`.
  - Target: `CharaChhavani.Application/Fodder/`
- [x] **Task 3: Implement Expense CQRS Commands, Queries & Validators**
  - Scope: `RecordExpenseCommand`, `GetCampExpensesQuery`.
  - Target: `CharaChhavani.Application/Expenses/`
- [x] **Task 4: Implement FodderController & ExpensesController in WebApi**
  - Scope: REST API endpoints conforming to standard `ApiResponse<T>`.
  - Target: `CharaChhavani.WebApi/Controllers/`
- [x] **Task 5: Write Unit & Domain Tests**
  - Scope: Tested stock calculations, non-negative guards, dual-source isolation, mandatory reason validation.
  - Target: `CharaChhavani.UnitTests/FodderAndExpenseTests.cs`
- [x] **Task 6: Build & Test Verification**
  - Scope: Executed `dotnet test backend/CharaChhavani.sln` to achieve 100% test pass rate (31/31 passed).
  - Target: Solution-wide
