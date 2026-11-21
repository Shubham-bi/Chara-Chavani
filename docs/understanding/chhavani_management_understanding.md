# Chhavani Camp Management & Geofencing Understanding Document
**Module:** Chara Chhavani Management & Spatial Geofence  
**Reference:** [BRD.md](../../ReferanceData/BRD.md) (Workflow 2), [FSD.md](../../ReferanceData/FSD.md) (Section 3), [Development-Guidlines.md](../../ReferanceData/Development-Guidlines.md)  
**Date:** 2026-11-22  

---

## 1. Business Context & Target Users
Cattle camps (Chara Chhavani) are established by government administration during drought periods to shelter and feed livestock.
- **Officer & Admin Persona:** Registers new camps, assigns operators, inputs total capacity, and defines the camp boundary by drawing a closed polygon geofence on the map.
- **Chhavani Operator Persona:** Authenticates and operates within their assigned camp to admit animals and manage stocks.

---

## 2. Functional Requirements & Invariants

### 2.1 Camp Registration & Operator Assignment
* System generates a unique `CampCode` (format: `CMP-YYYYMMDD-XXXX` or `CMP-<DISTRICT>-XXXX`).
* Captures camp address hierarchy: State (`Maharashtra`), District, Taluka, Village, and local address.
* Captures configurable animal capacity (e.g. 500 animals). `ActiveAnimalCount` defaults to 0.
* Operator profile (Name, MobileNumber) created and linked to the camp.

### 2.2 Geofence Definition & Spatial Invariants
* **Polygon Geofence:** Must be a valid polygon with at least 3 distinct geographic coordinate vertices (latitude, longitude) forming a closed linear ring.
* **Coordinate System:** WGS 84 (EPSG/SRID 4326). In GIS standards: Longitude is X, Latitude is Y.
* **Spatial Storage:** Stored as MySQL `POLYGON` geometry and mapped in .NET via NetTopologySuite `Polygon`.
* **Centroid/Entrance:** Derived centroid or selected entrance stored as a `POINT`.

### 2.3 Business Rules
1. Every camp must have a unique `CampCode`.
2. Total capacity must be $> 0$.
3. Operator mobile number must be a valid 10-digit mobile number.
4. Camp status workflow: `Draft` $\rightarrow$ `Active` $\rightarrow$ `Inactive` $\rightarrow$ `Closed`.
5. Geofence polygon vertices must form a valid closed linear ring where first point equals last point.

---

## 3. Data Flow & API Contracts

### Endpoints
* `POST /api/v1/camps`: Register a new camp with operator and initial capacity.
* `PUT /api/v1/camps/{id}/geofence`: Set or update the camp's polygon geofence boundary.
* `GET /api/v1/camps`: List camps with filtering (district, taluka, status) and pagination.
* `GET /api/v1/camps/{id}`: Get full camp details including GeoJSON polygon coordinates, operator info, and capacity stats.
* `GET /api/v1/camps/{id}/validate-point`: Check if a given GPS coordinate $(lat, lng)$ is inside the camp's geofence.
