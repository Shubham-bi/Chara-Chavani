using MediatR;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using CharaChhavani.Application.Auth.DTOs;
using CharaChhavani.Application.Common.Exceptions;
using CharaChhavani.Application.Common.Interfaces;
using CharaChhavani.Domain.Entities;

namespace CharaChhavani.Application.Auth.Commands;

// 1. Send OTP Command
public record SendMobileOtpCommand(string MobileNumber, string Role) : IRequest<string>;

public class SendMobileOtpCommandValidator : AbstractValidator<SendMobileOtpCommand>
{
    public SendMobileOtpCommandValidator()
    {
        RuleFor(v => v.MobileNumber)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^[6-9]\d{9}$").WithMessage("Valid 10-digit mobile number starting with 6-9 is required.");

        RuleFor(v => v.Role)
            .NotEmpty().WithMessage("User role is required.");
    }
}

public class SendMobileOtpCommandHandler : IRequestHandler<SendMobileOtpCommand, string>
{
    public Task<string> Handle(SendMobileOtpCommand request, CancellationToken cancellationToken)
    {
        // Simulation OTP for development/testing
        const string simulatedOtp = "123456";
        return Task.FromResult($"OTP sent successfully to {request.MobileNumber}. Dev OTP: {simulatedOtp}");
    }
}

// 2. Verify OTP Command
public record VerifyMobileOtpCommand(string MobileNumber, string Otp, string Role) : IRequest<MobileAuthResponse>;

public class VerifyMobileOtpCommandValidator : AbstractValidator<VerifyMobileOtpCommand>
{
    public VerifyMobileOtpCommandValidator()
    {
        RuleFor(v => v.MobileNumber)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Matches(@"^[6-9]\d{9}$").WithMessage("Valid 10-digit mobile number starting with 6-9 is required.");

        RuleFor(v => v.Otp)
            .NotEmpty().WithMessage("OTP is required.")
            .Length(6).WithMessage("OTP must be 6 digits.");
    }
}

public class VerifyMobileOtpCommandHandler : IRequestHandler<VerifyMobileOtpCommand, MobileAuthResponse>
{
    private readonly IApplicationDbContext _context;

    public VerifyMobileOtpCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MobileAuthResponse> Handle(VerifyMobileOtpCommand request, CancellationToken cancellationToken)
    {
        if (request.Otp != "123456")
        {
            throw new ValidationException(new[]
            {
                new FluentValidation.Results.ValidationFailure(nameof(request.Otp), "Invalid OTP. Use 123456 for testing.")
            });
        }

        var normalizedRole = request.Role.Trim().ToLowerInvariant();
        long userId = 0;
        string displayName = string.Empty;
        bool isProfileCompleted = false;

        switch (normalizedRole)
        {
            case "farmer":
                var farmer = await _context.Farmers
                    .FirstOrDefaultAsync(f => f.MobileNumber == request.MobileNumber, cancellationToken);

                if (farmer == null)
                {
                    // Provision provisional farmer
                    farmer = new Farmer
                    {
                        MobileNumber = request.MobileNumber,
                        Name = "New Farmer",
                        Village = "Pending",
                        Taluka = "Pending",
                        District = "Pending",
                        IsRegisteredSeller = false,
                        CreatedBy = request.MobileNumber,
                        CreatedAtUtc = DateTime.UtcNow
                    };
                    _context.Farmers.Add(farmer);
                    await _context.SaveChangesAsync(cancellationToken);
                    isProfileCompleted = false;
                }
                else
                {
                    isProfileCompleted = farmer.Village != "Pending" && !string.IsNullOrWhiteSpace(farmer.Name);
                }

                userId = farmer.Id;
                displayName = farmer.Name;
                break;

            case "campoperator":
                var op = await _context.ChhavaniOperators
                    .FirstOrDefaultAsync(o => o.MobileNumber == request.MobileNumber, cancellationToken);

                if (op != null)
                {
                    userId = op.Id;
                    displayName = op.Name;
                    isProfileCompleted = true;
                }
                else
                {
                    userId = 901;
                    displayName = "Camp Operator (" + request.MobileNumber + ")";
                    isProfileCompleted = true;
                }
                break;

            case "vetdoctor":
                userId = 801;
                displayName = "Veterinary Doctor (" + request.MobileNumber + ")";
                isProfileCompleted = true;
                break;

            case "officer":
                userId = 701;
                displayName = "Government Officer (" + request.MobileNumber + ")";
                isProfileCompleted = true;
                break;

            default:
                userId = 101;
                displayName = "User (" + request.MobileNumber + ")";
                isProfileCompleted = true;
                break;
        }

        var simulatedJwt = $"ey-simulated-jwt-token-{normalizedRole}-{request.MobileNumber}-{Guid.NewGuid():N}";

        return new MobileAuthResponse
        {
            Token = simulatedJwt,
            UserId = userId,
            Role = request.Role,
            MobileNumber = request.MobileNumber,
            DisplayName = displayName,
            IsProfileCompleted = isProfileCompleted
        };
    }
}

// 3. Admin Login Command (Username + Password)
public record AdminLoginCommand(string Username, string Password) : IRequest<AdminAuthResponse>;

public class AdminLoginCommandValidator : AbstractValidator<AdminLoginCommand>
{
    public AdminLoginCommandValidator()
    {
        RuleFor(v => v.Username).NotEmpty().WithMessage("Username is required.");
        RuleFor(v => v.Password).NotEmpty().WithMessage("Password is required.");
    }
}

public class AdminLoginCommandHandler : IRequestHandler<AdminLoginCommand, AdminAuthResponse>
{
    public Task<AdminAuthResponse> Handle(AdminLoginCommand request, CancellationToken cancellationToken)
    {
        // Standard Admin credentials check
        bool isValid = (request.Username.Equals("admin", StringComparison.OrdinalIgnoreCase) && 
                        (request.Password == "Admin@123" || request.Password == "NewPassword@123" || request.Password == "admin123" || request.Password == "AdminPassword@123"));

        if (!isValid)
        {
            throw new ValidationException(new[]
            {
                new FluentValidation.Results.ValidationFailure(nameof(request.Password), "Invalid admin username or password.")
            });
        }

        var adminToken = $"ey-admin-token-{Guid.NewGuid():N}";

        return Task.FromResult(new AdminAuthResponse
        {
            Token = adminToken,
            Username = request.Username,
            Role = "Admin",
            DisplayName = "State Relief Commissioner / Admin"
        });
    }
}
