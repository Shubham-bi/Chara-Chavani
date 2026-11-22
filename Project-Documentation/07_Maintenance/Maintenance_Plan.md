# Maintenance Plan & Operational Runbook

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Document Version:** 1.0.0  
**Status:** Approved  
**Scheduled Windows:** Regular Maintenance: Every Sunday 02:00 AM – 04:00 AM IST  
**Operational Lead:** Lead DevOps & Database Administrator  

---

## 1. Maintenance Strategy & Objectives

The Maintenance Plan establishes proactive schedules, standard operating procedures, and automated maintenance jobs to ensure high performance, prevent database fragmentation, safeguard backup integrity, and apply operating system and security patches without disrupting daytime field camp operations.

---

## 2. Scheduled Maintenance Cadence

| Activity | Frequency | Execution Window | Impact on Service | Responsible Lead |
|---|---|---|---|---|
| **Automated Cold DB Backup** | Daily | 01:30 AM – 02:00 AM IST | Zero (Read replica snapshot) | Automated Cron / DBA |
| **MySQL Table Optimization & Re-Indexing** | Weekly | Sunday 02:30 AM – 03:00 AM IST | Low (Brief read lock) | Lead DBA |
| **Log Archive & Pruning (>30 Days)** | Weekly | Sunday 03:00 AM – 03:15 AM IST | Zero | CloudWatch / SRE |
| **OS Security & Container Patching** | Monthly | 1st Sunday 02:00 AM – 03:30 AM | Zero (Rolling restart) | Lead DevOps |
| **Disaster Recovery Failover Drill** | Quarterly | Scheduled off-season window | Controlled 15m test window | CTO & Lead Architect |
| **Annual CERT-In Security Audit** | Annually | Prior to drought season kickoff | Zero (Staging environment) | CISO & Audit Agency |

---

## 3. Database Maintenance & Index Optimization Runbook

### 3.1 Spatial & Relational Index Optimization
Over months of high-volume animal admissions and daily feeding records, MySQL indexes become fragmented:

```sql
-- Optimize core transactional tables (Weekly Routine)
OPTIMIZE TABLE Chhavanis;
OPTIMIZE TABLE Animals;
OPTIMIZE TABLE AnimalAdmissions;
OPTIMIZE TABLE FodderDistributions;
OPTIMIZE TABLE WaterSupplyLedgers;
OPTIMIZE TABLE CampInspections;

-- Verify spatial index status on camp boundary polygons
CHECK TABLE Chhavanis EXTENDED;
```

### 3.2 Automated Backup Verification Script
Backups are validated weekly by restoring the snapshot into an isolated staging container and running a record verification query:

```bash
#!/bin/bash
# automated_backup_verify.sh
SNAPSHOT="/var/backups/chara/daily_backup_$(date +%Y%m%d).sql.gz"
echo "Validating backup snapshot: $SNAPSHOT"

gunzip -c $SNAPSHOT | mysql -u test_user -pTestPass123! -h test-restore-db charachhavani_test

COUNT=$(mysql -u test_user -pTestPass123! -h test-restore-db -D charachhavani_test -sse "SELECT COUNT(*) FROM Animals;")
if [ "$COUNT" -gt 0 ]; then
    echo "SUCCESS: Backup verified with $COUNT animal records."
    exit 0
else
    echo "CRITICAL: Backup validation failed - zero records restored."
    exit 1
fi
```

---

## 4. Emergency Patching Procedure

For critical zero-day vulnerabilities (e.g., CVE in .NET runtime or OpenSSL):
1. Incident Commander initiates Emergency Maintenance window with 1-hour notice to District Collectors.
2. Build updated container image using latest certified base image:
   ```bash
   docker build --pull -t charachhavani-webapi:1.0.1-patch -f backend/Dockerfile .
   ```
3. Execute rolling update across container nodes with zero dropped active requests.
4. Run automated E2E smoke tests: `.\scripts\e2e_smoke_test.ps1 -ApiBaseUrl "http://localhost:5000"`.
5. Broadcast patch completion and close emergency window.
