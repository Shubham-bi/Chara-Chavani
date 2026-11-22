# Resource & Cost Estimation Document

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Currency:** Indian Rupee (INR ₹)  
**Target Duration:** 8 Sprints (16 Weeks Delivery + 1 Year Operational Support)  

---

## 1. Executive Summary

This document presents the detailed resource allocation and budget estimation for developing, deploying, scaling, and maintaining the Chara Chhavani cattle camp management platform across 8 drought-affected districts in Maharashtra. The estimation covers engineering human resources, cloud hosting on government-certified cloud infrastructure (MeghRaj NIC / AWS GovCloud), software licensing, third-party communication gateways, and mobile device provisioning for field operators.

---

## 2. Human Resource Plan & Staffing Structure

### 2.1 Core Engineering & Delivery Team

| Role | Headcount | Allocation (%) | Experience Level | Key Responsibilities |
|---|---|---|---|---|
| **Project Manager / Delivery Lead** | 1 | 100% | 10+ Years | Sprint planning, stakeholder sign-offs, risk management, government reporting. |
| **Principal Solutions Architect** | 1 | 50% | 12+ Years | Clean Architecture design, NetTopologySuite GIS strategy, security governance. |
| **Senior Backend Engineers (C# / .NET 8)** | 3 | 100% | 5–8 Years | CQRS Handlers, EF Core spatial queries, WebAPI endpoints, FluentValidation. |
| **Senior Mobile Engineers (React Native / TS)** | 3 | 100% | 4–7 Years | Mobile UI/UX, offline sync SQLite queue, GPS geofencing, Devanagari styling. |
| **Web Frontend Engineer (React / TypeScript)**| 2 | 100% | 3–5 Years | Web Admin portal, GIS polygon visualizer, CSV export triggers, dashboard analytics. |
| **Lead QA Automation Engineer (SDET)** | 2 | 100% | 4–6 Years | E2E smoke tests, API integration tests, BDD Gherkin test automation, load tests. |
| **DevOps & Cloud Security Engineer** | 1 | 100% | 5+ Years | CI/CD pipelines, Docker Compose / Kubernetes setups, SSL certs, Prometheus/Grafana. |
| **GIS & Spatial Data Specialist** | 1 | 50% | 5+ Years | SRID 4326 polygon validation, GeoJSON layers, KML import/export routines. |
| **Total Headcount:** | **14** | — | — | **Full-Time Equivalent (FTE): 12.5** |

---

## 3. Development Effort & Personnel Cost Estimation

* **Billing Duration:** 4 Months (Phase 1 to Phase 6) + 12 Months Support (Phase 7)
* Standard professional services billing rates applied (Govt Rate Contract Framework):

| Personnel Category | FTEs | Monthly Rate per FTE (INR ₹) | Total Cost for 4 Months Dev (INR ₹) | Annual Support Cost (INR ₹) |
|---|---|---|---|---|
| Project & Architecture Leadership | 1.5 | ₹ 3,50,000 | ₹ 21,00,000 | ₹ 10,50,000 |
| Backend & Mobile Engineering (6 FTE) | 6.0 | ₹ 2,20,000 | ₹ 52,80,000 | ₹ 26,40,000 |
| Web Frontend & GIS Engineering (2.5 FTE)| 2.5 | ₹ 1,80,000 | ₹ 18,00,000 | ₹ 9,00,000 |
| QA Automation & DevOps Engineering (3 FTE)| 3.0 | ₹ 1,90,000 | ₹ 22,80,000 | ₹ 11,40,000 |
| **Total Personnel Cost:** | **13.0** | — | **₹ 1,14,60,000** | **₹ 57,30,000** |

---

## 4. Cloud Infrastructure & Hosting Cost (Annual)

Hosting on Govt-Approved Cloud (MeghRaj / AWS Mumbai AP-South-1):

| Infrastructure Component | Specification / Sizing | Quantity | Unit Cost / Month (INR ₹) | Annual Total (INR ₹) |
|---|---|---|---|---|
| **WebAPI Compute Nodes (Linux)** | 4 vCPU, 16 GB RAM (c6g.xlarge) - Autoscaled | 3 Nodes | ₹ 14,000 | ₹ 5,04,000 |
| **Web Admin Static / Node Server** | 2 vCPU, 8 GB RAM (t4g.large) | 2 Nodes | ₹ 7,500 | ₹ 1,80,000 |
| **Primary Managed Database (MySQL 8.0)** | 8 vCPU, 32 GB RAM, 500 GB NVMe SSD (Multi-AZ) | 1 Cluster | ₹ 45,000 | ₹ 5,40,000 |
| **Redis In-Memory Cache** | 2 vCPU, 6 GB Memory (ElastiCache) | 1 Cluster | ₹ 9,500 | ₹ 1,14,000 |
| **Object Storage (Photos / PDFs / 7-12)** | S3-Compatible Tiered Storage (~5 TB/year) | 5,000 GB | ₹ 6,000 | ₹ 72,000 |
| **Load Balancer & SSL Termination** | Application Load Balancer with WAF rules | 2 | ₹ 4,500 | ₹ 1,08,000 |
| **Network Egress & CDN Delivery** | 10 TB Egress / month | 10 TB | ₹ 8,000 | ₹ 96,000 |
| **Total Infrastructure Cost:** | — | — | **₹ 94,500 / mo** | **₹ 16,14,000** |

---

## 5. Operational Communication & Field Device Costs

| Item | Details / Basis | Unit Rate | Annual Volume | Total Cost (INR ₹) |
|---|---|---|---|---|
| **SMS Gateway (OTP & Alerts)** | DLT-registered transactional SMS (Farmer registration & approvals) | ₹ 0.18 / SMS | 2,500,000 SMS | ₹ 4,50,000 |
| **Field Mobile Devices (Optional Provisioning)** | Ruggedized 4G LTE Android tablets (GPS L1+L5, 4GB RAM, 6000mAh battery) | ₹ 12,000 / unit | 250 Units | ₹ 30,00,000 |
| **Data Connectivity Packs (Jio/Airtel)** | 2GB/day Corporate SIM cards for field tablets | ₹ 250 / month | 250 Units $\times$ 12 mo | ₹ 7,50,000 |
| **Total Field Operations:** | — | — | — | **₹ 42,00,000** |

---

## 6. Total Project Financial Summary

| Expense Category | Capex / Initial Dev (INR ₹) | Opex / Annual Recurring (INR ₹) | Total Year 1 Budget (INR ₹) |
|---|---|---|---|
| **1. Engineering Development (4 Months)** | ₹ 1,14,60,000 | — | ₹ 1,14,60,000 |
| **2. Annual Maintenance & Support (AMC)** | — | ₹ 57,30,000 | ₹ 57,30,000 |
| **3. Cloud Hosting & Bandwidth** | — | ₹ 16,14,000 | ₹ 16,14,000 |
| **4. Communication (SMS & DLT Gateway)** | — | ₹ 4,50,000 | ₹ 4,50,000 |
| **5. Field Hardware & Connectivity** | ₹ 30,00,000 | ₹ 7,50,000 | ₹ 37,50,000 |
| **Contingency Reserve (8%)** | ₹ 11,56,800 | ₹ 6,83,520 | ₹ 18,40,320 |
| **Grand Total (Year 1 Lifecycle):** | **₹ 1,56,16,800** | **₹ 92,27,520** | **₹ 2,48,44,320** |

*(Rupees Two Crore Forty-Eight Lakh Forty-Four Thousand Three Hundred Twenty Only)*

---

## 7. Approval Signatures

* **Finance Secretary / Disaster Relief Dept:** Approved  
* **Principal Secretary (IT & e-Governance):** Approved  
* **Date:** 2026-11-21
