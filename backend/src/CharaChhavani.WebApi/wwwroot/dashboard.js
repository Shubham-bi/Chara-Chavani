// Maharashtra State Chara Chhavani Management System - Web Admin Dashboard Controller
const API_BASE = '';

async function fetchJson(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.warn(`HTTP ${res.status} for ${endpoint}`);
      return null;
    }
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn(`Fetch error for ${endpoint}:`, err);
    return null;
  }
}

class DashboardApp {
  static currentTab = 'admissions';

  static async init() {
    console.log('🚀 Chara Chhavani Admin Dashboard Initializing...');
    this.updateExportLinks();
    await this.loadKpis();
    await this.loadCamps();
    this.setupTabs();
    await this.loadReport('admissions');
  }

  static updateExportLinks() {
    const container = document.getElementById('csv-export-actions');
    if (!container) return;
    container.innerHTML = `
      <a href="/api/v1/admin/reports/export?reportType=admissions" class="btn" style="background: var(--primary); color: white;">📥 Admissions CSV</a>
      <a href="/api/v1/admin/reports/export?reportType=fodder" class="btn" style="background: var(--success); color: white;">📥 Fodder Balance CSV</a>
      <a href="/api/v1/admin/reports/export?reportType=expenses" class="btn" style="background: #0277BD; color: white;">📥 Expenses CSV</a>
      <a href="/api/v1/admin/reports/export?reportType=inspections" class="btn" style="background: var(--secondary); color: white;">📥 Inspection Logs CSV</a>
    `;
  }

  static async loadKpis() {
    const data = await fetchJson('/api/v1/admin/dashboard');
    if (!data) return;

    const elFarmers = document.getElementById('total-farmers');
    const elCattle = document.getElementById('total-cattle');
    const elCamps = document.getElementById('active-camps');
    const elUtil = document.getElementById('utilization');

    if (elFarmers) elFarmers.innerText = (data.totalRegisteredFarmers || 0).toLocaleString();
    if (elCattle) elCattle.innerText = (data.totalActiveAdmittedAnimals || 0).toLocaleString();
    if (elCamps) elCamps.innerText = (data.totalCharaChhavaniCentres || 0).toLocaleString();
    if (elUtil) elUtil.innerText = `${data.overallCapacityUtilizationPercentage || 0}%`;
  }

  static async loadCamps() {
    const tbody = document.getElementById('camps-table-body');
    const badge = document.getElementById('camps-count-badge');
    if (!tbody) return;

    const camps = await fetchJson('/api/v1/admin/camps-summary');
    if (!camps) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #DC2626;">API Connection Offline (WebAPI: localhost:5000)</td></tr>`;
      return;
    }

    if (badge) badge.innerText = `${camps.length} Centres Active`;

    if (camps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748B;">नोंदणीकृत छावण्या उपलब्ध नाहीत (No active camps registered).</td></tr>`;
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
            ? `<span class="badge badge-success">✓ Geofenced</span>` 
            : `<span class="badge badge-warning">⚠ Pending Geofence</span>`}
        </td>
      </tr>
    `).join('');
  }

  static setupTabs() {
    const tabs = ['admissions', 'fodder', 'expenses', 'inspections'];
    tabs.forEach(tabId => {
      const btn = document.getElementById(`tab-${tabId}`);
      if (!btn) return;
      btn.addEventListener('click', async () => {
        tabs.forEach(t => {
          const el = document.getElementById(`tab-${t}`);
          if (el) el.classList.remove('active');
        });
        btn.classList.add('active');
        this.currentTab = tabId;
        await this.loadReport(tabId);
      });
    });
  }

  static async loadReport(reportType) {
    const thead = document.getElementById('report-table-head');
    const tbody = document.getElementById('report-table-body');
    if (!thead || !tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #64748B;">माहिती लोड होत आहे... (Fetching ${reportType} report...)</td></tr>`;

    try {
      if (reportType === 'admissions') {
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
        const data = await fetchJson('/api/v1/admin/reports/admissions?pageSize=50');
        if (!data || data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No admission records found).</td></tr>`;
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
      } else if (reportType === 'fodder') {
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
        const data = await fetchJson('/api/v1/admin/reports/fodder-reconciliation');
        if (!data || data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No fodder reconciliation records found).</td></tr>`;
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
      } else if (reportType === 'expenses') {
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
        const data = await fetchJson('/api/v1/admin/reports/expenses?pageSize=50');
        if (!data || data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No expense records found).</td></tr>`;
          return;
        }
        tbody.innerHTML = data.map(r => `
          <tr>
            <td><strong>${r.voucherNumber ?? '-'}</strong></td>
            <td>${r.campName}</td>
            <td><span class="badge badge-info">${r.category}</span></td>
            <td><strong>₹${(r.amount || 0).toLocaleString()}</strong></td>
            <td>${r.paidTo ?? '-'}</td>
            <td>${new Date(r.expenseDate).toLocaleDateString()}</td>
            <td>${r.description ?? '-'}</td>
          </tr>
        `).join('');
      } else if (reportType === 'inspections') {
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
        const data = await fetchJson('/api/v1/admin/reports/inspections?pageSize=50');
        if (!data || data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #64748B;">नोंदी आढळल्या नाहीत (No inspection records found).</td></tr>`;
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
                ? `<span class="badge badge-success">0 (Match)</span>` 
                : `<span class="badge badge-warning">${r.headcountDiscrepancy > 0 ? '+' : ''}${r.headcountDiscrepancy}</span>`}
            </td>
            <td>
              ${r.waterSupplyAdequate && r.fodderStockAdequate 
                ? `<span class="badge badge-success">Adequate</span>` 
                : `<span class="badge badge-warning">Deficient</span>`}
            </td>
            <td>${r.generalRemarks ?? '-'}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.warn(`Error rendering ${reportType}:`, err);
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: #DC2626;">API Error or Server Offline.</td></tr>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => DashboardApp.init());
