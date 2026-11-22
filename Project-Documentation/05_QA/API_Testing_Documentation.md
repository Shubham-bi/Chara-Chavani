# API Testing Documentation & Contracts

**Project:** Chara Chhavani (Digital Cattle Camp Relief Management System)  
**Document ID:** QA-API-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead QA Automation Architect / SDET  

---

## 1. REST API Testing Scope & Architecture

The Chara Chhavani backend exposes RESTful APIs adhering to OpenAPI 3.0 / Swagger specifications, running on ASP.NET Core 8 WebAPI (`http://localhost:5000`).

```
Backend API Layers
├── /api/v1/auth/*        (Mobile OTP, Admin Username/Password, JWT)
├── /api/v1/master/*      (Districts, Talukas, Breeds, Fodder Types, Seeding)
├── /api/v1/camps/*       (Camp listing, Geofence validation, Capacity)
├── /api/v1/admin/*       (Geographic distribution, Camps Map, Section analytics)
├── /api/v1/reports/*     (Statutory RFC 4180 CSV exports)
└── /api/v1/health/*      (System health, spatial ray-casting diagnostics)
```

---

## 2. Core Endpoint Test Matrices

### 2.1 Spatial Geofence Verification (`GET /api/v1/camps/{campId}/validate-point`)
| Query Parameters | Input Value | Expected Status | Response Assertion |
|---|---|:---:|---|
| Inside Camp Coordinates | `latitude=19.82&longitude=75.33` | 200 OK | `isInside: true`, `message: "within the registered"` |
| Outside Camp Coordinates | `latitude=18.00&longitude=74.00` | 200 OK | `isInside: false`, `message: "OUTSIDE the registered"` |
| Boundary Vertex Edge | `latitude=19.81&longitude=75.32` | 200 OK | `isInside: true` |
| Invalid Coordinate Range | `latitude=999.0&longitude=999.0` | 400 Bad Request | Validation error array |

### 2.2 Mobile OTP Authentication (`/api/v1/auth/mobile/*`)
| Endpoint | Method | Payload | Expected Status | Response Assertion |
|---|---|---|:---:|---|
| `/send-otp` | POST | `{"mobileNumber": "9822012345", "role": "Farmer"}` | 200 OK | `success: true` |
| `/send-otp` | POST | `{"mobileNumber": "123", "role": "Farmer"}` | 400 Bad Request | `errors`: Invalid 10-digit mobile number |
| `/verify-otp` | POST | `{"mobileNumber": "9822012345", "otp": "123456", "role": "Farmer"}` | 200 OK | `token`: JWT string, `role: "Farmer"` |
| `/verify-otp` | POST | `{"mobileNumber": "9822012345", "otp": "000000", "role": "Farmer"}` | 401 Unauthorized | `message`: "Invalid or expired OTP" |

### 2.3 Server-Side Aggregations (`/api/v1/admin/*`)
| Endpoint | Query / Param | Description | Expected Status |
|---|---|---|:---:|
| `/geographic-distribution` | `level=District&metric=camps` | Returns all 10 districts with choropleth grades | 200 OK |
| `/camps-map` | None | Returns camp GeoJSON coordinates and stock | 200 OK |
| `/analytics/{section}` | `camps` / `animals` / `fodder` | Section-specific aggregated metrics | 200 OK |
| `/analytics/{section}` | `invalid-section` | Rejects unknown domain section | 200 OK (`success: false`) |

---

## 3. Negative API Testing & Invariant Safeguards

1. **SQL Injection**: Parameterized EF Core queries prevent SQL injection across search inputs.
2. **Missing Token**: Protected operational endpoints return `401 Unauthorized` without Bearer JWT.
3. **Payload Tampering**: FluentValidation catches malformed polygon geometries before geometry parsing.
