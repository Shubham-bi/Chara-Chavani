# Test Data Management Document

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-DAT-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. Master Seed Reference Datasets

### 1.1 Drought-Prone Districts (Maharashtra State)
- Chhatrapati Sambhajinagar (`id: 1`, `lat: 19.8762`, `lon: 75.3433`)
- Jalna (`id: 2`, `lat: 19.8410`, `lon: 75.8864`)
- Beed (`id: 3`, `lat: 18.9891`, `lon: 75.7601`)
- Dharashiv (`id: 4`, `lat: 18.1856`, `lon: 76.0418`)
- Solapur (`id: 5`, `lat: 17.6599`, `lon: 75.9064`)
- Ahmednagar (`id: 6`, `lat: 19.0948`, `lon: 74.7480`)
- Parbhani (`id: 7`, `lat: 19.2644`, `lon: 76.7749`)
- Hingoli (`id: 8`, `lat: 19.7196`, `lon: 77.1477`)
- Latur (`id: 9`, `lat: 18.4088`, `lon: 76.5604`)
- Nanded (`id: 10`, `lat: 19.1383`, `lon: 77.3210`)

### 1.2 Cattle Breeds & Categories
- **Small Cattle Breeds**: Osmanabadi Goat, Sangamneri Goat, Berari Goat, Deccani Sheep, Madgyal Sheep.
- **Large Cattle Breeds**: Khillari Cow, Dangi Cow, Gir Cow, Deoni Cow, Murrah Buffalo, Pandharpuri Buffalo, Nagpuri Buffalo.

### 1.3 Standardized Fodder Types
- Sugarcane Tops (ऊस वाडे) - Green Fodder
- Maize Chaff (मका कडबा) - Green/Dry Fodder
- Jowar Stover (ज्वारी कडबा) - Dry Roughage
- Cattle Feed Pellets (पशुखाद्य गोळी पेंड) - Concentrated Feed

---

## 2. Spatial Test Geometry Datasets

### 2.1 Registered Camp Geofence Polygon (Paithan Relief Camp)
- **Camp ID:** `3` | **Camp Code:** `CHV-MH-PAITHAN-001`
- **Centroid:** Latitude `19.8200`, Longitude `75.3300`
- **Boundary Vertices (Closed Ring SRID 4326):**
  1. Vertex 1: `(19.8100, 75.3200)`
  2. Vertex 2: `(19.8100, 75.3400)`
  3. Vertex 3: `(19.8300, 75.3400)`
  4. Vertex 4: `(19.8300, 75.3200)`
  5. Vertex 5 (Closing Ring): `(19.8100, 75.3200)`

### 2.2 Geofence Test Coordinates
- **Inside Coordinates (Valid Admission):** `lat: 19.8200, lon: 75.3300` -> Expected: `isInside = true`
- **Vertex-Edge Coordinates (Perimeter):** `lat: 19.8150, lon: 75.3200` -> Expected: `isInside = true`
- **Outside Coordinates (Rejection):** `lat: 18.9200, lon: 72.8300` (Mumbai) -> Expected: `isInside = false`
- **Far Outside Coordinates:** `lat: 18.5200, lon: 73.8500` (Pune) -> Expected: `isInside = false`

---

## 3. Synthetic User Profiles & Credentials

| Role | Name | Identifier / Mobile | Test Credentials / OTP |
|---|---|---|---|
| **Farmer** | Rameshwar Shinde | `9822012345` | Dev OTP: `123456` |
| **Vet Doctor** | Dr. Anil K. Deshmukh | `9822099999` | Dev OTP: `123456` |
| **Camp Operator** | Paithan Sahakari Mandal | `9822114455` | Dev OTP: `123456` |
| **Officer** | Tehsildar Paithan | `9822000001` | Dev OTP: `123456` |
| **Admin** | State Relief Commissioner | `admin` | Password: `AdminPassword@123` |
