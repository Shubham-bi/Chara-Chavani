using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Farmers.DTOs;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.Application.Farmers.Queries;

public record GetFarmerDashboardQuery(long FarmerId) : IRequest<ApiResponse<FarmerDashboardDto>>;

public class GetFarmerDashboardQueryHandler : IRequestHandler<GetFarmerDashboardQuery, ApiResponse<FarmerDashboardDto>>
{
    private readonly IApplicationDbContext _context;

    public GetFarmerDashboardQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<FarmerDashboardDto>> Handle(GetFarmerDashboardQuery request, CancellationToken cancellationToken)
    {
        var farmer = await _context.Farmers
            .Include(f => f.Animals)
            .FirstOrDefaultAsync(f => f.Id == request.FarmerId, cancellationToken);

        if (farmer == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Farmer), request.FarmerId);
        }

        var animals = farmer.Animals.Where(a => !a.IsDeleted).ToList();

        var dashboard = new FarmerDashboardDto
        {
            Farmer = new FarmerDto
            {
                Id = farmer.Id,
                Name = farmer.Name,
                MobileNumber = farmer.MobileNumber,
                Address = farmer.Address,
                Village = farmer.Village,
                Taluka = farmer.Taluka,
                District = farmer.District,
                State = farmer.State,
                IsRegisteredSeller = farmer.IsRegisteredSeller
            },
            TotalRegisteredAnimals = animals.Count,
            PendingVerificationCount = animals.Count(a => a.VerificationStatus == VerificationStatus.Pending),
            VerifiedCount = animals.Count(a => a.VerificationStatus == VerificationStatus.Approved),
            RejectedCount = animals.Count(a => a.VerificationStatus == VerificationStatus.Rejected),
            AdmittedCount = animals.Count(a => a.CurrentStatus == AnimalStatus.Admitted)
        };

        return ApiResponse<FarmerDashboardDto>.Ok(dashboard);
    }
}
