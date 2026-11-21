using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Application.Common.Models;
using CharaChhavani.Application.Farmers.DTOs;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Farmers.Commands;

// 1. Send OTP Command
public record SendOtpCommand(string MobileNumber) : IRequest<ApiResponse<string>>;

public class SendOtpValidator : AbstractValidator<SendOtpCommand>
{
    public SendOtpValidator()
    {
        RuleFor(x => x.MobileNumber)
            .NotEmpty()
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("Please enter a valid 10-digit Indian mobile number.");
    }
}

public class SendOtpCommandHandler : IRequestHandler<SendOtpCommand, ApiResponse<string>>
{
    public Task<ApiResponse<string>> Handle(SendOtpCommand request, CancellationToken cancellationToken)
    {
        // For development / staging, default simulation OTP is 123456
        const string simulatedOtp = "123456";
        return Task.FromResult(ApiResponse<string>.Ok(simulatedOtp, $"OTP sent successfully to {request.MobileNumber}."));
    }
}

// 2. Verify OTP Command
public record VerifyOtpCommand(string MobileNumber, string Otp) : IRequest<ApiResponse<AuthTokenResponseDto>>;

public class VerifyOtpValidator : AbstractValidator<VerifyOtpCommand>
{
    public VerifyOtpValidator()
    {
        RuleFor(x => x.MobileNumber).NotEmpty().Matches(@"^[6-9]\d{9}$");
        RuleFor(x => x.Otp).NotEmpty().Length(6).WithMessage("OTP must be 6 digits.");
    }
}

public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, ApiResponse<AuthTokenResponseDto>>
{
    private readonly IApplicationDbContext _context;

    public VerifyOtpCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<AuthTokenResponseDto>> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
    {
        // Accept 123456 for demo/dev
        if (request.Otp != "123456")
        {
            return ApiResponse<AuthTokenResponseDto>.Failure("Invalid OTP entered.");
        }

        var farmer = await _context.Farmers
            .FirstOrDefaultAsync(f => f.MobileNumber == request.MobileNumber, cancellationToken);

        if (farmer == null)
        {
            // Auto-create provisional farmer record
            farmer = new Farmer
            {
                MobileNumber = request.MobileNumber,
                Name = string.Empty,
                State = "Maharashtra"
            };
            _context.Farmers.Add(farmer);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var tokenResponse = new AuthTokenResponseDto
        {
            Token = $"SIMULATED_JWT_TOKEN_{Guid.NewGuid():N}",
            FarmerId = farmer.Id,
            MobileNumber = farmer.MobileNumber,
            Name = farmer.Name,
            IsProfileCompleted = !string.IsNullOrWhiteSpace(farmer.Name) && !string.IsNullOrWhiteSpace(farmer.Village)
        };

        return ApiResponse<AuthTokenResponseDto>.Ok(tokenResponse, "Authentication successful.");
    }
}

// 3. Register or Update Farmer Profile
public record RegisterOrUpdateFarmerCommand : IRequest<ApiResponse<FarmerDto>>
{
    public long FarmerId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Address { get; init; }
    public string Village { get; init; } = string.Empty;
    public string Taluka { get; init; } = string.Empty;
    public string District { get; init; } = string.Empty;
    public string State { get; init; } = "Maharashtra";
    public bool IsRegisteredSeller { get; init; }
}

public class RegisterOrUpdateFarmerValidator : AbstractValidator<RegisterOrUpdateFarmerCommand>
{
    public RegisterOrUpdateFarmerValidator()
    {
        RuleFor(x => x.FarmerId).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Village).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Taluka).NotEmpty().MaximumLength(100);
        RuleFor(x => x.District).NotEmpty().MaximumLength(100);
    }
}

public class RegisterOrUpdateFarmerCommandHandler : IRequestHandler<RegisterOrUpdateFarmerCommand, ApiResponse<FarmerDto>>
{
    private readonly IApplicationDbContext _context;

    public RegisterOrUpdateFarmerCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<FarmerDto>> Handle(RegisterOrUpdateFarmerCommand request, CancellationToken cancellationToken)
    {
        var farmer = await _context.Farmers.FirstOrDefaultAsync(f => f.Id == request.FarmerId, cancellationToken);
        if (farmer == null)
        {
            return ApiResponse<FarmerDto>.Failure("Farmer profile not found.");
        }

        farmer.Name = request.Name;
        farmer.Address = request.Address;
        farmer.Village = request.Village;
        farmer.Taluka = request.Taluka;
        farmer.District = request.District;
        farmer.State = request.State;
        farmer.IsRegisteredSeller = request.IsRegisteredSeller;
        farmer.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new FarmerDto
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
        };

        return ApiResponse<FarmerDto>.Ok(dto, "Farmer profile updated successfully.");
    }
}
