# CHARA CHHAVANI MANAGEMENT SYSTEM
# ADMIN DASHBOARD REQUIREMENTS DOCUMENT

**Document:** Dashboard Business and Functional Requirements  
**Version:** 2.0  
**Frontend:** React + TypeScript  
**Backend:** ASP.NET Core Web API (C#)  
**Database:** MySQL  
**Document Status:** Requirements Draft

---

# 1. Project Overview

The Admin Dashboard is a centralized administrative monitoring and analytical platform for the Chara Chhavani Management System.

The dashboard will provide geographical, operational and historical insights into Chara Chhavani centres, registered farmers, animals, fodder stock, feeding activities and operational expenses.

The dashboard will use an interactive geographical map as its primary visualization.

The Admin Officer must be able to navigate geographically from State to District, District to Taluka, Taluka to Village and finally view individual Chara Chhavani centres with their actual registered geofence boundaries.

The dashboard should follow a Power BI-style analytical approach, providing interactive maps, KPI cards, charts, filters, detailed records and drill-through functionality.

# 2. Dashboard Objectives

1. Monitor Chara Chhavani distribution across geographical areas.
2. Visualize registered Chara Chhavani centres on a geographical map.
3. Display actual geofence boundaries of individual camps.
4. Monitor camp capacity and admitted animal counts.
5. Monitor farmer and animal registration activities.
6. Track veterinary verification activities.
7. Monitor fodder purchases, stock and feeding consumption.
8. Monitor operational expenses.
9. Compare historical data using charts and trends.
10. Enable geographical and analytical drill-down.
11. Provide a centralized view of all registered camps.

# 3. Technology Stack

| Component | Technology |
|---|---|
| Web frontend | React + TypeScript |
| Backend | ASP.NET Core Web API / C# |
| Database | MySQL |
| Map visualization | MapLibre GL JS or equivalent |
| Geographic data format | GeoJSON |
| API communication | REST API |
| Authentication | Backend-managed authentication and authorization |

# 4. Dashboard Navigation Structure

The dashboard should contain the following main sections:

1. Overview
2. Geographic Analytics
3. Camp Analytics
4. Animal Analytics
5. Veterinary Verification
6. Fodder and Stock Analytics
7. Financial Analytics
8. Reports

# 5. Geographic Intelligence – Interactive Map

## 5.1 Primary Requirement

The geographical map is the central feature of the Admin Dashboard.

The map must support hierarchical geographical navigation:

**State → District → Taluka → Village → Chara Chhavani**

At each geographical level, the system must display the number of Chara Chhavani centres using colour-graded administrative boundaries.

Additionally, individual Chara Chhavani centres must be displayed as map markers with their actual geofence polygons.

## 5.2 State-Level Map

On opening the dashboard:

- Display the selected state's geographical map.
- Display district boundaries.
- Colour-grade each district according to the number of registered Chara Chhavani centres.
- Display the camp count associated with each district.
- Display districts with zero registered camps.

When the user hovers over a district, display:

- District name.
- Total Chara Chhavani centres.
- Registered farmers.
- Registered animals.
- Currently admitted animals.
- Total camp capacity.

## 5.3 District-Level Map

When the Admin Officer selects a district:

- Display the selected district's taluka boundaries.
- Colour-grade each taluka based on registered camp count.
- Display the camp count for each taluka.
- Display relevant animal and camp statistics.

## 5.4 Taluka-Level Map

When the Admin Officer selects a taluka:

- Display the villages belonging to that taluka.
- Colour-grade villages based on registered camp count.
- Display village-wise camp count.
- Display relevant animal and capacity statistics.

## 5.5 Village-Level Map

When the Admin Officer selects a village:

- Display all Chara Chhavani centres associated with that village.
- Display individual camp location markers.
- Display actual camp geofence boundaries.
- Allow selection of individual camps.
- Provide access to detailed camp information.

## 5.6 Map Colour Grading

The default colour-grading metric will be the number of registered Chara Chhavani centres.

Suggested initial colour scale:

| Camp count | Colour grade |
|---|---|
| 0 | Light grey |
| 1–5 | Very light blue |
| 6–10 | Light blue |
| 11–20 | Medium blue |
| 21–50 | Dark blue |
| More than 50 | Deep blue |

The ranges should be configurable.

The map must include a visible legend.

## 5.7 Alternative Map Metrics

Provide a map metric selector to change the colour-grading basis.

Available metrics:

1. Number of registered Chara Chhavani centres.
2. Number of currently admitted animals.
3. Camp capacity utilization percentage.

When the metric changes, the map should recalculate and display the corresponding colour grades.

The map legend must update according to the selected metric.

## 5.8 Geographical Navigation

The map must support:

- District drill-down.
- Taluka drill-down.
- Village drill-down.
- Breadcrumb navigation.
- Zoom in and zoom out.
- Reset to state-level view.
- Hover tooltips.
- Selection highlighting.
- Map legend.
- Selected-area information.
- Loading and no-data states.

The selected geographical area must remain clearly identifiable.

# 6. Chara Chhavani Location and Geofence Visualization

## 6.1 Camp Location Markers

Every registered Chara Chhavani must be represented by an individual marker.

The marker must use the camp's saved geographical coordinates.

Markers must be displayed at the appropriate geographical level and must respect the selected district, taluka and village filters.

## 6.2 Camp Geofence Polygons

The dashboard must display the actual geographical boundary registered for each Chara Chhavani.

The geofence must be rendered as a polygon using its saved coordinates.

Requirements:

- Display actual polygon boundaries.
- Display a transparent polygon fill.
- Display a visible polygon outline.
- Highlight the selected camp polygon.
- Keep the camp marker visible.
- Allow selection of individual polygons.
- Support overlapping camp geofences.
- Do not replace the actual polygon with an approximate circle.

## 6.3 Map Layer Controls

Provide controls to enable or disable:

- Administrative boundaries.
- Camp location markers.
- Camp geofence polygons.
- Selected camp highlighting.

## 6.4 Camp Selection

When a user clicks a camp marker or polygon, display a camp details panel.

Camp information:

- Camp name.
- Camp ID.
- Owner/operator name.
- Mobile number, subject to authorization.
- Village.
- Taluka.
- District.
- Address.
- Camp status.
- Configured capacity.
- Current admitted animals.
- Available capacity.
- Capacity utilization.

Animal information:

- Total registered animals associated with the camp.
- Currently admitted animals.
- Animal type distribution.
- Admission and release information.

Fodder information:

- Store stock.
- In Farm stock.
- Fodder purchases.
- Feeding consumption.

Expense information:

- Total fodder purchase amount.
- Total operational expenses.

Provide an action to open the detailed Camp Information page.

## 6.5 Geofence Data Accuracy

- Display the latest saved geofence.
- Use the same saved boundary data used by backend admission validation.
- Do not display unsaved changes.
- Handle missing or invalid geofence records.
- Ensure that the marker and polygon belong to the same camp.
- Preserve the original geofence coordinates.

# 7. Executive Overview Dashboard

The Overview page must provide a summary of the entire system.

## 7.1 Header

Display:

- Application name.
- Selected geographical scope.
- Date range.
- Last data refresh timestamp.
- Logged-in Admin Officer.
- User profile and logout.

## 7.2 Global Filters

Provide common filters:

| Filter | Description |
|---|---|
| State | Select state |
| District | Select district |
| Taluka | Select taluka |
| Village | Select village |
| Date range | Select reporting period |
| Camp status | Filter camp status |

All applicable dashboard visualizations must respond to the selected filters.

Provide a clear-all-filters option.

## 7.3 Primary KPI Cards

Display:

1. Total Chara Chhavani centres.
2. Total registered farmers.
3. Total registered animals.
4. Currently admitted animals.
5. Total camp capacity.
6. Available camp capacity.
7. Capacity utilization percentage.

## 7.4 Secondary KPI Cards

Display:

1. Pending veterinary verification.
2. Verified animals.
3. Rejected animals.
4. Released animals during selected period.
5. Total Store stock.
6. Total In Farm stock.
7. Total fodder consumption.
8. Total fodder purchase amount.
9. Total operational expenses.

Each KPI must have:

- Metric name.
- Current value.
- Unit where applicable.
- Applicable reporting period.
- Comparison with previous equivalent period, where meaningful.

# 8. Camp Analytics

## 8.1 Camp Summary

Display:

- Total registered camps.
- Active camps.
- Inactive camps, if applicable.
- Total configured capacity.
- Currently occupied capacity.
- Available capacity.

## 8.2 Camp Distribution

Recommended visualizations:

- Bar chart: Camps by district.
- Bar chart: Camps by taluka.
- Bar chart: Camps by village.
- Ranked table: Top geographical areas by camp count.

## 8.3 Capacity Utilization

Display occupied versus available capacity.

Recommended visualizations:

- Stacked bar chart: Occupied vs available capacity by camp.
- Bar chart: Capacity utilization by district.
- Camp-wise capacity table.

Table columns:

| Camp | Capacity | Admitted | Available | Utilization |
|---|---:|---:|---:|---:|

Highlight camps approaching maximum capacity.

# 9. Animal Analytics

## 9.1 Animal Summary

Display:

- Total registered animals.
- Pending verification.
- Verified animals.
- Rejected animals.
- Currently admitted animals.
- Released animals.

## 9.2 Animal Type Distribution

Display counts by animal type, such as:

- Cow.
- Buffalo.
- Goat.
- Sheep.
- Other configured types.

## 9.3 Historical Animal Charts

Recommended charts:

**A. Animal Registration Trend**

Bar chart showing new animal registrations by day, week or month.

**B. Animal Registration vs Admission**

Line chart comparing registered animals and admitted animals over time.

**C. Animal Type Distribution**

Bar chart comparing the number of animals by type.

**D. Admission vs Release Trend**

Line or clustered bar chart comparing admissions and releases over time.

# 10. Veterinary Verification Analytics

Display:

- Total verification requests.
- Pending verification.
- Verified animals.
- Rejected animals.
- Verification completion trend.

Recommended visualizations:

- Bar chart: Monthly verification count.
- Bar chart: Verification status distribution.
- Line chart: Verification requests vs completed verifications.
- Geographical distribution of pending verification requests.

Where authorized, provide doctor-wise verification counts.

# 11. Fodder and Stock Analytics

## 11.1 Stock Overview

Maintain separate Store and In Farm stock information.

Display:

- Total Store stock.
- Total In Farm stock.
- Total available stock.
- Fodder type-wise stock.
- Camp-wise stock.

## 11.2 Stock Movement

Display the following metrics:

- Opening stock.
- Purchased fodder received.
- In Farm fodder received.
- Feeding issued.
- Stock adjustments.
- Closing stock.

## 11.3 Historical Charts

Recommended visualizations:

**A. Fodder Purchase Trend**

Bar chart showing purchase quantity over time.

**B. Feeding Consumption Trend**

Line chart showing fodder consumption over time.

**C. Store vs In Farm Stock**

Comparison chart showing quantities at both locations.

**D. Fodder Type Distribution**

Bar chart showing available stock by fodder type.

**E. Camp-wise Stock Availability**

Ranked table comparing stock across Chara Chhavani centres.

All quantities must be displayed with their respective measurement units.

Incompatible units must not be combined without conversion.

# 12. Financial Analytics

## 12.1 Financial Summary

Display:

- Total fodder purchase amount.
- Total operational expenses.
- Labour charges.
- Water expenses.
- Electricity expenses.
- Transportation expenses.
- Other operational expenses.

## 12.2 Financial Charts

**A. Expense by Category**

Bar chart showing operational expenses by category.

**B. Monthly Expense Trend**

Line chart showing monthly operational expenses.

**C. Camp-wise Expenditure**

Bar chart comparing expenses across camps.

**D. Fodder Purchase Expenditure**

Historical bar chart showing monthly purchase amounts.

Purchase amounts and operational expenses must remain separately identifiable.

When displaying combined expenditure, fodder purchases must be included exactly once.

# 13. Historical Analytics and Chart Interaction

All historical charts must support:

- Date range selection.
- Daily, weekly and monthly aggregation, where appropriate.
- Geographical filtering.
- Tooltips.
- Data labels where useful.
- Legend.
- Drill-through to relevant records.
- Empty-state messages.

The dashboard should allow the Admin Officer to select a chart category and view the corresponding filtered records.

Historical figures must be calculated using transaction dates and relevant admission/release dates.

Current balances must not be used as substitutes for historical balances.

# 14. Detailed Drill-through

The dashboard should support the following navigation:

State → District → Taluka → Village → Camp → Detailed Camp Information.

The detailed Camp Information page must contain:

**Camp profile**
- Camp details.
- Owner/operator.
- Location.
- Geofence.
- Configured capacity.

**Animal information**
- Admitted animal list.
- Animal type distribution.
- Admission history.
- Release history.

**Fodder information**
- Store stock.
- In Farm stock.
- Purchase history.
- Feeding history.
- Stock adjustments.

**Financial information**
- Fodder purchase records.
- Operational expenses.
- Category-wise expenditure.

Maintain breadcrumbs and selected filters during navigation.

# 15. Reports

The dashboard must provide access to the following reports:

1. District-wise Chara Chhavani report.
2. Taluka-wise Chara Chhavani report.
3. Village-wise Chara Chhavani report.
4. Camp-wise capacity utilization report.
5. Farmer registration report.
6. Animal registration report.
7. Veterinary verification report.
8. Animal admission report.
9. Animal release report.
10. Fodder purchase report.
11. Store stock report.
12. In Farm stock report.
13. Feeding consumption report.
14. Stock adjustment report.
15. Operational expense report.

Reports should support applicable filters, pagination and authorized export functionality.

# 16. Backend and Database Data Requirements

## 16.1 Geographical Master Data

Maintain the following geographical master records:

- State.
- District.
- Taluka.
- Village.

Each record must have a unique identifier and parent-child relationship.

Every Chara Chhavani must be associated with its village, taluka, district and state.

Administrative boundary geometry must be maintained separately from camp geofence geometry.

## 16.2 Camp Geographical Data

Maintain:

- Camp ID.
- Camp latitude.
- Camp longitude.
- Geofence polygon coordinates.
- Geofence version or update history, where required.
- Geofence updated timestamp.

## 16.3 Historical Transaction Data

Maintain transaction dates for:

- Camp registration.
- Animal registration.
- Veterinary verification.
- Animal admission.
- Animal release.
- Fodder purchases.
- In Farm stock receipts.
- Feeding entries.
- Stock adjustments.
- Expense entries.

Historical dashboard calculations must use these records.

## 16.4 Reporting APIs

The backend should provide dedicated aggregated APIs for:

- Dashboard KPIs.
- Geographical camp distribution.
- District, taluka and village drill-down.
- Camp markers and geofences.
- Camp-level details.
- Animal analytics.
- Veterinary analytics.
- Fodder analytics.
- Expense analytics.
- Historical trends.
- Detailed reports.

The React frontend must not download complete transactional datasets just to calculate dashboard metrics.

# 17. Dashboard UI/UX Requirements

1. Use a clean Power BI-style layout.
2. Keep the geographical map prominent on the Overview page.
3. Use consistent colours for the same metrics.
4. Display clear titles and units for every chart.
5. Display map legends.
6. Provide meaningful tooltips.
7. Support responsive desktop and tablet layouts.
8. Provide loading, error and no-data states.
9. Preserve filter selections during drill-down.
10. Display data refresh timestamps.
11. Avoid overcrowding the Overview page.
12. Provide detailed analytical pages for deeper investigation.

# 18. Performance and Technical Requirements

1. Use server-side aggregation.
2. Implement pagination for large tables.
3. Optimize geographical queries.
4. Avoid unnecessary API calls.
5. Use appropriate API caching.
6. Load map boundary data efficiently.
7. Load camp markers and polygons according to geographical scope.
8. Avoid rendering every camp geofence at once when viewing a large geographical area if performance is affected.
9. Use lazy loading for detailed pages.
10. Ensure the dashboard handles unavailable APIs gracefully.

# 19. Access Control

The Admin Officer must have access to authorized administrative data.

The backend must enforce permissions for:

- Dashboard access.
- Camp details.
- Farmer information.
- Animal records.
- Financial information.
- Reports and exports.
- Geographical information.

Frontend visibility alone must never be treated as authorization.

# 20. Acceptance Criteria

The dashboard will be accepted when:

1. State-level geographical map is displayed.
2. Districts are colour-graded based on camp count.
3. District selection displays talukas.
4. Taluka selection displays villages.
5. Village selection displays individual Chara Chhavani centres.
6. Camp markers are displayed at their registered coordinates.
7. Actual camp geofence polygons are displayed.
8. Individual camp polygons can be selected.
9. Camp details are displayed upon selection.
10. Map colour grading can switch between camp count, admitted animals and capacity utilization.
11. KPI cards update based on geographical and date filters.
12. Historical bar and line charts display accurate information.
13. Animal, veterinary, fodder and financial analytics are available.
14. Chart selections provide access to relevant detailed records.
15. Historical figures match underlying database transactions.
16. All geographical relationships are correct.
17. Dashboard loading, error and no-data states work properly.
18. Role-based access is enforced.
19. Map and dashboard performance meet agreed acceptance thresholds.

# 21. Out of Scope

The initial dashboard will not include:

- Predictive animal population forecasting.
- AI-based fodder demand forecasting.
- Automated financial recommendations.
- Real-time GPS tracking of animals.
- Live operator tracking.
- Automated payment processing.
- Complex accounting functionality.

These features may be considered separately if business requirements arise.


Important implementation decisions
Before handing this to the React and .NET developers, I recommend recording these four decisions:
Decision	Recommendation
Map colour grading	Default camp count, with metric selector
Camp geofence	Actual saved polygon, not a circle
Geographical drill-down	Replace map with next level; preserve breadcrumb
Historical reporting	Transaction-based calculations, not current-state snapshots

One additional requirement I would strongly add: use official administrative boundary datasets for the selected state. The State → District → Taluka → Village hierarchy must use stable geographical IDs, not just text names. This is essential for accurate map drill-down and reporting.

---

**End of Admin Dashboard Requirements Document – Version 2.0**