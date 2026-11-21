using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Admin.DTOs;
using CharaChhavani.Application.Admin.Queries;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AdminController : BaseApiController
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get system-wide KPIs across farmers, cattle, camp capacity, fodder inventory, and government expenditure.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<AdminDashboardSummaryDto>>> GetDashboardSummary()
    {
        var response = await _mediator.Send(new GetAdminDashboardQuery());
        return Ok(response);
    }

    /// <summary>
    /// Get capacity utilization and geofence status across all cattle camps.
    /// </summary>
    [HttpGet("camps-summary")]
    public async Task<ActionResult<ApiResponse<List<CampUtilizationSummaryDto>>>> GetCampsSummary()
    {
        var response = await _mediator.Send(new GetAdminCampsSummaryQuery());
        return Ok(response);
    }
}
