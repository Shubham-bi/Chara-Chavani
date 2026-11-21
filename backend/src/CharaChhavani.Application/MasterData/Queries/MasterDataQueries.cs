using MediatR;
using CharaChhavani.Application.MasterData.DTOs;
using CharaChhavani.Application.MasterData.Services;

namespace CharaChhavani.Application.MasterData.Queries;

// 1. Get Districts
public record GetDistrictsQuery : IRequest<List<DistrictDto>>;

public class GetDistrictsQueryHandler : IRequestHandler<GetDistrictsQuery, List<DistrictDto>>
{
    public Task<List<DistrictDto>> Handle(GetDistrictsQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(MasterDataProvider.GetDistricts());
    }
}

// 2. Get Talukas for District
public record GetTalukasQuery(string District) : IRequest<List<string>>;

public class GetTalukasQueryHandler : IRequestHandler<GetTalukasQuery, List<string>>
{
    public Task<List<string>> Handle(GetTalukasQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(MasterDataProvider.GetTalukas(request.District));
    }
}

// 3. Get Breeds
public record GetBreedsQuery(string? AnimalType = null) : IRequest<List<BreedDto>>;

public class GetBreedsQueryHandler : IRequestHandler<GetBreedsQuery, List<BreedDto>>
{
    public Task<List<BreedDto>> Handle(GetBreedsQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(MasterDataProvider.GetBreeds(request.AnimalType));
    }
}

// 4. Get Fodder Types
public record GetFodderTypesQuery : IRequest<List<FodderTypeDto>>;

public class GetFodderTypesQueryHandler : IRequestHandler<GetFodderTypesQuery, List<FodderTypeDto>>
{
    public Task<List<FodderTypeDto>> Handle(GetFodderTypesQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(MasterDataProvider.GetFodderTypes());
    }
}

// 5. Get Expense Categories
public record GetExpenseCategoriesQuery : IRequest<List<ExpenseCategoryDto>>;

public class GetExpenseCategoriesQueryHandler : IRequestHandler<GetExpenseCategoriesQuery, List<ExpenseCategoryDto>>
{
    public Task<List<ExpenseCategoryDto>> Handle(GetExpenseCategoriesQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(MasterDataProvider.GetExpenseCategories());
    }
}
