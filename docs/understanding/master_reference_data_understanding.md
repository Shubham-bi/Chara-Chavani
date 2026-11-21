# Master Reference Data & Database Seeder - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Requirement
In the Chara Chhavani system, mobile applications (Farmer, Vet, Officer, Operator) and the Admin Dashboard require reliable, standardized master reference data for form dropdowns, data validation, and unit normalization:
1. **Administrative Regions:** Maharashtra drought-affected districts, talukas, and villages to ensure consistency in camp registration, farmer profiles, and reporting.
2. **Animal Breeds & Types:** Standard breeds recognized by the Department of Animal Husbandry, Government of Maharashtra (e.g., Gir, Khillari, Dangi, Murrah, Pandharpuri, Osmanabadi).
3. **Fodder Types & Measurement Units:** Standard feed classifications (Green Fodder, Dry Fodder, Silage, Concentrate Feed) with base metric conversion ($1\text{ quintal} = 100\text{ kg}$).
4. **Expense Categories:** Pre-approved drought relief expenditure heads (Water Tanker, Labor, Electricity, Shed Repairs, Medicines, Miscellaneous).
5. **Database Seeding:** Idempotent database seeder to populate sample operational data (Camps with geofence, operators, farmers, animals, inventory) so the entire multi-app ecosystem is immediately usable and demonstrable.

---

## 2. Master Data Catalogs

### 2.1 Maharashtra Administrative Hierarchy
- **Chhatrapati Sambhajinagar (Aurangabad):** Paithan, Gangapur, Vaijapur, Kannad, Khuldabad, Sillod, Soegaon, Phulambri.
- **Jalna:** Jalna, Ambad, Partur, Bhokardan, Jafrabad, Badnapur, Ghansawangi, Mantha.
- **Beed:** Beed, Ashti, Patoda, Shirur (Kasar), Georai, Majalgaon, Wadwani, Kaij, Dharur, Parli, Ambajogai.
- **Dharashiv (Osmanabad):** Dharashiv, Tuljapur, Omerga, Lohara, Kalamb, Bhum, Paranda, Washi.
- **Solapur:** North Solapur, South Solapur, Barshi, Akkalkot, Mohol, Pandharpur, Malshiras, Sangola, Mangalwedha, Karmala, Madha.
- **Ahmednagar:** Nagar, Rahuri, Parner, Pathardi, Shevgaon, Karjat, Jamkhed, Sangamner, Kopargaon, Shrirampur, Nevasa, Akole, Rahata, Shrigonda.

### 2.2 Animal Breeds by Type
- **Cow (गाय):** Gir (गीर), Khillari (खिल्लार), Dangi (डांगी), Deoni (देवणी), Red Kandhari (लाल कंधारी), Sahiwal (साहिवाल), Crossbred Jersey / HF.
- **Buffalo (म्हैस):** Murrah (मुऱ्हा), Pandharpuri (पंढरपुरी), Jaffarabadi (जाफराबादी), Nagpuri (नागपुरी), Mehsana (मेहसाणा).
- **Bullock (बैल):** Khillari (खिल्लार), Dangi (डांगी), Deoni (देवणी), Red Kandhari (लाल कंधारी).
- **Goat (शेळी):** Osmanabadi (उस्मानाबादी), Sangamneri (संगमनेरी), Berari (बेरारी).
- **Sheep (मेंढी):** Deccani (दख्खनी), Madgyal (माडग्याळ).

### 2.3 Fodder Classifications & Conversions
- **Green Fodder (हिरवा चारा):** Base unit `kg`, supports `quintal` ($1\text{ quintal} = 100\text{ kg}$).
- **Dry Fodder (सुका चारा):** Base unit `kg`, supports `quintal`.
- **Silage (मुरघास):** Base unit `kg`.
- **Concentrate Feed (पशुआहार / खुराक):** Base unit `kg`.

### 2.4 Expense Categories
- Water Tanker Supply (पाण्याचा टँकर)
- Labor & Camp Watchmen (कामगार व सुरक्षारक्षक)
- Electricity & Illumination (वीज व प्रकाश व्यवस्था)
- Shed Repair & Maintenance (शेड दुरुस्ती व स्वच्छता)
- Veterinary Medicines & Mineral Mixture (औषधे व प्रथमोपचार)
- Disinfection & Lime Application (जंतुनाशक व चुना फवारणी)
- Miscellaneous & Contingency (इतर किरकोळ खर्च)

---

## 3. API Contract Specifications
- `GET /api/v1/master/districts` -> `List<DistrictDto>`
- `GET /api/v1/master/districts/{district}/talukas` -> `List<string>`
- `GET /api/v1/master/breeds?animalType={type}` -> `List<BreedDto>`
- `GET /api/v1/master/fodder-types` -> `List<FodderTypeDto>`
- `GET /api/v1/master/expense-categories` -> `List<ExpenseCategoryDto>`
- `POST /api/v1/master/seed` -> Seed summary response
