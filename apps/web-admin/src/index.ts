import { apiClient } from './config';
import { AdminDashboardController } from './controllers/AdminDashboardController';
import { 
  AdminDashboardSummaryDto, 
  CampUtilizationSummaryDto,
  AdmissionAuditReportItemDto,
  FodderReconciliationReportItemDto,
  ExpenseAuditReportItemDto,
  InspectionAuditReportItemDto 
} from '@chara-chhavani/api-client';

export class AdminWebDashboardApp {
  private static currentTab: 'admissions' | 'fodder' | 'expenses' | 'inspections' = 'admissions';

  public static async init() {
    console.log('🚀 Initializing Maharashtra State Chara Chhavani Dashboard...');
    
    // 1. Initial Load of KPIs and Camps
    await this.loadAndRenderKpis();
    await this.loadAndRenderCamps();

    // 2. Setup Interactive Report Tab Listeners
    this.setupReportTabs();

    // 3. Initial Load of Default Report (Admissions)
    await this.loadAndRenderReport('admissions');
  }

  public static async loadAndRenderKpis() {
    try {
      const summary = await AdminDashboardController.fetchSystemKpis();
      if (!summary) return;

      const farmersEl = document.getElementById('total-farmers');
      const cattleEl = document.getElementById('total-cattle');
      const campsEl = document.getElementById('active-camps');
      const utilEl = document.getElementById('utilization');

      if (farmersEl) farmersEl.innerText = summary.totalRegisteredFarmers.toLocaleString();
      if (cattleEl) cattleEl.innerText = summary.totalActiveAdmittedAnimals.toLocaleString();
      if (campsEl) campsEl.innerText = summary.totalCharaChhavaniCentres.toLocaleString();
      if (utilEl) utilEl.innerText = `${summary.overallCapacityUtilizationPercentage}%`;
    } catch (err) {
      console.warn('⚠️ Unable to connect to WebAPI for KPIs (Server may still be starting):', err);
    }
  }

  public static async loadAndRenderCamps() {
    const tbody = document.getElementById('camps-table-body');
    const badge = document.getElementById('camps-count-badge');
    if (!tbody) return;

    try {
      const camps = await AdminDashboardController.fetchCampsOverview();
      if (badge) badge.innerText = `${camps.length} Centres Active`;

      if (camps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: #64748B;">नोंदणीकृत छावण्या उपलब्ध नाहीत (No active camps registered)</td></tr>';
        return;
      }

      tbody.innerHTML = camps.map(c => `
        <tr>
          <td><strong>${c.campCode}</strong></td>
          <td>${c.name}</td>
          <td>${c.district} / ${c.taluka}</td>
          <td>${c.totalCapacity}</td>
          <td><strong>${c.activeAnimalCount}</strong></td>
          <td>
            <div style="font-weight: 600;">${c.utilizationPercentage}%</div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${Math.min(100, c.utilizationPercentage)}%;"></div>
            </div>
          </td>
          <td>
            ${c.hasGeofence 
              ? '<span class="badge badge-success">✓ Geofenced</span>' 
              : '<span class="badge badge-warning">⚠ Pending Geofence</span>'}
          </td>
        </tr>
      `).join('');
    } catch (err) {
      console.warn('⚠️ Unable to fetch camps list:', err);
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: #DC2626;">API Connection Offline (WebAPI: http://localhost:5000)</td></tr>';
    }
  }

  public static setupReportTabs() {
    const tabs = ['admissions', 'fodder', 'expenses', 'inspections'] as const;

    tabs.forEach(tabId => {
      const btn = document.getElementById(`tab-${tabId}`);
      if (!btn) return;

      btn.addEventListener('click', async () => {
        // Toggle active class
        tabs.forEach(t => {
          const el = document.getElementById(`tab-${t}`);
          if (el) el.classList.remove('active');
        });
        btn.classList.add('active');

        this.currentTab = tabId;
        await this.loadAndRenderReport(tabId);
      });
    });
  }

  public static async loadAndRenderReport(reportType: 'admissions' | 'fodder' | 'expenses' | 'inspections') {
    const thead = document.getElementById('report-table-head');
    const tbody = document.getElementById('report-table-body');
    if (!thead || !tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #64748B;">लोड होत आहे... (Fetching ${reportType} report...)</td></tr>`;

    try {
      switch (reportType) {
        case 'admissions': {
          thead.innerHTML = `
            <tr>
              <th>प्रवेश कोड (Code)</th>
              <th>छावणीचे नाव (Camp Name)</th>
              <th>टॅग क्रमांक (Tag No)</th>
              <th>प्रवर्ग (Category)</th>
              <th>शेतकऱ्याचे नाव (Farmer Name)</th>
              <th>प्रवेश दिनांक (Admitted Date)</th>
              <th>छावणीतील दिवस (Active Days)</th>
              <th>स्थिती (Status)</th>
            </tr>
          `;
          const data: AdmissionAuditReportItemDto[] = await AdminDashboardController.fetchAdmissionReport();
          if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No admission records found).</td></tr>';
            return;
          }
          tbody.innerHTML = data.map(r => `
            <tr>
              <td><strong>${r.admissionCode}</strong></td>
              <td>${r.campName}</td>
              <td><span class="badge badge-info">${r.tagNumber}</span></td>
              <td>${r.animalCategory} (${r.breed})</td>
              <td>${r.farmerName} <br/><small style="color:#64748B;">${r.maskedAadhaar}</small></td>
              <td>${new Date(r.admittedAt).toLocaleDateString()}</td>
              <td><strong>${r.activeDaysInCamp} दिवस (days)</strong></td>
              <td><span class="badge ${r.status === 'Active' || r.status === 'Admitted' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
            </tr>
          `).join('');
          break;
        }

        case 'fodder': {
          thead.innerHTML = `
            <tr>
              <th>छावणीचे नाव (Camp Name)</th>
              <th>चारा प्रकार (Fodder Type)</th>
              <th>एकूण खरेदी (Purchased Q)</th>
              <th>एकूण वापर (Fed Kg)</th>
              <th>घट/दुरुस्ती (Adjusted Kg)</th>
              <th>गोदाम साठा (Store Kg)</th>
              <th>शेडमधील साठा (In-Farm Kg)</th>
              <th>शिल्लक साठा (Total Available)</th>
            </tr>
          `;
          const data: FodderReconciliationReportItemDto[] = await AdminDashboardController.fetchFodderReconciliation();
          if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No fodder reconciliation records found).</td></tr>';
            return;
          }
          tbody.innerHTML = data.map(r => `
            <tr>
              <td><strong>${r.campName}</strong></td>
              <td>${r.fodderType}</td>
              <td>${r.totalPurchasedQuintals} Q (${r.totalPurchasedKg} kg)</td>
              <td>${r.totalFedKg} kg</td>
              <td>${r.totalAdjustedKg} kg</td>
              <td>${r.availableStoreStockKg} kg</td>
              <td>${r.availableInFarmStockKg} kg</td>
              <td><strong style="color: var(--primary);">${r.totalAvailableStockKg} kg</strong></td>
            </tr>
          `).join('');
          break;
        }

        case 'expenses': {
          thead.innerHTML = `
            <tr>
              <th>व्हाउचर क्र. (Voucher)</th>
              <th>छावणीचे नाव (Camp Name)</th>
              <th>खर्च प्रकार (Category)</th>
              <th>रक्कम (Amount INR)</th>
              <th>देय व्यक्ती / संस्था (Paid To)</th>
              <th>खर्च दिनांक (Expense Date)</th>
              <th>तपशील (Description)</th>
            </tr>
          `;
          const data: ExpenseAuditReportItemDto[] = await AdminDashboardController.fetchExpenseAudit();
          if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No expense records found).</td></tr>';
            return;
          }
          tbody.innerHTML = data.map(r => `
            <tr>
              <td><strong>${r.voucherNumber ?? '-'}</strong></td>
              <td>${r.campName}</td>
              <td><span class="badge badge-info">${r.category}</span></td>
              <td><strong>₹${r.amount.toLocaleString()}</strong></td>
              <td>${r.paidTo ?? '-'}</td>
              <td>${new Date(r.expenseDate).toLocaleDateString()}</td>
              <td>${r.description ?? '-'}</td>
            </tr>
          `).join('');
          break;
        }

        case 'inspections': {
          thead.innerHTML = `
            <tr>
              <th>तपासणी दिनांक (Date)</th>
              <th>छावणीचे नाव (Camp Name)</th>
              <th>अधिकारी (Officer Name)</th>
              <th>प्रत्यक्ष जनावरे (Physical Count)</th>
              <th>नोंदवलेली जनावरे (System Count)</th>
              <th>तफावत (Discrepancy Δ)</th>
              <th>पाणी/चारा स्थिती (Water & Fodder)</th>
              <th>शेरा (Remarks)</th>
            </tr>
          `;
          const data: InspectionAuditReportItemDto[] = await AdminDashboardController.fetchInspectionAudit();
          if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No inspection records found).</td></tr>';
            return;
          }
          tbody.innerHTML = data.map(r => `
            <tr>
              <td>${new Date(r.inspectionDate).toLocaleDateString()}</td>
              <td><strong>${r.campName}</strong></td>
              <td>${r.officerName} <br/><small style="color:#64748B;">${r.officerDesignation}</small></td>
              <td><strong>${r.actualCattleHeadcount}</strong></td>
              <td>${r.systemReportedCattleCount}</td>
              <td>
                ${r.headcountDiscrepancy === 0 
                  ? '<span class="badge badge-success">0 (Match)</span>' 
                  : `<span class="badge badge-warning">${r.headcountDiscrepancy > 0 ? '+' : ''}${r.headcountDiscrepancy}</span>`}
              </td>
              <td>
                ${r.waterSupplyAdequate && r.fodderStockAdequate 
                  ? '<span class="badge badge-success">Adequate</span>' 
                  : '<span class="badge badge-warning">Deficient</span>'}
              </td>
              <td>${r.generalRemarks ?? '-'}</td>
            </tr>
          `).join('');
          break;
        }
      }
    } catch (err) {
      console.warn(`⚠️ Error rendering ${reportType} report:`, err);
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: #DC2626;">API Error or Server Offline.</td></tr>';
    }
  }

  public static async authenticateAdmin(username: string, password: string): Promise<boolean> {
    const res = await apiClient.auth.adminLogin({ username, password });
    return res.success;
  }
}

// Auto-initialize on browser DOM ready
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AdminWebDashboardApp.init());
  } else {
    AdminWebDashboardApp.init();
  }
}

export * from './config';
export * from './controllers/AdminDashboardController';
