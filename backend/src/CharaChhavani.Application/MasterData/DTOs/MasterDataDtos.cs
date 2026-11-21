namespace CharaChhavani.Application.MasterData.DTOs;

public record DistrictDto
{
    public string Name { get; init; } = string.Empty;
    public string MarathiName { get; init; } = string.Empty;
    public List<string> Talukas { get; init; } = new();
}

public record BreedDto
{
    public string EnglishName { get; init; } = string.Empty;
    public string MarathiName { get; init; } = string.Empty;
    public string AnimalType { get; init; } = string.Empty;
}

public record FodderTypeDto
{
    public string Code { get; init; } = string.Empty;
    public string EnglishName { get; init; } = string.Empty;
    public string MarathiName { get; init; } = string.Empty;
    public string BaseUnit { get; init; } = "kg";
    public double QuintalConversionFactor { get; init; } = 100.0;
}

public record ExpenseCategoryDto
{
    public string Code { get; init; } = string.Empty;
    public string EnglishName { get; init; } = string.Empty;
    public string MarathiName { get; init; } = string.Empty;
}

public record SeedResultDto
{
    public int CampsCreated { get; init; }
    public int FarmersCreated { get; init; }
    public int AnimalsCreated { get; init; }
    public int OperatorsCreated { get; init; }
    public string Message { get; init; } = string.Empty;
}
