using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.MasterData.Commands;
using CharaChhavani.Application.MasterData.DTOs;
using CharaChhavani.Application.MasterData.Queries;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MasterDataController : BaseApiController
{
    private readonly IMediator _mediator;

    public MasterDataController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieve Maharashtra drought-affected districts and their talukas.
    /// </summary>
    [HttpGet("districts")]
    public async Task<ActionResult<ApiResponse<List<DistrictDto>>>> GetDistricts()
    {
        var result = await _mediator.Send(new GetDistrictsQuery());
        return Ok(result);
    }

    /// <summary>
    /// Retrieve list of talukas for a specific district.
    /// </summary>
    [HttpGet("districts/{district}/talukas")]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetTalukas([FromRoute] string district)
    {
        var result = await _mediator.Send(new GetTalukasQuery(district));
        return Ok(result);
    }

    /// <summary>
    /// Retrieve standardized animal breeds recognized in Maharashtra, optionally filtered by animal type.
    /// </summary>
    [HttpGet("breeds")]
    public async Task<ActionResult<ApiResponse<List<BreedDto>>>> GetBreeds([FromQuery] string? animalType = null)
    {
        var result = await _mediator.Send(new GetBreedsQuery(animalType));
        return Ok(result);
    }

    /// <summary>
    /// Retrieve standardized fodder classifications, base metric units, and quintal conversion factors.
    /// </summary>
    [HttpGet("fodder-types")]
    public async Task<ActionResult<ApiResponse<List<FodderTypeDto>>>> GetFodderTypes()
    {
        var result = await _mediator.Send(new GetFodderTypesQuery());
        return Ok(result);
    }

    /// <summary>
    /// Retrieve standardized drought relief operational expense categories.
    /// </summary>
    [HttpGet("expense-categories")]
    public async Task<ActionResult<ApiResponse<List<ExpenseCategoryDto>>>> GetExpenseCategories()
    {
        var result = await _mediator.Send(new GetExpenseCategoriesQuery());
        return Ok(result);
    }

    /// <summary>
    /// Seed baseline operational dataset (camp with geofence, operators, farmers, livestock, initial fodder stocks).
    /// </summary>
    [HttpPost("seed")]
    public async Task<ActionResult<ApiResponse<SeedResultDto>>> SeedDatabase()
    {
        var result = await _mediator.Send(new SeedDatabaseCommand());
        return Ok(result);
    }
}
