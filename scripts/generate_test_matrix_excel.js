const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outputDir = path.resolve(__dirname, '../tests/fixtures/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'test_matrix.xlsx');

// 1. Sheet: Farmers
const farmersData = [
  {
    ScenarioId: 'FARMER_VALID_01',
    MobileNumber: '9822012345',
    FarmerName: 'Rameshwar B. Shinde',
    District: 'Chhatrapati Sambhajinagar',
    Taluka: 'Paithan',
    Village: 'Pachod',
    ExpectedRole: 'Farmer',
    ExpectedStatus: 'Registered'
  },
  {
    ScenarioId: 'FARMER_VALID_02',
    MobileNumber: '9822098765',
    FarmerName: 'Suresh G. Patil',
    District: 'Jalna',
    Taluka: 'Ambad',
    Village: 'Wadigodri',
    ExpectedRole: 'Farmer',
    ExpectedStatus: 'Registered'
  },
  {
    ScenarioId: 'FARMER_PROVISIONAL_01',
    MobileNumber: '9822055555',
    FarmerName: 'Kisanrao B. Chavan',
    District: 'Beed',
    Taluka: 'Georai',
    Village: 'Umapur',
    ExpectedRole: 'Farmer',
    ExpectedStatus: 'Provisional'
  },
  {
    ScenarioId: 'FARMER_INVALID_01',
    MobileNumber: '12345',
    FarmerName: 'Invalid Mobile Number',
    District: 'Solapur',
    Taluka: 'Madha',
    Village: 'Kurduvadi',
    ExpectedRole: 'None',
    ExpectedStatus: 'Rejected'
  }
];

// 2. Sheet: Camps
const campsData = [
  {
    CampId: 3,
    CampCode: 'CHV-MH-PAITHAN-001',
    Name: 'Paithan Taluka Shasan-Manya Chara Chhavani',
    District: 'Chhatrapati Sambhajinagar',
    Taluka: 'Paithan',
    Capacity: 500,
    Status: 'Active',
    ExpectedPerimeterKm: 8.8,
    ExpectedAreaHectares: 462
  },
  {
    CampId: 101,
    CampCode: 'CHV-MH-JALNA-001',
    Name: 'Ambad Taluka Fodder Camp',
    District: 'Jalna',
    Taluka: 'Ambad',
    Capacity: 1200,
    Status: 'Active',
    ExpectedPerimeterKm: 12.4,
    ExpectedAreaHectares: 850
  },
  {
    CampId: 102,
    CampCode: 'CHV-MH-BEED-001',
    Name: 'Georai Drought Relief Camp',
    District: 'Beed',
    Taluka: 'Georai',
    Capacity: 1500,
    Status: 'Active',
    ExpectedPerimeterKm: 14.1,
    ExpectedAreaHectares: 980
  }
];

// 3. Sheet: Geofences
const geofencesData = [
  {
    TestCaseId: 'GEO_INSIDE_CENTROID',
    CampId: 3,
    Latitude: 19.8200,
    Longitude: 75.3300,
    ExpectedInside: true,
    LocationType: 'Centroid',
    Description: 'Center of Paithan camp geofence'
  },
  {
    TestCaseId: 'GEO_INSIDE_EAST',
    CampId: 3,
    Latitude: 19.8250,
    Longitude: 75.3350,
    ExpectedInside: true,
    LocationType: 'Interior Near East Boundary',
    Description: 'Valid interior coordinate near eastern boundary'
  },
  {
    TestCaseId: 'GEO_INSIDE_GATE',
    CampId: 3,
    Latitude: 19.8150,
    Longitude: 75.3250,
    ExpectedInside: true,
    LocationType: 'Gate Entrance Vicinity',
    Description: 'Official camp gate admission point'
  },
  {
    TestCaseId: 'GEO_OUTSIDE_TALUKA',
    CampId: 3,
    Latitude: 19.7500,
    Longitude: 75.2500,
    ExpectedInside: false,
    LocationType: 'Outside Camp in Paithan Taluka',
    Description: 'Farmer village location outside camp perimeter'
  },
  {
    TestCaseId: 'GEO_OUTSIDE_MUMBAI',
    CampId: 3,
    Latitude: 18.9220,
    Longitude: 72.8347,
    ExpectedInside: false,
    LocationType: 'Distant Location (Mumbai)',
    Description: 'Completely outside drought district boundary'
  }
];

// 4. Sheet: Animals
const animalsData = [
  {
    ScenarioId: 'ANIMAL_LARGE_01',
    TagNumber: 'MH-TAG-1001',
    Category: 'Large Cattle',
    Breed: 'Khillari Cow',
    DailyFodderKg: 15.0,
    VetApproved: true,
    Status: 'Verified'
  },
  {
    ScenarioId: 'ANIMAL_LARGE_02',
    TagNumber: 'MH-TAG-1002',
    Category: 'Large Cattle',
    Breed: 'Murrah Buffalo',
    DailyFodderKg: 18.0,
    VetApproved: true,
    Status: 'Verified'
  },
  {
    ScenarioId: 'ANIMAL_SMALL_01',
    TagNumber: 'MH-TAG-2001',
    Category: 'Small Cattle',
    Breed: 'Osmanabadi Goat',
    DailyFodderKg: 3.5,
    VetApproved: true,
    Status: 'Verified'
  },
  {
    ScenarioId: 'ANIMAL_SMALL_02',
    TagNumber: 'MH-TAG-2002',
    Category: 'Small Cattle',
    Breed: 'Deccani Sheep',
    DailyFodderKg: 3.0,
    VetApproved: true,
    Status: 'Verified'
  }
];

// 5. Sheet: KPIThresholds
const kpisData = [
  {
    KpiKey: 'total-farmers',
    MetricName: 'Total Registered Farmers',
    MinExpected: 0,
    MaxExpected: 1000000
  },
  {
    KpiKey: 'total-cattle',
    MetricName: 'Active Admitted Cattle',
    MinExpected: 0,
    MaxExpected: 500000
  },
  {
    KpiKey: 'active-camps',
    MetricName: 'Active Relief Camps',
    MinExpected: 1,
    MaxExpected: 1000
  },
  {
    KpiKey: 'utilization',
    MetricName: 'Overall Capacity Utilization',
    MinExpected: 0,
    MaxExpected: 100
  }
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(farmersData), 'Farmers');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(campsData), 'Camps');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(geofencesData), 'Geofences');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(animalsData), 'Animals');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(kpisData), 'KPIThresholds');

XLSX.writeFile(workbook, outputPath);
console.log(`✅ Successfully generated test matrix Excel workbook at: ${outputPath}`);
console.log(`   Sheets created: ${workbook.SheetNames.join(', ')}`);
