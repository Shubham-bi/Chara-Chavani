using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.Application.Admin.Queries.Reports;

public class GetExpenseAuditReportQuery : IRequest<ApiResponse<List<ExpenseAuditReportItemDto>>>
{
    public long? ChhavaniId { get; set; }
    public string? District { get; set; }
    public string? Taluka { get; set; }
    public string? Category { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class GetExpenseAuditReportQueryHandler : IRequestHandler<GetExpenseAuditReportQuery, ApiResponse<List<ExpenseAuditReportItemDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetExpenseAuditReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<ExpenseAuditReportItemDto>>> Handle(
        GetExpenseAuditReportQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Expenses
            .Include(e => e.Chhavani)
            .Where(e => !e.IsDeleted)
            .AsNoTracking();

        if (request.ChhavaniId.HasValue)
        {
            query = query.Where(e => e.ChhavaniId == request.ChhavaniId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.District))
        {
            query = query.Where(e => e.Chhavani != null && e.Chhavani.District.ToLower() == request.District.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Taluka))
        {
            query = query.Where(e => e.Chhavani != null && e.Chhavani.Taluka.ToLower() == request.Taluka.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(e => e.Category.ToLower() == request.Category.ToLower());
        }

        if (request.StartDate.HasValue)
        {
            query = query.Where(e => e.ExpenseDate >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(e => e.ExpenseDate <= request.EndDate.Value);
        }

        var expenses = await query
            .OrderByDescending(e => e.ExpenseDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var reportItems = expenses.Select(e => new ExpenseAuditReportItemDto
        {
            ExpenseId = e.Id,
            ChhavaniId = e.ChhavaniId,
            CampName = e.Chhavani?.Name ?? string.Empty,
            CampCode = e.Chhavani?.CampCode ?? string.Empty,
            District = e.Chhavani?.District ?? string.Empty,
            Taluka = e.Chhavani?.Taluka ?? string.Empty,
            Category = e.Category,
            Amount = e.Amount,
            VoucherNumber = $"VCH-{e.ExpenseDate:yyyyMM}-{e.Id:D4}",
            ExpenseDate = e.ExpenseDate,
            PaidTo = e.CreatedBy ?? (e.Chhavani?.Name ?? "Camp Administration"),
            Description = e.Description,
            OperatorId = e.CreatedBy ?? "SYSTEM"
        }).ToList();

        return ApiResponse<List<ExpenseAuditReportItemDto>>.Ok(reportItems, "Expense audit report generated successfully.");
    }
}
