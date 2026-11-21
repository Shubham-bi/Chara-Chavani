using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Vet.Commands;
using CharaChhavani.Application.Vet.DTOs;
using CharaChhavani.Application.Vet.Queries;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class VetController : BaseApiController
{
    private readonly IMediator _mediator;

    public VetController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get summary dashboard metrics for veterinary doctor.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<VetDashboardDto>>> GetDashboard([FromQuery] string? doctorId)
    {
        var response = await _mediator.Send(new GetVetDashboardQuery(doctorId));
        return Ok(response);
    }

    /// <summary>
    /// List pending animals awaiting physical veterinary inspection.
    /// </summary>
    [HttpGet("pending-animals")]
    public async Task<ActionResult<ApiResponse<List<PendingVerificationAnimalDto>>>> GetPendingAnimals(
        [FromQuery] string? district,
        [FromQuery] string? taluka,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetPendingVerificationsQuery
        {
            District = district,
            Taluka = taluka,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    /// <summary>
    /// Submit veterinary verification decision (Approve / Reject) with GPS point and remarks.
    /// </summary>
    [HttpPost("verify")]
    public async Task<ActionResult<ApiResponse<VetVerificationResultDto>>> SubmitVerification([FromBody] SubmitVerificationCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// View verification history for inspections conducted by the doctor.
    /// </summary>
    [HttpGet("history")]
    public async Task<ActionResult<ApiResponse<List<VetVerificationResultDto>>>> GetHistory(
        [FromQuery] string? doctorId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var response = await _mediator.Send(new GetVetVerificationHistoryQuery(doctorId, pageNumber, pageSize));
        return Ok(response);
    }
}
