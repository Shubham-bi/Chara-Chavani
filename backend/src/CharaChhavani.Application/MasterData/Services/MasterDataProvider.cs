using CharaChhavani.Application.MasterData.DTOs;

namespace CharaChhavani.Application.MasterData.Services;

public static class MasterDataProvider
{
    private static readonly List<DistrictDto> _districts = new()
    {
        new DistrictDto
        {
            Name = "Chhatrapati Sambhajinagar",
            MarathiName = "छत्रपती संभाजीनगर",
            Talukas = new() { "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad", "Sillod", "Soegaon", "Phulambri" }
        },
        new DistrictDto
        {
            Name = "Jalna",
            MarathiName = "जालना",
            Talukas = new() { "Jalna", "Ambad", "Partur", "Bhokardan", "Jafrabad", "Badnapur", "Ghansawangi", "Mantha" }
        },
        new DistrictDto
        {
            Name = "Beed",
            MarathiName = "बीड",
            Talukas = new() { "Beed", "Ashti", "Patoda", "Shirur (Kasar)", "Georai", "Majalgaon", "Wadwani", "Kaij", "Dharur", "Parli", "Ambajogai" }
        },
        new DistrictDto
        {
            Name = "Dharashiv",
            MarathiName = "धाराशिव",
            Talukas = new() { "Dharashiv", "Tuljapur", "Omerga", "Lohara", "Kalamb", "Bhum", "Paranda", "Washi" }
        },
        new DistrictDto
        {
            Name = "Solapur",
            MarathiName = "सोलापूर",
            Talukas = new() { "North Solapur", "South Solapur", "Barshi", "Akkalkot", "Mohol", "Pandharpur", "Malshiras", "Sangola", "Mangalwedha", "Karmala", "Madha" }
        },
        new DistrictDto
        {
            Name = "Ahmednagar",
            MarathiName = "अहिल्यानगर / अहमदनगर",
            Talukas = new() { "Nagar", "Rahuri", "Parner", "Pathardi", "Shevgaon", "Karjat", "Jamkhed", "Sangamner", "Kopargaon", "Shrirampur", "Nevasa", "Akole", "Rahata", "Shrigonda" }
        }
    };

    private static readonly List<BreedDto> _breeds = new()
    {
        // Cow Breeds
        new BreedDto { EnglishName = "Gir", MarathiName = "गीर", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Khillari", MarathiName = "खिल्लार", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Dangi", MarathiName = "डांगी", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Deoni", MarathiName = "देवणी", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Red Kandhari", MarathiName = "लाल कंधारी", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Sahiwal", MarathiName = "साहिवाल", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Crossbred HF", MarathiName = "एचएफ संकरित", AnimalType = "Cow" },
        new BreedDto { EnglishName = "Crossbred Jersey", MarathiName = "जर्सी संकरित", AnimalType = "Cow" },

        // Buffalo Breeds
        new BreedDto { EnglishName = "Murrah", MarathiName = "मुऱ्हा", AnimalType = "Buffalo" },
        new BreedDto { EnglishName = "Pandharpuri", MarathiName = "पंढरपुरी", AnimalType = "Buffalo" },
        new BreedDto { EnglishName = "Jaffarabadi", MarathiName = "जाफराबादी", AnimalType = "Buffalo" },
        new BreedDto { EnglishName = "Nagpuri", MarathiName = "नागपुरी", AnimalType = "Buffalo" },
        new BreedDto { EnglishName = "Mehsana", MarathiName = "मेहसाणा", AnimalType = "Buffalo" },

        // Bullock Breeds
        new BreedDto { EnglishName = "Khillari", MarathiName = "खिल्लार", AnimalType = "Bullock" },
        new BreedDto { EnglishName = "Dangi", MarathiName = "डांगी", AnimalType = "Bullock" },
        new BreedDto { EnglishName = "Deoni", MarathiName = "देवणी", AnimalType = "Bullock" },
        new BreedDto { EnglishName = "Red Kandhari", MarathiName = "लाल कंधारी", AnimalType = "Bullock" },

        // Goat Breeds
        new BreedDto { EnglishName = "Osmanabadi", MarathiName = "उस्मानाबादी", AnimalType = "Goat" },
        new BreedDto { EnglishName = "Sangamneri", MarathiName = "संगमनेरी", AnimalType = "Goat" },
        new BreedDto { EnglishName = "Berari", MarathiName = "बेरारी", AnimalType = "Goat" },

        // Sheep Breeds
        new BreedDto { EnglishName = "Deccani", MarathiName = "दख्खनी", AnimalType = "Sheep" },
        new BreedDto { EnglishName = "Madgyal", MarathiName = "माडग्याळ", AnimalType = "Sheep" },
    };

    private static readonly List<FodderTypeDto> _fodderTypes = new()
    {
        new FodderTypeDto
        {
            Code = "GreenFodder",
            EnglishName = "Green Fodder (Maize/Napier/Sorghum)",
            MarathiName = "हिरवा चारा (मका/नेपियर/ज्वारी)",
            BaseUnit = "kg",
            QuintalConversionFactor = 100.0
        },
        new FodderTypeDto
        {
            Code = "DryFodder",
            EnglishName = "Dry Fodder (Kadbi/Straw)",
            MarathiName = "सुका चारा (कडबा/भुसा)",
            BaseUnit = "kg",
            QuintalConversionFactor = 100.0
        },
        new FodderTypeDto
        {
            Code = "Silage",
            EnglishName = "Silage (Fermented Corn)",
            MarathiName = "मुरघास",
            BaseUnit = "kg",
            QuintalConversionFactor = 100.0
        },
        new FodderTypeDto
        {
            Code = "ConcentrateFeed",
            EnglishName = "Cattle Feed / Pellets",
            MarathiName = "पशुआहार / पेंड / खुराक",
            BaseUnit = "kg",
            QuintalConversionFactor = 100.0
        }
    };

    private static readonly List<ExpenseCategoryDto> _expenseCategories = new()
    {
        new ExpenseCategoryDto { Code = "WaterTanker", EnglishName = "Drinking Water Tanker Supply", MarathiName = "पाण्याचा टँकर पुरवठा" },
        new ExpenseCategoryDto { Code = "Labor", EnglishName = "Camp Labor & Security Personnel", MarathiName = "कामगार व सुरक्षारक्षक मानधन" },
        new ExpenseCategoryDto { Code = "Electricity", EnglishName = "Electricity & Night Illumination", MarathiName = "वीज व प्रकाश व्यवस्था" },
        new ExpenseCategoryDto { Code = "ShedMaintenance", EnglishName = "Shed Repairs & Sanitation Cleaning", MarathiName = "शेड दुरुस्ती व स्वच्छता" },
        new ExpenseCategoryDto { Code = "Medicines", EnglishName = "Veterinary Medicines & Mineral Mixture", MarathiName = "पशुवैद्यकीय औषधे व खनिज मिश्रण" },
        new ExpenseCategoryDto { Code = "Disinfection", EnglishName = "Disinfection & Lime Application", MarathiName = "जंतुनाशक व चुना फवारणी" },
        new ExpenseCategoryDto { Code = "Miscellaneous", EnglishName = "Miscellaneous Contingencies", MarathiName = "इतर किरकोळ खर्च" }
    };

    public static List<DistrictDto> GetDistricts() => _districts;

    public static List<string> GetTalukas(string districtName)
    {
        var district = _districts.FirstOrDefault(d => 
            d.Name.Equals(districtName, StringComparison.OrdinalIgnoreCase) ||
            d.MarathiName.Contains(districtName));

        return district?.Talukas ?? new List<string>();
    }

    public static List<BreedDto> GetBreeds(string? animalType = null)
    {
        if (string.IsNullOrWhiteSpace(animalType))
            return _breeds;

        return _breeds.Where(b => b.AnimalType.Equals(animalType, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    public static List<FodderTypeDto> GetFodderTypes() => _fodderTypes;

    public static List<ExpenseCategoryDto> GetExpenseCategories() => _expenseCategories;
}
