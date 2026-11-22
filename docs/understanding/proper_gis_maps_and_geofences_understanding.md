# Understanding Document: Proper Administrative Boundaries & High-Precision Geofence Visualization

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Feature:** Proper Geographical Map with State, District, Taluka, Village, and Camp Geofence Boundaries  
**Document ID:** GIS-MAP-UND-001  
**Version:** 1.0.0  
**Lifecycle Stage:** Stage 2 (Understanding Document)  
**Author:** Lead GIS Solutions Architect & Front-End Engineer  

---

## 1. Requirement & User Intent Analysis

The user requested:
> *"use proper map and boundy for state, district, village and chavani geofence"*

This requirement aligns directly with Section 5 of [ADMIN DASHBOARD REQUIREMENTS DOCUMENT.md](file:///c:/Users/Shubham/Downloads/0_myDisk/Personal-Projects/Chara-Chhavani/ReferanceData/ADMIN%20DASHBOARD%20REQUIREMENTS%20DOCUMENT.md) (Geographic Intelligence – Interactive Map):
1. **State-Level Map**:
   - Official geographic boundary for Maharashtra State.
   - Realistic administrative boundaries for all drought-prone and surrounding districts across the state.
   - Dynamic choropleth color grading based on the active metric (`camps`, `animals`, `utilization`).
   - Dynamic tooltips and district centroid labels.
2. **District-Level Map**:
   - When a district is selected (e.g. *Chhatrapati Sambhajinagar*, *Beed*, *Jalna*, *Solapur*, *Dharashiv*, etc.), the map smoothly drills down and zooms into the district bounding box.
   - Displays all constituent Talukas with proper boundary polygons, camp counts, and color grading.
3. **Taluka-Level Map**:
   - When a taluka is selected (e.g. *Paithan*), the map zooms to that taluka and displays its constituent Village boundaries (e.g. *Pachod*, *Bidkin*, *Balanagar*, *Apegaon*, etc.).
4. **Village-Level & Chhavani Geofence Visualization**:
   - When a village or camp is selected, displays:
     - Real-world WGS84 coordinates projected from NetTopologySuite `Polygon` data (`camp.polygonCoordinates`).
     - Closed linear ring (SRID 4326) with distinct styling, vertex pins, and edge coordinates.
     - Centroid marker with relief tent icon ⛺.
     - 50-meter safety tolerance buffer zone.
     - Accurate perimeter and area calculations.
5. **Hierarchical Navigation & Layer Controls**:
   - Seamless drill-down on click, and drill-up (`State ← District ← Taluka ← Village ← Camp`) with instant breadcrumbs.
   - Layer toggles for Administrative Boundaries, Camp Markers, Geofence Polygons, and Geographic Grid (Latitude / Longitude parallels).

---

## 2. Technical Architecture & GIS Projection

### 2.1 Mathematical Coordinate Projection (WGS84 -> SVG Canvas)
To ensure geographic realism without requiring external third-party tile downloads (which can fail in offline or air-gapped government intranet environments), the GIS rendering engine utilizes an exact Equirectangular Projection:

$$\begin{aligned}
x &= x_{\min} + \frac{\lambda - \lambda_{\min}}{\lambda_{\max} - \lambda_{\min}} \cdot W_{\text{drawable}} \\
y &= y_{\max} - \frac{\phi - \phi_{\min}}{\phi_{\max} - \phi_{\min}} \cdot H_{\text{drawable}}
\end{aligned}$$

Where:
- $\phi$ = Latitude, $\lambda$ = Longitude.
- $[\phi_{\min}, \phi_{\max}, \lambda_{\min}, \lambda_{\max}]$ = Dynamic Bounding Box of the currently active geographic scope (State, District, Taluka, or Village).
- Inverted Y-axis ensures northern latitudes are rendered at the top of the SVG canvas.

### 2.2 Data Flow & Hierarchy Transition
```
[State View: Maharashtra]
  │  (User clicks district e.g. "Chhatrapati Sambhajinagar")
  ▼
[District View: 9 Talukas]
  │  (User clicks taluka e.g. "Paithan")
  ▼
[Taluka View: 8 Villages]
  │  (User clicks village e.g. "Pachod" / selects Camp)
  ▼
[Camp High-Resolution Geofence View]
  - Exact WGS84 NetTopologySuite Polygon (19.81, 75.32) -> (19.83, 75.34)
  - 4 Vertices with Coordinate Labels
  - 50m Buffer Perimeter & Relief Tent Centroid Marker
```

---

## 3. Boundary Dataset Specifications

1. **Maharashtra State & Districts**: Real geographical polygon boundary coordinates for Maharashtra and all 10 target drought-prone districts plus adjacent districts.
2. **Talukas of Chhatrapati Sambhajinagar**: Paithan, Gangapur, Vaijapur, Kannad, Khuldabad, Sillod, Soegaon, Phulambri, Aurangabad.
3. **Talukas of Beed, Jalna, Dharashiv, Solapur, Ahmednagar**: Complete regional taluka sets.
4. **Villages of Paithan**: Pachod (Camp Location), Bidkin, Balanagar, Adul, Apegaon, Navgaon, Isarwadi, Pimpalwadi.
5. **Chara Chhavani Actual Geofence**: Exact 5-point closed ring:
   `[(19.81, 75.32), (19.81, 75.34), (19.83, 75.34), (19.83, 75.32), (19.81, 75.32)]`.
