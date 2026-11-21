using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Expenses.DTOs;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Expenses.Commands;

public record RecordExpenseCommand : IRequest<ApiResponse<ExpenseDto>>
{
    public long ChhavaniId { get; init; }
    public string Category { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public string? Description { get; init; }
    public DateTime? ExpenseDate { get; init; }
}

public class RecordExpenseValidator : AbstractValidator<RecordExpenseCommand>
{
    public RecordExpenseValidator()
    {
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Expense amount must be greater than zero.");
    }
}

public class RecordExpenseCommandHandler : IRequestHandler<RecordExpenseCommand, ApiResponse<ExpenseDto>>
{
    private readonly IApplicationDbContext _context;

    public RecordExpenseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ExpenseDto>> Handle(RecordExpenseCommand request, CancellationToken cancellationToken)
    {
        var chhavani = await _context.Chhavanis.FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);
        if (chhavani == null) throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);

        var expense = new Expense
        {
            ChhavaniId = chhavani.Id,
            Category = request.Category,
            Amount = request.Amount,
            Description = request.Description,
            ExpenseDate = request.ExpenseDate ?? DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync(cancellationToken);

        var dto = new ExpenseDto
        {
            Id = expense.Id,
            ChhavaniId = expense.ChhavaniId,
            Category = expense.Category,
            Amount = expense.Amount,
            Description = expense.Description,
            ExpenseDate = expense.ExpenseDate
        };

        return ApiResponse<ExpenseDto>.Ok(dto, "Operational expense recorded successfully.");
    }
}
