using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Expenses.DTOs;

namespace CharaChhavani.Application.Expenses.Queries;

public record GetCampExpensesQuery(long ChhavaniId) : IRequest<ApiResponse<CampExpenseSummaryDto>>;

public class GetCampExpensesQueryHandler : IRequestHandler<GetCampExpensesQuery, ApiResponse<CampExpenseSummaryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCampExpensesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CampExpenseSummaryDto>> Handle(GetCampExpensesQuery request, CancellationToken cancellationToken)
    {
        var expenses = await _context.Expenses
            .Where(e => e.ChhavaniId == request.ChhavaniId && !e.IsDeleted)
            .OrderByDescending(e => e.ExpenseDate)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var categoryTotals = expenses
            .GroupBy(e => e.Category)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

        var summary = new CampExpenseSummaryDto
        {
            ChhavaniId = request.ChhavaniId,
            TotalOperationalExpenses = expenses.Sum(e => e.Amount),
            ExpensesByCategory = categoryTotals,
            RecentExpenses = expenses.Take(50).Select(e => new ExpenseDto
            {
                Id = e.Id,
                ChhavaniId = e.ChhavaniId,
                Category = e.Category,
                Amount = e.Amount,
                Description = e.Description,
                ExpenseDate = e.ExpenseDate
            }).ToList()
        };

        return ApiResponse<CampExpenseSummaryDto>.Ok(summary);
    }
}
