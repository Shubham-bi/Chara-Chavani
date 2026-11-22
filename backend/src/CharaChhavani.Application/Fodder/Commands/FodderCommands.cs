using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Fodder.DTOs;
using CharaChhavani.Domain.Entities;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Fodder.Commands;

// 1. Record Fodder Purchase Command
public record RecordFodderPurchaseCommand : IRequest<ApiResponse<PurchaseRecordResultDto>>
{
    public long ChhavaniId { get; init; }
    public string SellerName { get; init; } = string.Empty;
    public string? SellerMobile { get; init; }
    public long? SellerFarmerId { get; init; }
    public FodderType FodderType { get; init; }
    public decimal Quantity { get; init; }
    public string Unit { get; init; } = "kg";
    public decimal RatePerUnit { get; init; }
    public DateTime? PurchaseDate { get; init; }
}

public class RecordFodderPurchaseValidator : AbstractValidator<RecordFodderPurchaseCommand>
{
    public RecordFodderPurchaseValidator()
    {
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.SellerName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
        RuleFor(x => x.RatePerUnit).GreaterThan(0).WithMessage("Rate per unit must be greater than zero.");
    }
}

public class RecordFodderPurchaseCommandHandler : IRequestHandler<RecordFodderPurchaseCommand, ApiResponse<PurchaseRecordResultDto>>
{
    private readonly IApplicationDbContext _context;

    public RecordFodderPurchaseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PurchaseRecordResultDto>> Handle(RecordFodderPurchaseCommand request, CancellationToken cancellationToken)
    {
        var chhavani = await _context.Chhavanis.FirstOrDefaultAsync(c => c.Id == request.ChhavaniId, cancellationToken);
        if (chhavani == null) throw new NotFoundException(nameof(Chhavani), request.ChhavaniId);

        // Server-side calculation of total amount: Quantity * Rate
        var totalAmount = request.Quantity * request.RatePerUnit;
        var purchaseCode = $"PUR-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

        var purchase = new FodderPurchase
        {
            PurchaseCode = purchaseCode,
            ChhavaniId = chhavani.Id,
            SellerName = request.SellerName,
            SellerMobile = request.SellerMobile,
            SellerFarmerId = request.SellerFarmerId,
            FodderType = request.FodderType,
            Quantity = request.Quantity,
            Unit = request.Unit,
            RatePerUnit = request.RatePerUnit,
            TotalAmount = totalAmount,
            PurchaseDate = request.PurchaseDate ?? DateTime.UtcNow
        };

        // Atomically increment Store Stock
        var stock = await _context.FodderStocks
            .FirstOrDefaultAsync(s => s.ChhavaniId == chhavani.Id &&
                                      s.Source == StockSource.Store &&
                                      s.FodderType == request.FodderType, cancellationToken);

        if (stock == null)
        {
            stock = new FodderStock
            {
                ChhavaniId = chhavani.Id,
                Source = StockSource.Store,
                FodderType = request.FodderType,
                AvailableQuantity = request.Quantity,
                Unit = request.Unit
            };
            _context.FodderStocks.Add(stock);
        }
        else
        {
            stock.AvailableQuantity += request.Quantity;
            stock.UpdatedAtUtc = DateTime.UtcNow;
        }

        _context.FodderPurchases.Add(purchase);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new PurchaseRecordResultDto
        {
            PurchaseId = purchase.Id,
            PurchaseCode = purchase.PurchaseCode,
            ChhavaniId = chhavani.Id,
            SellerName = purchase.SellerName,
            FodderType = purchase.FodderType.ToString(),
            Quantity = purchase.Quantity,
            RatePerUnit = purchase.RatePerUnit,
            TotalAmount = purchase.TotalAmount,
            UpdatedStoreStock = stock.AvailableQuantity
        };

        return ApiResponse<PurchaseRecordResultDto>.Ok(resultDto, "Fodder purchase recorded and stock updated.");
    }
}

// 2. Record Feeding Command
public record RecordFeedingCommand : IRequest<ApiResponse<FeedingRecordResultDto>>
{
    public long ChhavaniId { get; init; }
    public StockSource Source { get; init; }
    public AnimalType AnimalType { get; init; }
    public FodderType FodderType { get; init; }
    public decimal QuantityIssued { get; init; }
    public string Unit { get; init; } = "kg";
}

public class RecordFeedingValidator : AbstractValidator<RecordFeedingCommand>
{
    public RecordFeedingValidator()
    {
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.QuantityIssued).GreaterThan(0).WithMessage("Quantity issued must be greater than zero.");
    }
}

public class RecordFeedingCommandHandler : IRequestHandler<RecordFeedingCommand, ApiResponse<FeedingRecordResultDto>>
{
    private readonly IApplicationDbContext _context;

    public RecordFeedingCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<FeedingRecordResultDto>> Handle(RecordFeedingCommand request, CancellationToken cancellationToken)
    {
        var stock = await _context.FodderStocks
            .FirstOrDefaultAsync(s => s.ChhavaniId == request.ChhavaniId &&
                                      s.Source == request.Source &&
                                      s.FodderType == request.FodderType, cancellationToken);

        // Strict Non-Negative Stock Invariant
        if (stock == null || stock.AvailableQuantity < request.QuantityIssued)
        {
            var available = stock?.AvailableQuantity ?? 0;
            return ApiResponse<FeedingRecordResultDto>.Failure(
                $"Insufficient fodder stock in {request.Source}. Available: {available} {request.Unit}, Requested: {request.QuantityIssued} {request.Unit}. Stock cannot become negative.");
        }

        // Deduct Stock
        stock.AvailableQuantity -= request.QuantityIssued;
        stock.UpdatedAtUtc = DateTime.UtcNow;

        var feeding = new FeedingEntry
        {
            ChhavaniId = request.ChhavaniId,
            Source = request.Source,
            AnimalType = request.AnimalType,
            FodderType = request.FodderType,
            QuantityIssued = request.QuantityIssued,
            Unit = request.Unit,
            FeedingDateTime = DateTime.UtcNow
        };

        _context.FeedingEntries.Add(feeding);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new FeedingRecordResultDto
        {
            FeedingId = feeding.Id,
            ChhavaniId = feeding.ChhavaniId,
            AnimalType = feeding.AnimalType.ToString(),
            FodderType = feeding.FodderType.ToString(),
            QuantityIssued = feeding.QuantityIssued,
            RemainingStock = stock.AvailableQuantity
        };

        return ApiResponse<FeedingRecordResultDto>.Ok(resultDto, "Feeding entry recorded and stock deducted successfully.");
    }
}

// 3. Record Stock Adjustment Command
public record RecordStockAdjustmentCommand : IRequest<ApiResponse<StockAdjustmentResultDto>>
{
    public long ChhavaniId { get; init; }
    public StockSource Source { get; init; }
    public FodderType FodderType { get; init; }
    public AdjustmentType AdjustmentType { get; init; }
    public decimal Quantity { get; init; }
    public string Unit { get; init; } = "kg";
    public string Reason { get; init; } = string.Empty;
}

public class RecordStockAdjustmentValidator : AbstractValidator<RecordStockAdjustmentCommand>
{
    public RecordStockAdjustmentValidator()
    {
        RuleFor(x => x.ChhavaniId).GreaterThan(0);
        RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("A mandatory reason is required for any stock adjustment.");
    }
}

public class RecordStockAdjustmentCommandHandler : IRequestHandler<RecordStockAdjustmentCommand, ApiResponse<StockAdjustmentResultDto>>
{
    private readonly IApplicationDbContext _context;

    public RecordStockAdjustmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<StockAdjustmentResultDto>> Handle(RecordStockAdjustmentCommand request, CancellationToken cancellationToken)
    {
        var stock = await _context.FodderStocks
            .FirstOrDefaultAsync(s => s.ChhavaniId == request.ChhavaniId &&
                                      s.Source == request.Source &&
                                      s.FodderType == request.FodderType, cancellationToken);

        if (stock == null)
        {
            stock = new FodderStock
            {
                ChhavaniId = request.ChhavaniId,
                Source = request.Source,
                FodderType = request.FodderType,
                AvailableQuantity = 0,
                Unit = request.Unit
            };
            _context.FodderStocks.Add(stock);
        }

        if (request.AdjustmentType == AdjustmentType.Decrease)
        {
            if (stock.AvailableQuantity < request.Quantity)
            {
                return ApiResponse<StockAdjustmentResultDto>.Failure(
                    $"Decrease adjustment exceeds available stock ({stock.AvailableQuantity} {stock.Unit}).");
            }
            stock.AvailableQuantity -= request.Quantity;
        }
        else
        {
            stock.AvailableQuantity += request.Quantity;
        }

        stock.UpdatedAtUtc = DateTime.UtcNow;

        var adjustment = new StockAdjustment
        {
            ChhavaniId = request.ChhavaniId,
            Source = request.Source,
            FodderType = request.FodderType,
            AdjustmentType = request.AdjustmentType,
            Quantity = request.Quantity,
            Unit = request.Unit,
            Reason = request.Reason,
            AdjustmentDate = DateTime.UtcNow
        };

        _context.StockAdjustments.Add(adjustment);
        await _context.SaveChangesAsync(cancellationToken);

        var resultDto = new StockAdjustmentResultDto
        {
            AdjustmentId = adjustment.Id,
            ChhavaniId = adjustment.ChhavaniId,
            Source = adjustment.Source.ToString(),
            FodderType = adjustment.FodderType.ToString(),
            AdjustmentType = adjustment.AdjustmentType.ToString(),
            Quantity = adjustment.Quantity,
            UpdatedAvailableStock = stock.AvailableQuantity,
            Reason = adjustment.Reason
        };

        return ApiResponse<StockAdjustmentResultDto>.Ok(resultDto, "Stock adjustment applied successfully.");
    }
}
