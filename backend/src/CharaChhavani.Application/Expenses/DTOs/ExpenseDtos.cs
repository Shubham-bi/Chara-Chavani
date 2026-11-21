namespace CharaChhavani.Application.Expenses.DTOs;

public class ExpenseDto
{
    public long Id { get; set; }
    public long ChhavaniId { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime ExpenseDate { get; set; }
}

public class CampExpenseSummaryDto
{
    public long ChhavaniId { get; set; }
    public decimal TotalOperationalExpenses { get; set; }
    public Dictionary<string, decimal> ExpensesByCategory { get; set; } = new();
    public List<ExpenseDto> RecentExpenses { get; set; } = new();
}
