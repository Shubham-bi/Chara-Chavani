# Deployment Checklist

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Release Version:** v1.0.0  
**Execution Date:** 2026-12-01  
**Sign-off Authority:** DevOps Lead & Lead Architect  

---

## 1. Pre-Deployment Checklist (T - 24 Hours)

- [ ] **Git Tagging:** Branch `release/v1.0.0` tagged as `v1.0.0` and verified against commit `c719aec`.
- [ ] **Release Artifacts:** Docker container images built, scanned for CVEs, and published to private registry.
- [ ] **Database Backup:** Cold backup scheduled and automated snapshot retention confirmed in MySQL cluster.
- [ ] **Maintenance Page:** Static maintenance page deployed to S3/ALB fallback pool.
- [ ] **Secrets Verification:** Production `.env` secrets (JWT secret, DB credentials, API keys) populated in secret store.
- [ ] **DNS & SSL Certificates:** Wildcard SSL certificate `*.maharashtra.gov.in` valid for $> 90\text{ days}$.
- [ ] **Stakeholder Notification:** Emergency contact bridge established on Zoom/Signal.

---

## 2. Deployment Execution Checklist (T - 0)

- [ ] **Maintenance Mode Activated:** ALB routing all public traffic to maintenance page.
- [ ] **Database Snapshot Created:** Verified snapshot `pre_v100_snapshot.sql` created and verified.
- [ ] **Database Migrations Executed:** `dotnet ef database update` completed with zero errors.
- [ ] **Spatial Indexes Verified:** `SPX_Chhavanis_Boundary` on `Chhavanis.BoundaryPolygon` verified active in MySQL.
- [ ] **WebAPI Container Started:** ASP.NET Core 8 container up and healthy on internal port 8080.
- [ ] **Web Admin Container Started:** Node.js Express admin container up and healthy on internal port 3000.
- [ ] **Static Assets Verified:** `wwwroot/index.html` and `wwwroot/admin.html` accessible and rendering correctly.

---

## 3. Post-Deployment Verification Checklist (T + 30 Minutes)

- [ ] **Health Endpoint Probe:** `GET /api/v1/health` returns `200 OK` with MySQL connection healthy.
- [ ] **Automated Smoke Tests:** 19/19 E2E smoke tests in `scripts/e2e_smoke_test.ps1` return `PASS`.
- [ ] **Authentication Check:** Admin and Camp Operator login tokens issued and verified.
- [ ] **Geofence Boundary Test:** Location verification inside Paithan camp (#104) returns `isInside: true`.
- [ ] **Rule 9.6 Anti-Fraud Test:** Admission outside geofence boundary returns `403 Forbidden`.
- [ ] **Statutory CSV Export:** CSV export downloaded; verified UTF-8 BOM (`\uFEFF`) and Devanagari text in Excel.
- [ ] **Public Traffic Restored:** ALB maintenance rule removed; live production traffic enabled.
- [ ] **Log Monitoring:** Centralized Serilog / CloudWatch streams showing zero unexpected `500` exceptions.
