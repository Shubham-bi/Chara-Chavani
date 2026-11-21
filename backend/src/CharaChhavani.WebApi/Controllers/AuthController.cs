using MediatR;
using Microsoft.AspNetCore.Mvc;
using CharaChhavani.Application.Auth.Commands;
using CharaChhavani.Application.Auth.DTOs;
using CharaChhavani.Application.Common.Models;

namespace CharaChhavani.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : BaseApiController
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Send OTP to user's mobile number (Primary login for Farmers, Vet Doctors, Officers, and Operators).
    /// </summary>
    [HttpPost("mobile/send-otp")]
    public async Task<ActionResult<ApiResponse<string>>> SendMobileOtp([FromBody] SendOtpRequest request)
    {
        var result = await _mediator.Send(new SendMobileOtpCommand(request.MobileNumber, request.Role));
        return Ok(result);
    }

    /// <summary>
    /// Verify OTP and authenticate mobile user.
    /// </summary>
    [HttpPost("mobile/verify-otp")]
    public async Task<ActionResult<ApiResponse<MobileAuthResponse>>> VerifyMobileOtp([FromBody] VerifyOtpRequest request)
    {
        var result = await _mediator.Send(new VerifyMobileOtpCommand(request.MobileNumber, request.Otp, request.Role));
        return Ok(result);
    }

    /// <summary>
    /// Authenticate System Administrator using Username and Password for Web Admin Dashboard access.
    /// </summary>
    [HttpPost("admin/login")]
    public async Task<ActionResult<ApiResponse<AdminAuthResponse>>> AdminLogin([FromBody] AdminLoginRequest request)
    {
        var result = await _mediator.Send(new AdminLoginCommand(request.Username, request.Password));
        return Ok(result);
    }
}
