using Microsoft.EntityFrameworkCore;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Chhavani> Chhavanis { get; }
    DbSet<ChhavaniOperator> ChhavaniOperators { get; }
    DbSet<Farmer> Farmers { get; }
    DbSet<Animal> Animals { get; }
    DbSet<VetVerification> VetVerifications { get; }
    DbSet<AnimalAdmission> AnimalAdmissions { get; }
    DbSet<FodderStock> FodderStocks { get; }
    DbSet<FodderPurchase> FodderPurchases { get; }
    DbSet<FeedingEntry> FeedingEntries { get; }
    DbSet<StockAdjustment> StockAdjustments { get; }
    DbSet<Expense> Expenses { get; }
    DbSet<CampInspection> CampInspections { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
