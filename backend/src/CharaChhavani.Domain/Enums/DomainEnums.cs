namespace CharaChhavani.Domain.Enums;

public enum AnimalType
{
    Cow = 1,
    Buffalo = 2,
    Bullock = 3,
    Goat = 4,
    Sheep = 5,
    Other = 99
}

public enum Gender
{
    Male = 1,
    Female = 2
}

public enum VerificationStatus
{
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

public enum AnimalStatus
{
    Registered = 1,
    Verified = 2,
    Admitted = 3,
    Released = 4
}

public enum StockSource
{
    Store = 1,
    InFarm = 2
}

public enum FodderType
{
    GreenFodder = 1,
    DryFodder = 2,
    Silage = 3,
    ConcentrateFeed = 4
}

public enum AdjustmentType
{
    Increase = 1,
    Decrease = 2
}

public enum CampStatus
{
    Draft = 1,
    Active = 2,
    Inactive = 3,
    Closed = 4
}

public enum AdmissionStatus
{
    Admitted = 1,
    Released = 2
}
