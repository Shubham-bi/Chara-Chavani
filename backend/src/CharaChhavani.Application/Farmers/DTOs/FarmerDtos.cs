namespace CharaChhavani.Application.Farmers.DTOs;

public class FarmerDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string Village { get; set; } = string.Empty;
    public string Taluka { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public bool IsRegisteredSeller { get; set; }
}

public class FarmerDashboardDto
{
    public FarmerDto Farmer { get; set; } = new();
    public int TotalRegisteredAnimals { get; set; }
    public int PendingVerificationCount { get; set; }
    public int VerifiedCount { get; set; }
    public int RejectedCount { get; set; }
    public int AdmittedCount { get; set; }
}

public class AuthTokenResponseDto
{
    public string Token { get; set; } = string.Empty;
    public long FarmerId { get; set; }
    public string MobileNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsProfileCompleted { get; set; }
}
