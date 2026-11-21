using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Animals.DTOs;
using CharaChhavani.Application.Animals.Queries;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Farmers.Commands;
using CharaChhavani.Application.Farmers.DTOs;
using CharaChhavani.Application.Farmers.Queries;
using CharaChhavani.Domain.Enums;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class FarmersController : BaseApiController
{
    private readonly IMediator _mediator;

    public FarmersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Send mobile OTP for farmer login/registration.
    /// </summary>
    [HttpPost("auth/send-otp")]
    public async Task<ActionResult<ApiResponse<string>>> SendOtp([FromBody] SendOtpCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }

    /// <summary>
    /// Verify mobile OTP and authenticate farmer.
    /// </summary>
    [HttpPost("auth/verify-otp")]
    public async Task<ActionResult<ApiResponse<AuthTokenResponseDto>>> VerifyOtp([FromBody] VerifyOtpCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Save or update farmer profile details.
    /// </summary>
    [HttpPost("profile")]
    public async Task<ActionResult<ApiResponse<FarmerDto>>> UpdateProfile([FromBody] RegisterOrUpdateFarmerCommand command)
    {
        var response = await _mediator.Send(command);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Get farmer dashboard metrics and summary counts.
    /// </summary>
    [HttpGet("{id:long}/dashboard")]
    public async Task<ActionResult<ApiResponse<FarmerDashboardDto>>> GetDashboard([FromRoute] long id)
    {
        var response = await _mediator.Send(new GetFarmerDashboardQuery(id));
        return Ok(response);
    }

    /// <summary>
    /// Get list of animals registered by this farmer.
    /// </summary>
    [HttpGet("{id:long}/animals")]
    public async Task<ActionResult<ApiResponse<List<AnimalDto>>>> GetFarmerAnimals(
        [FromRoute] long id,
        [FromQuery] VerificationStatus? verificationStatus,
        [FromQuery] AnimalStatus? currentStatus)
    {
        var query = new GetFarmerAnimalsQuery
        {
            FarmerId = id,
            VerificationStatus = verificationStatus,
            CurrentStatus = currentStatus
        };
        var response = await _mediator.Send(query);
        return Ok(response);
    }
}
