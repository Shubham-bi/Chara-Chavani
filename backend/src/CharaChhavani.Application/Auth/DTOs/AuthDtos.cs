namespace CharaChhavani.Application.Auth.DTOs;

public record SendOtpRequest
{
    public string MobileNumber { get; init; } = string.Empty;
    public string Role { get; init; } = "Farmer"; // Farmer, VetDoctor, Officer, CampOperator
}

public record VerifyOtpRequest
{
    public string MobileNumber { get; init; } = string.Empty;
    public string Otp { get; init; } = string.Empty;
    public string Role { get; init; } = "Farmer";
}

public record MobileAuthResponse
{
    public string Token { get; init; } = string.Empty;
    public long UserId { get; init; }
    public string Role { get; init; } = string.Empty;
    public string MobileNumber { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public bool IsProfileCompleted { get; init; }
}

public record AdminLoginRequest
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record AdminAuthResponse
{
    public string Token { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public string Role { get; init; } = "Admin";
    public string DisplayName { get; init; } = "System Administrator";
}
