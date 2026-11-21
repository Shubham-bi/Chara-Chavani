using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Officer.Commands;
using CharaChhavani.Application.Officer.DTOs;
using CharaChhavani.Application.Officer.Queries;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OfficerController : BaseApiController
{
    private readonly IMediator _mediator;

    public OfficerController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get officer dashboard summary metrics (total camps, operators, cattle headcount, inspections conducted, and discrepancies).
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<OfficerDashboardSummaryDto>>> GetDashboard(
        [FromQuery] string? district = null,
        [FromQuery] string? taluka = null)
    {
        var response = await _mediator.Send(new GetOfficerDashboardQuery
        {
            District = district,
            Taluka = taluka
        });
        return HandleResult(response, "Officer dashboard metrics retrieved successfully.");
    }

    /// <summary>
    /// Record a physical camp field inspection with GPS location stamping, animal headcount verification, and welfare checks.
    /// </summary>
    [HttpPost("inspections")]
    public async Task<ActionResult<ApiResponse<long>>> RecordInspection([FromBody] RecordCampInspectionCommand command)
    {
        var inspectionId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCampInspections), new { campId = command.ChhavaniId }, ApiResponse<long>.Ok(inspectionId, "Camp inspection recorded successfully."));
    }

    /// <summary>
    /// Retrieve immutable audit trail of past field inspections for a specific cattle camp.
    /// </summary>
    [HttpGet("camps/{campId}/inspections")]
    public async Task<ActionResult<ApiResponse<List<CampInspectionSummaryDto>>>> GetCampInspections([FromRoute] long campId)
    {
        var response = await _mediator.Send(new GetCampInspectionsQuery(campId));
        return HandleResult(response, "Camp inspections retrieved successfully.");
    }
}
