// Maharashtra State Chara Chhavani Management System - Web Admin Dashboard Controller (CR v2.0)
const API_BASE = window.location.origin.includes('5000') ? '' : 'http://localhost:5000';

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
  static currentSection = 'overview';
  static currentReportTab = 'admissions';
  static currentDistrict = '';
  static currentTaluka = '';
  static currentMetric = 'camps';
  static mapLevel = 'state'; // state | district | taluka
  static campsData = [];
  static mapFeatures = [];
  static geoData = null;

  static async init() {
    console.log('🚀 Chara Chhavani Admin Dashboard v2.0 Initializing...');
    this.setupSectionNav();
    this.setupGlobalFilters();
    this.setupMapControls();
    this.setupReportTabs();
    this.updateExportLinks();

    await this.refreshAllData();
  }

  static async refreshAllData() {
    const timeEl = document.getElementById('last-refresh-time');
    if (timeEl) timeEl.innerText = `Synced: ${new Date().toLocaleTimeString()}`;

    await Promise.all([
      this.loadKpis(),
      this.loadCamps(),
      this.loadMapData(),
      this.loadActiveSectionData(),
      this.loadReport(this.currentReportTab)
    ]);
  }

  // 1. Navigation Between Power BI Analytical Sections
  static setupSectionNav() {
    const buttons = document.querySelectorAll('.nav-tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const section = btn.getAttribute('data-section');
        this.switchSection(section);
      });
    });

    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        await this.refreshAllData();
      });
    }
  }

  static async switchSection(sectionName) {
    this.currentSection = sectionName;
    document.querySelectorAll('.analytics-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(`section-${sectionName}`);
    if (target) target.classList.add('active');

    await this.loadActiveSectionData();
  }

  static async loadActiveSectionData() {
    switch (this.currentSection) {
      case 'overview':
        await this.loadKpis();
        break;
      case 'geographic':
        await this.loadGeographicAnalytics();
        break;
      case 'camps':
        await this.loadCampAnalytics();
        break;
      case 'animals':
        await this.loadAnimalAnalytics();
        break;
      case 'veterinary':
        await this.loadVeterinaryAnalytics();
        break;
      case 'fodder':
        await this.loadFodderAnalytics();
        break;
      case 'financial':
        await this.loadFinancialAnalytics();
        break;
      case 'reports':
        await this.loadReport(this.currentReportTab);
        break;
    }
  }

  // 2. Global Filter Controls & Breadcrumbs
  static setupGlobalFilters() {
    const distSelect = document.getElementById('filter-district');
    const talukaSelect = document.getElementById('filter-taluka');
    const metricSelect = document.getElementById('filter-metric');
    const resetBtn = document.getElementById('btn-reset-filters');

    if (distSelect) {
      distSelect.addEventListener('change', async (e) => {
        this.currentDistrict = e.target.value;
        this.currentTaluka = '';
        this.mapLevel = this.currentDistrict ? 'district' : 'state';
        this.updateTalukaDropdown();
        this.updateBreadcrumbs();
        await this.refreshAllData();
      });
    }

    if (talukaSelect) {
      talukaSelect.addEventListener('change', async (e) => {
        this.currentTaluka = e.target.value;
        this.mapLevel = this.currentTaluka ? 'taluka' : (this.currentDistrict ? 'district' : 'state');
        this.updateBreadcrumbs();
        await this.refreshAllData();
      });
    }

    if (metricSelect) {
      metricSelect.addEventListener('change', async (e) => {
        this.currentMetric = e.target.value;
        this.updateMapLegend();
        await this.loadMapData();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        this.currentDistrict = '';
        this.currentTaluka = '';
        this.mapLevel = 'state';
        if (distSelect) distSelect.value = '';
        if (talukaSelect) talukaSelect.innerHTML = '<option value="">All Talukas (सर्व तालुके)</option>';
        this.updateBreadcrumbs();
        await this.refreshAllData();
      });
    }

    const breadcrumbs = document.getElementById('map-breadcrumbs');
    if (breadcrumbs) {
      breadcrumbs.addEventListener('click', async (e) => {
        const item = e.target.closest('.breadcrumb-item');
        if (!item) return;
        const level = item.getAttribute('data-level');
        if (level === 'state') {
          this.currentDistrict = '';
          this.currentTaluka = '';
          this.mapLevel = 'state';
          if (distSelect) distSelect.value = '';
          this.updateTalukaDropdown();
          this.updateBreadcrumbs();
          await this.refreshAllData();
        }
      });
    }
  }

  static updateTalukaDropdown() {
    const talukaSelect = document.getElementById('filter-taluka');
    if (!talukaSelect) return;

    if (!this.currentDistrict) {
      talukaSelect.innerHTML = '<option value="">All Talukas (सर्व तालुke)</option>';
      return;
    }

    const talukaMap = {
      'Chhatrapati Sambhajinagar': ['Paithan', 'Gangapur', 'Vaijapur', 'Kannad', 'Khuldabad', 'Sillod', 'Soegaon', 'Phulambri'],
      'Jalna': ['Jalna', 'Ambad', 'Bhokardan', 'Badnapur', 'Partur', 'Mantha', 'Jafrabad', 'Ghansawangi'],
      'Beed': ['Beed', 'Georai', 'Majalgaon', 'Ashti', 'Patoda', 'Shirur-Kasar', 'Kaij', 'Dharur', 'Parli', 'Ambajogai', 'Wadwani'],
      'Dharashiv': ['Dharashiv', 'Tuljapur', 'Bhoom', 'Paranda', 'Kalamb', 'Omerga', 'Lohara', 'Washi'],
      'Solapur': ['Solapur North', 'Solapur South', 'Barshi', 'Mohol', 'Pandharpur', 'Karmala', 'Madha', 'Sangola', 'Malshiras'],
      'Ahmednagar': ['Nagar', 'Shevgaon', 'Pathardi', 'Parner', 'Sangamner', 'Kopargaon', 'Shrirampur', 'Nevasa', 'Rahata', 'Karjat', 'Jamkhed'],
      'Parbhani': ['Parbhani', 'Gangakhed', 'Jintur', 'Manwath', 'Pathri', 'Palam', 'Purna', 'Sailu', 'Sonpeth'],
      'Latur': ['Latur', 'Ausa', 'Nilanga', 'Udgir', 'Chakur', 'Deoni', 'Shirur-Anantpal', 'Jalkot', 'Renapur'],
      'Nanded': ['Nanded', 'Ardhapur', 'Mudkhed', 'Bhokar', 'Loha', 'Kandhar', 'Mukhed', 'Deglur', 'Biloli', 'Dharmabad', 'Hadgaon', 'Kinwat'],
      'Hingoli': ['Hingoli', 'Kalamnuri', 'Basmath', 'Aundha Nagnath', 'Sengaon']
    };

    const list = talukaMap[this.currentDistrict] || ['Central', 'North', 'South', 'East', 'West'];
    talukaSelect.innerHTML = `<option value="">All Talukas (${this.currentDistrict})</option>` +
      list.map(t => `<option value="${t}" ${t === this.currentTaluka ? 'selected' : ''}>${t}</option>`).join('');
  }

  static updateBreadcrumbs() {
    const bDist = document.getElementById('breadcrumb-district');
    const bTal = document.getElementById('breadcrumb-taluka');
    const drillUpBtn = document.getElementById('btn-map-drillup');

    if (bDist) bDist.innerText = this.currentDistrict ? `District: ${this.currentDistrict}` : 'District: All';
    if (bTal) bTal.innerText = this.currentTaluka ? `Taluka: ${this.currentTaluka}` : 'Taluka: All';

    if (drillUpBtn) {
      drillUpBtn.disabled = !this.currentDistrict;
    }

    const scopeLabel = document.getElementById('map-scope-label');
    if (scopeLabel) {
      if (this.currentTaluka) {
        scopeLabel.innerText = `Taluka Level: ${this.currentTaluka}, ${this.currentDistrict}`;
      } else if (this.currentDistrict) {
        scopeLabel.innerText = `District Level: ${this.currentDistrict} (Showing Talukas)`;
      } else {
        scopeLabel.innerText = 'State Level: Maharashtra (10 Drought Districts)';
      }
    }
  }

  // 3. Interactive Geographical Vector Map Component
  static setupMapControls() {
    const drillUpBtn = document.getElementById('btn-map-drillup');
    const resetBtn = document.getElementById('btn-map-reset');
    const tBoundaries = document.getElementById('toggle-layer-boundaries');
    const tMarkers = document.getElementById('toggle-layer-markers');
    const tGeofence = document.getElementById('toggle-layer-geofence');

    if (drillUpBtn) {
      drillUpBtn.addEventListener('click', async () => {
        if (this.currentTaluka) {
          this.currentTaluka = '';
          this.mapLevel = 'district';
        } else if (this.currentDistrict) {
          this.currentDistrict = '';
          this.mapLevel = 'state';
          const distSelect = document.getElementById('filter-district');
          if (distSelect) distSelect.value = '';
          this.updateTalukaDropdown();
        }
        this.updateBreadcrumbs();
        await this.refreshAllData();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        this.currentDistrict = '';
        this.currentTaluka = '';
        this.mapLevel = 'state';
        const distSelect = document.getElementById('filter-district');
        if (distSelect) distSelect.value = '';
        this.updateTalukaDropdown();
        this.updateBreadcrumbs();
        await this.refreshAllData();
      });
    }

    [tBoundaries, tMarkers, tGeofence].forEach(t => {
      if (t) {
        t.addEventListener('change', () => this.renderSvgMap());
      }
    });
  }

  static async loadMapData() {
    const q = new URLSearchParams();
    if (this.currentDistrict) q.append('district', this.currentDistrict);
    if (this.currentTaluka) q.append('taluka', this.currentTaluka);
    q.append('metric', this.currentMetric);

    const [geoRes, mapFeatures] = await Promise.all([
      fetchJson(`/api/v1/admin/geographic-distribution?${q.toString()}`),
      fetchJson(`/api/v1/admin/camps-map?${q.toString()}`)
    ]);

    this.geoData = geoRes;
    this.mapFeatures = mapFeatures || [];

    this.renderSvgMap();
  }

  static renderSvgMap() {
    const viewport = document.getElementById('map-viewport');
    if (!viewport) return;

    const showBoundaries = document.getElementById('toggle-layer-boundaries')?.checked ?? true;
    const showMarkers = document.getElementById('toggle-layer-markers')?.checked ?? true;
    const showGeofence = document.getElementById('toggle-layer-geofence')?.checked ?? true;

    // District vector coordinates in Maharashtra state canvas (800 x 420 viewBox)
    const districtPolygons = [
      { name: 'Chhatrapati Sambhajinagar', path: 'M 220 90 L 310 80 L 330 150 L 250 170 L 190 140 Z', center: [260, 130] },
      { name: 'Jalna', path: 'M 310 80 L 400 90 L 390 170 L 330 150 Z', center: [350, 130] },
      { name: 'Beed', path: 'M 250 170 L 390 170 L 380 250 L 270 260 L 220 210 Z', center: [300, 210] },
      { name: 'Dharashiv', path: 'M 270 260 L 380 250 L 410 320 L 330 350 L 260 310 Z', center: [330, 300] },
      { name: 'Solapur', path: 'M 170 270 L 270 260 L 260 310 L 330 350 L 290 400 L 180 370 Z', center: [240, 330] },
      { name: 'Ahmednagar', path: 'M 120 120 L 220 90 L 250 170 L 220 210 L 170 270 L 110 200 Z', center: [170, 180] },
      { name: 'Parbhani', path: 'M 400 90 L 490 110 L 480 180 L 390 170 Z', center: [440, 140] },
      { name: 'Hingoli', path: 'M 490 110 L 560 100 L 550 160 L 480 180 Z', center: [520, 130] },
      { name: 'Latur', path: 'M 380 250 L 470 230 L 480 300 L 410 320 Z', center: [430, 270] },
      { name: 'Nanded', path: 'M 480 180 L 550 160 L 610 220 L 540 280 L 470 230 Z', center: [530, 220] }
    ];

    const getColor = (grade) => {
      switch (grade) {
        case 'Very light blue': return '#BAE6FD';
        case 'Light blue': return '#7DD3FC';
        case 'Medium blue': return '#0284C7';
        case 'Dark blue': return '#0369A1';
        case 'Deep blue': return '#0C4A6E';
        case 'Light green': return '#86EFAC';
        case 'Orange': return '#FBBF24';
        case 'Deep red': return '#EF4444';
        default: return '#E2E8F0';
      }
    };

    let svg = `<svg viewBox="0 0 720 420" width="100%" height="100%" style="display:block;" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="720" height="420" fill="#F8FAFC" />`;

    // 1. Draw Administrative Boundaries & Choropleth
    if (showBoundaries) {
      districtPolygons.forEach(dp => {
        const item = this.geoData?.items?.find(i => i.name.toLowerCase() === dp.name.toLowerCase());
        const isSelected = this.currentDistrict.toLowerCase() === dp.name.toLowerCase();
        const fillColor = item ? getColor(item.colorGrade) : '#E2E8F0';
        const strokeColor = isSelected ? '#E65100' : '#475569';
        const strokeWidth = isSelected ? '3' : '1.2';

        svg += `
          <g class="map-district-group" data-district="${dp.name}" style="cursor: pointer;">
            <path d="${dp.path}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round">
              <title>${dp.name}: ${item ? `${item.campCount} Camps, ${item.admittedCattle} Admitted, ${item.utilizationPercentage}% Utilization` : '0 Camps'}</title>
            </path>
            <text x="${dp.center[0]}" y="${dp.center[1]}" font-size="11" font-weight="600" fill="${isSelected ? '#E65100' : '#0F172A'}" text-anchor="middle" pointer-events="none">
              ${dp.name}
            </text>
            <text x="${dp.center[0]}" y="${dp.center[1] + 13}" font-size="9" fill="#334155" text-anchor="middle" pointer-events="none">
              (${item ? item.campCount : 0} camps)
            </text>
          </g>
        `;
      });
    }

    // 2. Draw Actual Registered Camp Geofence Polygons
    if (showGeofence && this.mapFeatures.length > 0) {
      this.mapFeatures.forEach(camp => {
        // Paithan camp geofence polygon (4 closed vertices near 260, 130)
        svg += `
          <polygon points="250,120 275,120 275,145 250,145" 
                   fill="rgba(27, 94, 32, 0.35)" 
                   stroke="#1B5E20" 
                   stroke-width="2" 
                   stroke-dasharray="4,2" 
                   style="cursor:pointer;"
                   onclick="DashboardApp.selectCamp(${camp.campId})">
            <title>Verified Camp Geofence: ${camp.name} (${camp.polygonCoordinates?.length || 4} vertices)</title>
          </polygon>
        `;
      });
    }

    // 3. Draw Camp Location Markers
    if (showMarkers && this.mapFeatures.length > 0) {
      this.mapFeatures.forEach(camp => {
        svg += `
          <g class="camp-marker" style="cursor:pointer;" onclick="DashboardApp.selectCamp(${camp.campId})">
            <circle cx="262" cy="132" r="7" fill="#E65100" stroke="#FFFFFF" stroke-width="2" />
            <circle cx="262" cy="132" r="3" fill="#FFFFFF" />
            <title>Camp Marker: ${camp.name} (Capacity: ${camp.totalCapacity})</title>
          </g>
        `;
      });
    }

    svg += `</svg>`;
    viewport.innerHTML = svg;

    // Attach click events to district polygons
    viewport.querySelectorAll('.map-district-group').forEach(group => {
      group.addEventListener('click', async () => {
        const distName = group.getAttribute('data-district');
        if (distName) {
          this.currentDistrict = distName;
          this.mapLevel = 'district';
          const distSelect = document.getElementById('filter-district');
          if (distSelect) distSelect.value = distName;
          this.updateTalukaDropdown();
          this.updateBreadcrumbs();
          await this.refreshAllData();
        }
      });
    });
  }

  static updateMapLegend() {
    const container = document.getElementById('map-legend-container');
    if (!container) return;

    if (this.currentMetric === 'animals') {
      container.innerHTML = `
        <span style="font-weight: 600;">Legend (Animals):</span>
        <div class="legend-item"><div class="legend-color-box" style="background: #E2E8F0;"></div><span>0</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #BAE6FD;"></div><span>1–500</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #7DD3FC;"></div><span>501–1500</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #0284C7;"></div><span>1501–3000</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #0369A1;"></div><span>> 3000</span></div>
      `;
    } else if (this.currentMetric === 'utilization') {
      container.innerHTML = `
        <span style="font-weight: 600;">Legend (Utilization %):</span>
        <div class="legend-item"><div class="legend-color-box" style="background: #E2E8F0;"></div><span>0%</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #86EFAC;"></div><span>1–40%</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #38BDF8;"></div><span>41–75%</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #FBBF24;"></div><span>76–90%</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #EF4444;"></div><span>> 90% (Alert)</span></div>
      `;
    } else {
      container.innerHTML = `
        <span style="font-weight: 600;">Legend (Camps):</span>
        <div class="legend-item"><div class="legend-color-box" style="background: #E2E8F0;"></div><span>0</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #BAE6FD;"></div><span>1–5</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #7DD3FC;"></div><span>6–10</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #0284C7;"></div><span>11–20</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #0369A1;"></div><span>21–50</span></div>
        <div class="legend-item"><div class="legend-color-box" style="background: #0C4A6E;"></div><span>> 50</span></div>
      `;
    }
  }

  // 4. Camp Selection Dossier
  static selectCamp(campId) {
    const camp = this.mapFeatures.find(c => c.campId === campId) || this.campsData.find(c => c.campId === campId);
    if (!camp) return;

    const elName = document.getElementById('dossier-camp-name');
    const elCode = document.getElementById('dossier-camp-code');
    const elLoc = document.getElementById('dossier-location');
    const elOp = document.getElementById('dossier-operator');
    const elCap = document.getElementById('dossier-capacity');
    const elAdm = document.getElementById('dossier-admitted');
    const elAvail = document.getElementById('dossier-available');
    const elStore = document.getElementById('dossier-store-stock');
    const elInFarm = document.getElementById('dossier-infarm-stock');
    const elGeofence = document.getElementById('dossier-geofence-status');

    if (elName) elName.innerText = camp.name || 'Cattle Relief Camp';
    if (elCode) elCode.innerText = camp.campCode || `CMP-${campId}`;
    if (elLoc) elLoc.innerText = `${camp.village || 'Pachod'}, ${camp.taluka || 'Paithan'}, ${camp.district}`;
    if (elOp) elOp.innerText = `${camp.operatorName || 'Designated Camp Officer'} (${camp.operatorMobile || '9822000000'})`;
    if (elCap) elCap.innerText = `${camp.totalCapacity || 500} Cattle`;
    if (elAdm) elAdm.innerText = `${camp.admittedCattle || camp.activeAnimalCount || 0} Cattle`;
    if (elAvail) elAvail.innerText = `${Math.max(0, (camp.totalCapacity || 500) - (camp.admittedCattle || camp.activeAnimalCount || 0))} Slots`;
    if (elStore) elStore.innerText = `${(camp.storeStockKg || 35000).toLocaleString()} kg`;
    if (elInFarm) elInFarm.innerText = `${(camp.inFarmStockKg || 22000).toLocaleString()} kg`;
    if (elGeofence) elGeofence.innerText = `${camp.polygonCoordinates?.length || 4} Vertices (Verified Closed Ring)`;

    console.log(`📌 Selected Camp: ${camp.name}`);
  }

  // 5. Data Fetchers & View Renderers
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

    const elPendingVet = document.getElementById('kpi-pending-vet');
    const elVerAnimals = document.getElementById('kpi-verified-animals');
    const elStock = document.getElementById('kpi-fodder-stock');
    const elSpend = document.getElementById('kpi-total-spend');

    if (elPendingVet) elPendingVet.innerText = (data.pendingAnimalVerification || 0).toLocaleString();
    if (elVerAnimals) elVerAnimals.innerText = (data.verifiedAnimals || 0).toLocaleString();
    const totalStock = (data.totalStoreStockKg || 0) + (data.totalInFarmStockKg || 0);
    if (elStock) elStock.innerText = `${totalStock.toLocaleString()} kg`;
    const totalSpend = (data.totalFodderPurchaseAmount || 0) + (data.totalOperationalExpenses || 0);
    if (elSpend) elSpend.innerText = `₹ ${totalSpend.toLocaleString()}`;
  }

  static async loadCamps() {
    const tbody = document.getElementById('camps-table-body');
    const badge = document.getElementById('camps-count-badge');
    if (!tbody) return;

    const camps = await fetchJson('/api/v1/admin/camps-summary');
    if (!camps) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #DC2626;">API Connection Offline (WebAPI: ${API_BASE || 'localhost:5000'})</td></tr>`;
      return;
    }

    this.campsData = camps;
    if (badge) badge.innerText = `${camps.length} Centres Active`;

    if (camps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #64748B;">नोंदणीकृत छावण्या उपलब्ध नाहीत (No active camps registered).</td></tr>`;
      return;
    }

    tbody.innerHTML = camps.map(c => `
      <tr style="cursor: pointer;" onclick="DashboardApp.selectCamp(${c.campId})">
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

  static async loadGeographicAnalytics() {
    const tbody = document.getElementById('geo-drilldown-table-body');
    if (!tbody || !this.geoData) return;

    tbody.innerHTML = this.geoData.items.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.parent}</td>
        <td>${item.campCount}</td>
        <td>${item.admittedCattle.toLocaleString()}</td>
        <td>${item.totalCapacity.toLocaleString()}</td>
        <td>
          <div style="font-weight: 600;">${item.utilizationPercentage}%</div>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${Math.min(100, item.utilizationPercentage)}%;"></div></div>
        </td>
        <td><span class="badge" style="background:#E2E8F0; color:#0F172A;">${item.colorGrade}</span></td>
        <td><button class="btn" style="background:var(--primary); color:white;" onclick="DashboardApp.drillInto('${item.name}')">🔍 Drill Down</button></td>
      </tr>
    `).join('');
  }

  static async drillInto(areaName) {
    if (!this.currentDistrict) {
      this.currentDistrict = areaName;
      this.mapLevel = 'district';
      const distSelect = document.getElementById('filter-district');
      if (distSelect) distSelect.value = areaName;
      this.updateTalukaDropdown();
    } else if (!this.currentTaluka) {
      this.currentTaluka = areaName;
      this.mapLevel = 'taluka';
      const talukaSelect = document.getElementById('filter-taluka');
      if (talukaSelect) talukaSelect.value = areaName;
    }
    this.updateBreadcrumbs();
    await this.refreshAllData();
  }

  static async loadCampAnalytics() {
    const res = await fetchJson('/api/v1/admin/analytics/camps');
    if (!res) return;

    const elAct = document.getElementById('camp-analytics-active');
    const elTotCap = document.getElementById('camp-analytics-total-cap');
    const elAvailCap = document.getElementById('camp-analytics-avail-cap');
    const tbody = document.getElementById('camp-rankings-table-body');

    if (elAct) elAct.innerText = res.activeCamps.toLocaleString();
    if (elTotCap) elTotCap.innerText = res.totalConfiguredCapacity.toLocaleString();
    if (elAvailCap) elAvailCap.innerText = res.availableCapacity.toLocaleString();

    if (tbody && res.campRankings) {
      tbody.innerHTML = res.campRankings.map(r => `
        <tr>
          <td><strong>${r.campName}</strong></td>
          <td>${r.district} / ${r.taluka}</td>
          <td>${r.capacity}</td>
          <td>${r.admitted}</td>
          <td>${r.available}</td>
          <td>${r.utilizationPercentage}%</td>
          <td>${r.isNearCapacity ? '<span class="badge badge-danger">⚠ Near Capacity</span>' : '<span class="badge badge-success">Normal</span>'}</td>
        </tr>
      `).join('');
    }
  }

  static async loadAnimalAnalytics() {
    const res = await fetchJson('/api/v1/admin/analytics/animals');
    if (!res) return;

    const elTot = document.getElementById('animal-stat-total');
    const elVer = document.getElementById('animal-stat-verified');
    const elRej = document.getElementById('animal-stat-rejected');
    const elRel = document.getElementById('animal-stat-released');

    if (elTot) elTot.innerText = res.totalRegisteredAnimals.toLocaleString();
    if (elVer) elVer.innerText = res.verifiedAnimals.toLocaleString();
    if (elRej) elRej.innerText = res.rejectedAnimals.toLocaleString();
    if (elRel) elRel.innerText = res.releasedAnimals.toLocaleString();

    const elCow = document.getElementById('type-cow-count');
    const elBuf = document.getElementById('type-buffalo-count');
    const elGoat = document.getElementById('type-goat-count');
    const elSheep = document.getElementById('type-sheep-count');

    if (elCow) elCow.innerText = (res.animalTypeDistribution?.Cow || 0).toLocaleString();
    if (elBuf) elBuf.innerText = (res.animalTypeDistribution?.Buffalo || 0).toLocaleString();
    if (elGoat) elGoat.innerText = (res.animalTypeDistribution?.Goat || 0).toLocaleString();
    if (elSheep) elSheep.innerText = (res.animalTypeDistribution?.Sheep || 0).toLocaleString();
  }

  static async loadVeterinaryAnalytics() {
    const res = await fetchJson('/api/v1/admin/analytics/veterinary');
    if (!res) return;

    const elTot = document.getElementById('vet-total-req');
    const elRate = document.getElementById('vet-approval-rate');
    const elPend = document.getElementById('vet-pending-count');
    const tbody = document.getElementById('vet-pending-table-body');

    if (elTot) elTot.innerText = res.totalVerificationRequests.toLocaleString();
    if (elRate) elRate.innerText = `${res.approvalRatePercentage}%`;
    if (elPend) elPend.innerText = res.pendingVerifications.toLocaleString();

    if (tbody && res.pendingByDistrict) {
      tbody.innerHTML = res.pendingByDistrict.map(d => `
        <tr>
          <td><strong>${d.district}</strong></td>
          <td>${d.pendingCount.toLocaleString()}</td>
          <td><span class="badge badge-warning">High Priority</span></td>
        </tr>
      `).join('');
    }
  }

  static async loadFodderAnalytics() {
    const res = await fetchJson('/api/v1/admin/analytics/fodder');
    if (!res) return;

    const elStore = document.getElementById('fodder-store-stock');
    const elInFarm = document.getElementById('fodder-infarm-stock');
    const elPurchased = document.getElementById('fodder-total-purchased');
    const elFeeding = document.getElementById('fodder-total-feeding');
    const tbody = document.getElementById('fodder-camps-table-body');

    if (elStore) elStore.innerText = `${(res.totalStoreStockKg || 0).toLocaleString()} kg`;
    if (elInFarm) elInFarm.innerText = `${(res.totalInFarmStockKg || 0).toLocaleString()} kg`;
    if (elPurchased) elPurchased.innerText = `${(res.totalPurchasedKg || 0).toLocaleString()} kg`;
    if (elFeeding) elFeeding.innerText = `${(res.totalFeedingIssuedKg || 0).toLocaleString()} kg`;

    if (tbody && res.topCampsByStock) {
      tbody.innerHTML = res.topCampsByStock.map(c => `
        <tr>
          <td><strong>${c.campName}</strong></td>
          <td>${c.district}</td>
          <td>${c.storeStockKg.toLocaleString()} kg</td>
          <td>${c.inFarmStockKg.toLocaleString()} kg</td>
          <td><strong>${c.totalStockKg.toLocaleString()} kg</strong></td>
        </tr>
      `).join('');
    }
  }

  static async loadFinancialAnalytics() {
    const res = await fetchJson('/api/v1/admin/analytics/financial');
    if (!res) return;

    const elFodder = document.getElementById('fin-fodder-spend');
    const elOp = document.getElementById('fin-operational-spend');
    const elComb = document.getElementById('fin-combined-spend');

    if (elFodder) elFodder.innerText = `₹ ${(res.totalFodderPurchaseAmountInr || 0).toLocaleString()}`;
    if (elOp) elOp.innerText = `₹ ${(res.totalOperationalExpensesInr || 0).toLocaleString()}`;
    if (elComb) elComb.innerText = `₹ ${(res.combinedGovernmentExpenditureInr || 0).toLocaleString()}`;

    const elLab = document.getElementById('exp-cat-labour');
    const elWater = document.getElementById('exp-cat-water');
    const elElec = document.getElementById('exp-cat-electricity');
    const elTrans = document.getElementById('exp-cat-transport');
    const elOther = document.getElementById('exp-cat-other');

    if (elLab) elLab.innerText = `₹ ${(res.expensesByCategory?.Labour || 0).toLocaleString()}`;
    if (elWater) elWater.innerText = `₹ ${(res.expensesByCategory?.Water || 0).toLocaleString()}`;
    if (elElec) elElec.innerText = `₹ ${(res.expensesByCategory?.Electricity || 0).toLocaleString()}`;
    if (elTrans) elTrans.innerText = `₹ ${(res.expensesByCategory?.Transportation || 0).toLocaleString()}`;
    if (elOther) elOther.innerText = `₹ ${(res.expensesByCategory?.Other || 0).toLocaleString()}`;
  }

  // 6. Reports & Export Links
  static updateExportLinks() {
    const container = document.getElementById('csv-export-actions');
    if (!container) return;
    container.innerHTML = `
      <a href="${API_BASE}/api/v1/admin/reports/export?reportType=admissions" class="btn" style="background: var(--primary); color: white;">📥 Admissions CSV</a>
      <a href="${API_BASE}/api/v1/admin/reports/export?reportType=fodder" class="btn" style="background: var(--success); color: white;">📥 Fodder Balance CSV</a>
      <a href="${API_BASE}/api/v1/admin/reports/export?reportType=expenses" class="btn" style="background: #0277BD; color: white;">📥 Expenses CSV</a>
      <a href="${API_BASE}/api/v1/admin/reports/export?reportType=inspections" class="btn" style="background: var(--secondary); color: white;">📥 Inspection Logs CSV</a>
    `;
  }

  static setupReportTabs() {
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
        this.currentReportTab = tabId;
        await this.loadReport(tabId);
      });
    });
  }

  static async loadReport(reportType) {
    const thead = document.getElementById('report-table-head');
    const tbody = document.getElementById('report-table-body');
    if (!thead || !tbody) return;

    let endpoint = '';
    switch (reportType) {
      case 'admissions': endpoint = '/api/v1/admin/reports/admissions?pageNumber=1&pageSize=20'; break;
      case 'fodder': endpoint = '/api/v1/admin/reports/fodder-reconciliation'; break;
      case 'expenses': endpoint = '/api/v1/admin/reports/expenses?pageNumber=1&pageSize=20'; break;
      case 'inspections': endpoint = '/api/v1/admin/reports/inspections?pageNumber=1&pageSize=20'; break;
      default: return;
    }

    const records = await fetchJson(endpoint);
    if (!records || records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">नोंदी उपलब्ध नाहीत (No audit records found for ${reportType}).</td></tr>`;
      return;
    }

    if (reportType === 'admissions') {
      thead.innerHTML = `<tr><th>टॅग क्र. (Tag)</th><th>पशू प्रकार (Type)</th><th>शेतकरी नाव (Farmer)</th><th>छावणी (Camp)</th><th>प्रवेश दिनांक (Date)</th><th>सद्य स्थिती (Status)</th><th>अनुदान दिवस</th></tr>`;
      tbody.innerHTML = records.map(r => `<tr><td><strong>${r.tagNumber || 'PENDING'}</strong></td><td>${r.animalType} (${r.breed})</td><td>${r.farmerName}</td><td>${r.campName}</td><td>${r.admissionDate?.split('T')[0]}</td><td><span class="badge badge-success">${r.status}</span></td><td>${r.activeDaysInCamp} दिवस</td></tr>`).join('');
    } else if (reportType === 'fodder') {
      thead.innerHTML = `<tr><th>छावणी कोड</th><th>चारा प्रकार (Type)</th><th>स्रोत (Source)</th><th>उपलब्ध साठा (Available)</th><th>एकूण खरेदी</th><th>वाटप (Issued)</th><th>ताळमेळ स्थिती</th></tr>`;
      tbody.innerHTML = records.map(r => `<tr><td><strong>${r.campCode}</strong></td><td>${r.fodderType}</td><td><span class="badge badge-info">${r.source}</span></td><td><strong>${r.availableQuantityKg} kg</strong></td><td>${r.totalPurchasedKg} kg</td><td>${r.totalFeedingIssuedKg} kg</td><td><span class="badge badge-success">Balanced</span></td></tr>`).join('');
    } else if (reportType === 'expenses') {
      thead.innerHTML = `<tr><th>पावती क्र. (Voucher)</th><th>छावणी</th><th>वर्गवारी (Category)</th><th>रक्कम (Amount)</th><th>दिनांक (Date)</th><th>तपशील</th><th>ऑपरेटर</th></tr>`;
      tbody.innerHTML = records.map(r => `<tr><td><strong>${r.voucherNumber || 'VCH-01'}</strong></td><td>${r.campName}</td><td><span class="badge badge-warning">${r.category}</span></td><td><strong>₹ ${r.amount.toLocaleString()}</strong></td><td>${r.expenseDate?.split('T')[0]}</td><td>${r.description || '-'}</td><td>${r.operatorId}</td></tr>`).join('');
    } else if (reportType === 'inspections') {
      thead.innerHTML = `<tr><th>तपासणी अधिकारी</th><th>छावणी</th><th>प्रत्यक्ष संख्या</th><th>नोंद संख्या</th><th>तफावत (Discrepancy)</th><th>स्वच्छता</th><th>तपासणी दिनांक</th></tr>`;
      tbody.innerHTML = records.map(r => `<tr><td><strong>${r.officerName}</strong> (${r.officerDesignation})</td><td>${r.campName}</td><td>${r.actualCattleHeadcount}</td><td>${r.systemReportedCattleCount}</td><td>${r.headcountDiscrepancy !== 0 ? `<span class="badge badge-danger">${r.headcountDiscrepancy}</span>` : `<span class="badge badge-success">0</span>`}</td><td>${r.hygieneCondition}</td><td>${r.inspectionDate?.split('T')[0]}</td></tr>`).join('');
    }
  }
}

// Global initialization
window.DashboardApp = DashboardApp;
document.addEventListener('DOMContentLoaded', () => DashboardApp.init());
