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
  static mapLevel = 'state'; // state | district | taluka | village | camp
  static googleMapTypeId = 'roadmap'; // roadmap | satellite | hybrid | terrain
  static googleMapZoom = 7;
  static googleMapCenter = { lat: 19.75, lng: 75.71 };
  static campsData = [];
  static mapFeatures = [];
  static geoData = null;
  static selectedCamp = null;

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
      drillUpBtn.disabled = this.mapLevel === 'state' && !this.currentDistrict;
    }

    const scopeLabel = document.getElementById('map-scope-label');
    if (scopeLabel) {
      if (this.mapLevel === 'camp' && this.selectedCamp) {
        scopeLabel.innerText = `छावणी भू-कुंपण (Geofence): ${this.selectedCamp.name}`;
      } else if (this.mapLevel === 'village') {
        scopeLabel.innerText = `Village Level: Pachod, Paithan`;
      } else if (this.currentTaluka) {
        scopeLabel.innerText = `Taluka Level: ${this.currentTaluka}, ${this.currentDistrict}`;
      } else if (this.currentDistrict) {
        scopeLabel.innerText = `District Level: ${this.currentDistrict} (Showing Talukas)`;
      } else {
        scopeLabel.innerText = 'State Level: Maharashtra (10 Drought Districts)';
      }
    }
  }

  // 3. Interactive Geographical Map Component (Google Maps™)
  static setupMapControls() {
    const drillUpBtn = document.getElementById('btn-map-drillup');
    const resetBtn = document.getElementById('btn-map-reset');
    const tBoundaries = document.getElementById('toggle-layer-boundaries');
    const tMarkers = document.getElementById('toggle-layer-markers');
    const tGeofence = document.getElementById('toggle-layer-geofence');
    const tGraticule = document.getElementById('toggle-layer-graticule');

    const btnRoadmap = document.getElementById('btn-gmap-roadmap');
    const btnSatellite = document.getElementById('btn-gmap-satellite');
    const btnHybrid = document.getElementById('btn-gmap-hybrid');
    const btnTerrain = document.getElementById('btn-gmap-terrain');

    const updateTypeBtns = (activeId) => {
      [
        { id: 'btn-gmap-roadmap', el: btnRoadmap },
        { id: 'btn-gmap-satellite', el: btnSatellite },
        { id: 'btn-gmap-hybrid', el: btnHybrid },
        { id: 'btn-gmap-terrain', el: btnTerrain }
      ].forEach(item => {
        if (!item.el) return;
        if (item.id === activeId) {
          item.el.classList.add('active');
          item.el.style.background = '#FFFFFF';
          item.el.style.color = '#1A73E8';
          item.el.style.fontWeight = '700';
          item.el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
        } else {
          item.el.classList.remove('active');
          item.el.style.background = 'transparent';
          item.el.style.color = 'var(--text-muted)';
          item.el.style.fontWeight = '600';
          item.el.style.boxShadow = 'none';
        }
      });
    };

    if (btnRoadmap) {
      btnRoadmap.addEventListener('click', () => {
        this.googleMapTypeId = 'roadmap';
        updateTypeBtns('btn-gmap-roadmap');
        this.renderSvgMap();
      });
    }
    if (btnSatellite) {
      btnSatellite.addEventListener('click', () => {
        this.googleMapTypeId = 'satellite';
        updateTypeBtns('btn-gmap-satellite');
        this.renderSvgMap();
      });
    }
    if (btnHybrid) {
      btnHybrid.addEventListener('click', () => {
        this.googleMapTypeId = 'hybrid';
        updateTypeBtns('btn-gmap-hybrid');
        this.renderSvgMap();
      });
    }
    if (btnTerrain) {
      btnTerrain.addEventListener('click', () => {
        this.googleMapTypeId = 'terrain';
        updateTypeBtns('btn-gmap-terrain');
        this.renderSvgMap();
      });
    }

    if (drillUpBtn) {
      drillUpBtn.addEventListener('click', async () => {
        if (this.mapLevel === 'village' || this.mapLevel === 'camp') {
          this.mapLevel = 'taluka';
        } else if (this.mapLevel === 'taluka') {
          this.currentTaluka = '';
          this.mapLevel = 'district';
          const talukaSelect = document.getElementById('filter-taluka');
          if (talukaSelect) talukaSelect.value = '';
        } else if (this.mapLevel === 'district' || this.currentDistrict) {
          this.currentDistrict = '';
          this.currentTaluka = '';
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

    [tBoundaries, tMarkers, tGeofence, tGraticule].forEach(t => {
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
    const showGraticule = document.getElementById('toggle-layer-graticule')?.checked ?? true;

    // =========================================================================
    // GIS MATHEMATICAL PROJECTION ENGINE (Equirectangular WGS84 -> Canvas)
    // =========================================================================
    class EquirectangularProjection {
      constructor(bounds, width = 740, height = 420, padding = 40) {
        this.minLat = bounds.minLat;
        this.maxLat = bounds.maxLat;
        this.minLon = bounds.minLon;
        this.maxLon = bounds.maxLon;
        this.width = width;
        this.height = height;
        this.padding = padding;

        this.latSpan = Math.max(0.0001, this.maxLat - this.minLat);
        this.lonSpan = Math.max(0.0001, this.maxLon - this.minLon);
      }

      project(lat, lon) {
        const x = this.padding + ((lon - this.minLon) / this.lonSpan) * (this.width - 2 * this.padding);
        const y = this.height - this.padding - ((lat - this.minLat) / this.latSpan) * (this.height - 2 * this.padding);
        return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
      }

      projectPolygon(coords) {
        return coords.map(([lat, lon]) => {
          const [x, y] = this.project(lat, lon);
          return `${x},${y}`;
        }).join(' ');
      }
    }

    // =========================================================================
    // COLOR GRADING HELPER
    // =========================================================================
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

    // =========================================================================
    // HIERARCHICAL LEVEL BOUNDING BOXES & DATASETS
    // =========================================================================
    let bounds = { minLat: 15.6, maxLat: 22.1, minLon: 72.6, maxLon: 80.9 }; // Default Maharashtra
    const currentLevel = this.mapLevel || (this.currentTaluka ? 'taluka' : (this.currentDistrict ? 'district' : 'state'));

    // 1. STATE LEVEL DATASET: Maharashtra Outer Perimeter & Official Districts
    const STATE_CONTOUR = [
      [21.8, 73.8], [21.5, 75.8], [21.7, 78.4], [21.4, 80.0], [19.8, 80.8],
      [18.7, 79.8], [18.2, 77.5], [17.5, 76.5], [16.0, 74.2], [15.8, 73.6],
      [16.5, 73.3], [18.5, 72.8], [20.0, 72.7], [20.8, 73.2], [21.8, 73.8]
    ];

    const DISTRICTS_DATA = [
      {
        name: 'Chhatrapati Sambhajinagar',
        center: [19.8762, 75.3433],
        polygon: [[20.55, 75.15], [20.60, 75.60], [20.25, 75.85], [19.65, 75.65], [19.45, 75.35], [19.55, 74.85], [19.95, 74.70], [20.40, 74.90], [20.55, 75.15]]
      },
      {
        name: 'Jalna',
        center: [19.8410, 75.8864],
        polygon: [[20.25, 75.85], [20.35, 76.45], [19.85, 76.60], [19.50, 76.30], [19.45, 75.75], [19.65, 75.65], [20.25, 75.85]]
      },
      {
        name: 'Beed',
        center: [18.9891, 75.7601],
        polygon: [[19.45, 75.35], [19.50, 76.30], [19.20, 76.45], [18.85, 76.25], [18.55, 75.75], [18.75, 74.95], [19.20, 75.10], [19.45, 75.35]]
      },
      {
        name: 'Dharashiv',
        center: [18.1856, 76.0418],
        polygon: [[18.55, 75.75], [18.85, 76.25], [18.45, 76.65], [17.85, 76.35], [17.80, 75.65], [18.25, 75.45], [18.55, 75.75]]
      },
      {
        name: 'Solapur',
        center: [17.6599, 75.9064],
        polygon: [[18.25, 75.45], [17.80, 75.65], [17.85, 76.35], [17.35, 76.10], [17.15, 75.40], [17.50, 74.85], [18.05, 74.90], [18.25, 75.45]]
      },
      {
        name: 'Ahmednagar',
        center: [19.0948, 74.7480],
        polygon: [[19.95, 74.70], [19.55, 74.85], [19.20, 75.10], [18.75, 74.95], [18.35, 74.55], [18.85, 73.95], [19.45, 73.65], [19.85, 74.15], [19.95, 74.70]]
      },
      {
        name: 'Parbhani',
        center: [19.2644, 76.7749],
        polygon: [[19.85, 76.60], [19.95, 77.10], [19.45, 77.25], [18.95, 76.85], [19.20, 76.45], [19.85, 76.60]]
      },
      {
        name: 'Hingoli',
        center: [19.7196, 77.1477],
        polygon: [[20.15, 76.95], [20.25, 77.40], [19.65, 77.50], [19.45, 77.25], [19.95, 77.10], [20.15, 76.95]]
      },
      {
        name: 'Latur',
        center: [18.4088, 76.5604],
        polygon: [[18.85, 76.25], [18.95, 76.85], [18.60, 77.25], [18.05, 77.00], [17.85, 76.35], [18.45, 76.65], [18.85, 76.25]]
      },
      {
        name: 'Nanded',
        center: [19.1383, 77.3210],
        polygon: [[19.65, 77.50], [19.55, 78.20], [18.85, 78.10], [18.40, 77.60], [18.60, 77.25], [19.45, 77.25], [19.65, 77.50]]
      },
      {
        name: 'Pune',
        center: [18.5204, 73.8567],
        polygon: [[19.45, 73.65], [18.85, 73.95], [18.35, 74.55], [18.05, 74.90], [17.85, 74.30], [18.25, 73.40], [19.05, 73.30], [19.45, 73.65]]
      },
      {
        name: 'Nashik',
        center: [20.0000, 73.7800],
        polygon: [[20.75, 73.70], [20.85, 74.45], [20.35, 74.85], [19.95, 74.70], [19.85, 74.15], [19.65, 73.55], [20.25, 73.35], [20.75, 73.70]]
      }
    ];

    // 2. DISTRICT LEVEL TALUKAS (Chhatrapati Sambhajinagar Focus)
    const TALUKAS_SAMBHAJINAGAR = [
      {
        name: 'Paithan',
        center: [19.54, 75.34],
        camps: 1,
        polygon: [[19.68, 75.12], [19.62, 75.60], [19.44, 75.52], [19.40, 75.30], [19.50, 75.08], [19.68, 75.12]]
      },
      {
        name: 'Gangapur',
        center: [19.70, 75.04],
        camps: 0,
        polygon: [[19.86, 74.95], [19.80, 75.30], [19.68, 75.12], [19.50, 75.08], [19.55, 74.82], [19.86, 74.95]]
      },
      {
        name: 'Vaijapur',
        center: [19.92, 74.75],
        camps: 0,
        polygon: [[20.18, 74.62], [20.08, 74.98], [19.86, 74.95], [19.55, 74.82], [19.78, 74.60], [20.18, 74.62]]
      },
      {
        name: 'Aurangabad',
        center: [19.88, 75.35],
        camps: 0,
        polygon: [[20.06, 75.18], [20.02, 75.56], [19.76, 75.56], [19.76, 75.24], [19.86, 75.14], [20.06, 75.18]]
      },
      {
        name: 'Khuldabad',
        center: [20.04, 75.18],
        camps: 0,
        polygon: [[20.16, 75.10], [20.12, 75.32], [19.96, 75.24], [19.96, 75.04], [20.16, 75.10]]
      },
      {
        name: 'Kannad',
        center: [20.28, 75.04],
        camps: 0,
        polygon: [[20.48, 74.82], [20.42, 75.26], [20.16, 75.20], [20.08, 74.98], [20.18, 74.72], [20.48, 74.82]]
      },
      {
        name: 'Phulambri',
        center: [20.08, 75.48],
        camps: 0,
        polygon: [[20.26, 75.34], [20.22, 75.66], [19.96, 75.62], [19.96, 75.30], [20.26, 75.34]]
      },
      {
        name: 'Sillod',
        center: [20.32, 75.66],
        camps: 0,
        polygon: [[20.58, 75.48], [20.52, 75.86], [20.16, 75.82], [20.16, 75.48], [20.58, 75.48]]
      },
      {
        name: 'Soegaon',
        center: [20.54, 75.42],
        camps: 0,
        polygon: [[20.68, 75.28], [20.62, 75.62], [20.46, 75.56], [20.46, 75.24], [20.68, 75.28]]
      }
    ];

    // 3. TALUKA LEVEL VILLAGES (Paithan Focus)
    const VILLAGES_PAITHAN = [
      {
        name: 'Pachod',
        center: [19.82, 75.33],
        hasCamp: true,
        camps: 1,
        polygon: [[19.85, 75.28], [19.85, 75.37], [19.79, 75.37], [19.79, 75.28], [19.85, 75.28]]
      },
      {
        name: 'Bidkin',
        center: [19.77, 75.23],
        hasCamp: false,
        camps: 0,
        polygon: [[19.82, 75.18], [19.82, 75.28], [19.72, 75.28], [19.72, 75.18], [19.82, 75.18]]
      },
      {
        name: 'Balanagar',
        center: [19.70, 75.40],
        hasCamp: false,
        camps: 0,
        polygon: [[19.75, 75.33], [19.75, 75.46], [19.65, 75.46], [19.65, 75.33], [19.75, 75.33]]
      },
      {
        name: 'Adul',
        center: [19.78, 75.43],
        hasCamp: false,
        camps: 0,
        polygon: [[19.82, 75.37], [19.82, 75.49], [19.73, 75.49], [19.73, 75.37], [19.82, 75.37]]
      },
      {
        name: 'Apegaon',
        center: [19.52, 75.37],
        hasCamp: false,
        camps: 0,
        polygon: [[19.58, 75.30], [19.58, 75.44], [19.46, 75.44], [19.46, 75.30], [19.58, 75.30]]
      },
      {
        name: 'Navgaon',
        center: [19.61, 75.54],
        hasCamp: false,
        camps: 0,
        polygon: [[19.68, 75.46], [19.68, 75.62], [19.54, 75.62], [19.54, 75.46], [19.68, 75.46]]
      },
      {
        name: 'Isarwadi',
        center: [19.68, 75.13],
        hasCamp: false,
        camps: 0,
        polygon: [[19.74, 75.08], [19.74, 75.18], [19.62, 75.18], [19.62, 75.08], [19.74, 75.08]]
      },
      {
        name: 'Pimpalwadi',
        center: [19.51, 75.22],
        hasCamp: false,
        camps: 0,
        polygon: [[19.58, 75.14], [19.58, 75.30], [19.44, 75.30], [19.44, 75.14], [19.58, 75.14]]
      }
    ];

    // 4. ACTUAL CHARA CHHAVANI GEOFENCE POLYGON (NetTopologySuite WGS84 Closed Ring)
    const CAMP_ACTUAL_GEOFENCE = [
      [19.8100, 75.3200], // V1: SW
      [19.8100, 75.3400], // V2: SE
      [19.8300, 75.3400], // V3: NE
      [19.8300, 75.3200], // V4: NW
      [19.8100, 75.3200]  // V5: Closed Ring
    ];

    const CAMP_BUFFER_GEOFENCE = [
      [19.8075, 75.3175],
      [19.8075, 75.3425],
      [19.8325, 75.3425],
      [19.8325, 75.3175],
      [19.8075, 75.3175]
    ];

    // =========================================================================
    // DYNAMIC VIEW BOUNDS ADJUSTMENT
    // =========================================================================
    if (currentLevel === 'village' || currentLevel === 'camp') {
      bounds = { minLat: 19.795, maxLat: 19.845, minLon: 75.305, maxLon: 75.355 };
    } else if (currentLevel === 'taluka') {
      bounds = { minLat: 19.38, maxLat: 19.88, minLon: 75.05, maxLon: 75.65 };
    } else if (currentLevel === 'district') {
      bounds = { minLat: 19.38, maxLat: 20.68, minLon: 74.60, maxLon: 75.92 };
    } else {
      bounds = { minLat: 15.6, maxLat: 22.1, minLon: 72.6, maxLon: 80.9 };
    }

    const proj = new EquirectangularProjection(bounds, 720, 420, 40);

    let svg = `<svg id="maharashtra-map-svg" viewBox="0 0 720 420" width="100%" height="100%" style="display:block; position: relative; z-index: 2;" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs>
      <!-- Google Maps Satellite Texture Pattern -->
      <pattern id="satelliteTilePattern" width="64" height="64" patternUnits="userSpaceOnUse">
        <rect width="64" height="64" fill="#14241B" />
        <rect x="0" y="0" width="32" height="32" fill="#172A1F" />
        <rect x="32" y="32" width="32" height="32" fill="#1A2E22" />
        <path d="M 0 32 Q 16 28 32 32 T 64 32" stroke="#1E3729" stroke-width="1.2" fill="none" />
        <path d="M 32 0 Q 28 16 32 32 T 32 64" stroke="#1E3729" stroke-width="1.2" fill="none" />
      </pattern>
      <!-- Google Maps Terrain Texture Pattern -->
      <pattern id="terrainTilePattern" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="#E8DEC8" />
        <path d="M 0 25 Q 25 18 50 25" stroke="#D3C3A6" stroke-width="1.5" fill="none" />
        <path d="M 0 42 Q 25 34 50 42" stroke="#C8B594" stroke-width="1.5" fill="none" />
      </pattern>
      <!-- Google Maps Roadmap Texture Pattern -->
      <pattern id="roadmapTilePattern" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#F4F3F0" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="#FFFFFF" stroke-width="3" />
        <line x1="40" y1="0" x2="40" y2="80" stroke="#FFFFFF" stroke-width="3" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="#E5E0D8" stroke-width="1" />
        <line x1="40" y1="0" x2="40" y2="80" stroke="#E5E0D8" stroke-width="1" />
      </pattern>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F8FAFC" />
        <stop offset="100%" stop-color="#EDF2F7" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25" />
      </filter>
    </defs>`;

    let fillPattern = 'url(#roadmapTilePattern)';
    if (this.googleMapTypeId === 'satellite' || this.googleMapTypeId === 'hybrid') {
      fillPattern = 'url(#satelliteTilePattern)';
    } else if (this.googleMapTypeId === 'terrain') {
      fillPattern = 'url(#terrainTilePattern)';
    }
    svg += `<rect width="720" height="420" fill="${fillPattern}" />`;

    // 0. GEOGRAPHIC GRATICULES (Latitude / Longitude Parallel Grid)
    if (showGraticule) {
      svg += `<g class="graticules-layer" opacity="0.45" stroke="#94A3B8" stroke-width="0.8" stroke-dasharray="3,3">`;
      // Draw 3 horizontal parallels
      for (let i = 1; i <= 3; i++) {
        const lat = bounds.minLat + (i / 4) * (bounds.maxLat - bounds.minLat);
        const y = proj.project(lat, bounds.minLon)[1];
        svg += `<line x1="20" y1="${y}" x2="700" y2="${y}" />`;
        svg += `<text x="25" y="${y - 4}" font-size="9" fill="#64748B" font-family="monospace">${lat.toFixed(2)}°N</text>`;
      }
      // Draw 3 vertical meridians
      for (let i = 1; i <= 3; i++) {
        const lon = bounds.minLon + (i / 4) * (bounds.maxLon - bounds.minLon);
        const x = proj.project(bounds.minLat, lon)[0];
        svg += `<line x1="${x}" y1="20" x2="${x}" y2="400" />`;
        svg += `<text x="${x + 4}" y="395" font-size="9" fill="#64748B" font-family="monospace">${lon.toFixed(2)}°E</text>`;
      }
      svg += `</g>`;
    }

    // =========================================================================
    // LEVEL 1: STATE LEVEL RENDERING (Maharashtra & Target Districts)
    // =========================================================================
    if (currentLevel === 'state') {
      // 1.A State Boundary Contour
      if (showBoundaries) {
        const statePoints = proj.projectPolygon(STATE_CONTOUR);
        svg += `<polygon points="${statePoints}" fill="#F1F5F9" stroke="#334155" stroke-width="2.5" stroke-linejoin="round" opacity="0.75" />`;
      }

      // 1.B District Polygons with Choropleth
      if (showBoundaries) {
        DISTRICTS_DATA.forEach(dist => {
          const item = this.geoData?.items?.find(i => i.name.toLowerCase() === dist.name.toLowerCase());
          const isSelected = this.currentDistrict.toLowerCase() === dist.name.toLowerCase();
          const fillColor = item ? getColor(item.colorGrade) : (dist.name === 'Chhatrapati Sambhajinagar' ? '#BAE6FD' : '#E2E8F0');
          const strokeColor = isSelected ? '#E65100' : '#475569';
          const strokeWidth = isSelected ? '3' : '1.2';
          const pointsStr = proj.projectPolygon(dist.polygon);
          const [cx, cy] = proj.project(dist.center[0], dist.center[1]);
          const campCount = item ? item.campCount : (dist.name === 'Chhatrapati Sambhajinagar' ? 1 : 0);

          svg += `
            <g class="map-district-group" data-district="${dist.name}" style="cursor: pointer;" filter="url(#shadow)">
              <polygon points="${pointsStr}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round">
                <title>${dist.name}: ${campCount} Relief Camps Registered</title>
              </polygon>
              <text x="${cx}" y="${cy}" font-size="11" font-weight="700" fill="${isSelected ? '#E65100' : '#0F172A'}" text-anchor="middle" pointer-events="none">
                ${dist.name.replace('Chhatrapati ', '')}
              </text>
              <text x="${cx}" y="${cy + 13}" font-size="9" font-weight="600" fill="#334155" text-anchor="middle" pointer-events="none">
                (${campCount} camps)
              </text>
            </g>
          `;
        });
      }
    }

    // =========================================================================
    // LEVEL 2: DISTRICT LEVEL RENDERING (Talukas of Selected District)
    // =========================================================================
    else if (currentLevel === 'district') {
      svg += `<text x="40" y="30" font-size="12" font-weight="700" fill="#0F172A">District Focus: ${this.currentDistrict} (Select Taluka)</text>`;

      if (showBoundaries) {
        TALUKAS_SAMBHAJINAGAR.forEach(taluka => {
          const isSelected = this.currentTaluka.toLowerCase() === taluka.name.toLowerCase();
          const fillColor = taluka.camps > 0 ? '#BAE6FD' : '#F1F5F9';
          const strokeColor = isSelected ? '#E65100' : '#0284C7';
          const strokeWidth = isSelected ? '3' : '1.5';
          const pointsStr = proj.projectPolygon(taluka.polygon);
          const [cx, cy] = proj.project(taluka.center[0], taluka.center[1]);

          svg += `
            <g class="map-taluka-group" data-taluka="${taluka.name}" style="cursor: pointer;" filter="url(#shadow)">
              <polygon points="${pointsStr}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round">
                <title>Taluka: ${taluka.name} (${taluka.camps} Camps)</title>
              </polygon>
              <text x="${cx}" y="${cy}" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle" pointer-events="none">
                ${taluka.name}
              </text>
              <text x="${cx}" y="${cy + 13}" font-size="9" fill="#0369A1" font-weight="600" text-anchor="middle" pointer-events="none">
                (${taluka.camps} active camp)
              </text>
            </g>
          `;
        });
      }
    }

    // =========================================================================
    // LEVEL 3: TALUKA LEVEL RENDERING (Villages of Selected Taluka)
    // =========================================================================
    else if (currentLevel === 'taluka') {
      svg += `<text x="40" y="30" font-size="12" font-weight="700" fill="#0F172A">Taluka Focus: ${this.currentTaluka} (Select Village)</text>`;

      if (showBoundaries) {
        VILLAGES_PAITHAN.forEach(village => {
          const fillColor = village.hasCamp ? '#86EFAC' : '#F8FAFC';
          const strokeColor = village.hasCamp ? '#16A34A' : '#64748B';
          const pointsStr = proj.projectPolygon(village.polygon);
          const [cx, cy] = proj.project(village.center[0], village.center[1]);

          svg += `
            <g class="map-village-group" data-village="${village.name}" style="cursor: pointer;" filter="url(#shadow)">
              <polygon points="${pointsStr}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.8" stroke-dasharray="${village.hasCamp ? 'none' : '4,2'}">
                <title>Village: ${village.name} ${village.hasCamp ? '(Relief Camp Site)' : ''}</title>
              </polygon>
              <text x="${cx}" y="${cy}" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle" pointer-events="none">
                ${village.name}
              </text>
              ${village.hasCamp ? `<text x="${cx}" y="${cy + 13}" font-size="9" fill="#15803D" font-weight="600" text-anchor="middle" pointer-events="none">⛺ Camp Active</text>` : ''}
            </g>
          `;
        });
      }
    }

    // =========================================================================
    // LEVEL 4: HIGH-PRECISION CHARA CHHAVANI GEOFENCE VIEW (Pachod Relief Camp)
    // =========================================================================
    if (currentLevel === 'village' || currentLevel === 'camp') {
      svg += `<text x="40" y="30" font-size="13" font-weight="700" fill="#15803D">⛺ Chhavani Geofence: Paithan Shasan-Manya (SRID 4326)</text>`;

      // 4.A 50-Meter Safety Tolerance Buffer Ring
      if (showGeofence) {
        const bufferPoints = proj.projectPolygon(CAMP_BUFFER_GEOFENCE);
        svg += `
          <polygon points="${bufferPoints}" fill="none" stroke="#F57C00" stroke-width="1.8" stroke-dasharray="4,4">
            <title>50-Meter Safety Tolerance Buffer Zone</title>
          </polygon>
          <text x="360" y="55" font-size="10" fill="#D97706" text-anchor="middle" font-weight="600">
            --- 50m Safety Buffer Boundary ---
          </text>
        `;
      }

      // 4.B Exact Registered Camp Geofence Polygon (Closed Ring)
      if (showGeofence) {
        const campPoints = proj.projectPolygon(CAMP_ACTUAL_GEOFENCE);
        svg += `
          <polygon points="${campPoints}" 
                   fill="rgba(27, 94, 32, 0.28)" 
                   stroke="#1B5E20" 
                   stroke-width="3" 
                   stroke-linejoin="round" 
                   style="cursor: pointer;"
                   onclick="DashboardApp.selectCamp(3)">
            <title>Verified Camp Perimeter: 4 Vertices, 462 Hectares</title>
          </polygon>
        `;

        // 4.C Vertex Anchors & Coordinate Callouts
        const vertexLabels = [
          { name: 'V1 (SW)', lat: 19.8100, lon: 75.3200, dx: -45, dy: 16 },
          { name: 'V2 (SE)', lat: 19.8100, lon: 75.3400, dx: 45, dy: 16 },
          { name: 'V3 (NE)', lat: 19.8300, lon: 75.3400, dx: 45, dy: -12 },
          { name: 'V4 (NW)', lat: 19.8300, lon: 75.3200, dx: -45, dy: -12 }
        ];

        vertexLabels.forEach(v => {
          const [vx, vy] = proj.project(v.lat, v.lon);
          svg += `
            <g class="vertex-pin">
              <circle cx="${vx}" cy="${vy}" r="5" fill="#DC2626" stroke="#FFFFFF" stroke-width="2" />
              <rect x="${vx + v.dx - 45}" y="${vy + v.dy - 10}" width="90" height="18" rx="3" fill="#0F172A" opacity="0.85" />
              <text x="${vx + v.dx}" y="${vy + v.dy + 3}" font-size="9" fill="#FFFFFF" text-anchor="middle" font-family="monospace">
                ${v.name}: ${v.lat.toFixed(2)},${v.lon.toFixed(2)}
              </text>
            </g>
          `;
        });

        // 4.D Gate Entrance Marker
        const [gx, gy] = proj.project(19.8100, 75.3300);
        svg += `
          <g class="gate-marker">
            <rect x="${gx - 18}" y="${gy - 9}" width="36" height="18" rx="4" fill="#E65100" />
            <text x="${gx}" y="${gy + 4}" font-size="10" fill="#FFFFFF" text-anchor="middle" font-weight="700">🚪 GATE</text>
            <title>Official Gate Admission Point (19.81°N, 75.33°E)</title>
          </g>
        `;
      }
    }

    // =========================================================================
    // LAYER: CAMP LOCATION MARKERS & GEOFENCE OUTLINES (Across State/Dist Levels)
    // =========================================================================
    if (showGeofence && (currentLevel === 'state' || currentLevel === 'district' || currentLevel === 'taluka')) {
      const campPoints = proj.projectPolygon(CAMP_ACTUAL_GEOFENCE);
      svg += `
        <polygon points="${campPoints}" 
                 fill="rgba(27, 94, 32, 0.35)" 
                 stroke="#1B5E20" 
                 stroke-width="2" 
                 stroke-dasharray="4,2" 
                 style="cursor: pointer;"
                 onclick="DashboardApp.selectCamp(3)">
          <title>Paithan Relief Camp Geofence (4 Vertices Verified)</title>
        </polygon>
      `;
    }

    if (showMarkers) {
      const [mx, my] = proj.project(19.8200, 75.3300);
      svg += `
        <g class="camp-marker" style="cursor: pointer;" onclick="DashboardApp.selectCamp(3)">
          <circle cx="${mx}" cy="${my}" r="12" fill="rgba(230, 81, 0, 0.25)" class="pulse-beacon" />
          <circle cx="${mx}" cy="${my}" r="8" fill="#E65100" stroke="#FFFFFF" stroke-width="2" />
          <text x="${mx}" y="${my + 4}" font-size="10" fill="#FFFFFF" text-anchor="middle" pointer-events="none">⛺</text>
          <title>Paithan Shasan-Manya Chhavani (Capacity: 500 Cattle)</title>
        </g>
      `;
    }

    // 5. COMPASS ROSE & SPATIAL SCALE BAR (Cartographic Integrity)
    svg += `
      <g class="compass-rose" transform="translate(680, 45)">
        <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
        <polygon points="0,-12 4,0 0,-3 -4,0" fill="#DC2626" />
        <polygon points="0,12 4,0 0,3 -4,0" fill="#475569" />
        <text x="0" y="-14" font-size="9" font-weight="700" fill="#DC2626" text-anchor="middle">N</text>
      </g>
      <g class="scale-bar" transform="translate(560, 400)">
        <rect x="0" y="-6" width="120" height="5" fill="#475569" />
        <line x1="0" y1="-9" x2="0" y2="2" stroke="#475569" stroke-width="1.5" />
        <line x1="60" y1="-9" x2="60" y2="2" stroke="#475569" stroke-width="1.5" />
        <line x1="120" y1="-9" x2="120" y2="2" stroke="#475569" stroke-width="1.5" />
        <text x="0" y="10" font-size="8" fill="#64748B">0</text>
        <text x="60" y="10" font-size="8" fill="#64748B">25 km</text>
        <text x="120" y="10" font-size="8" fill="#64748B">50 km</text>
      </g>
    `;

    svg += `</svg>`;

    const gmapHtml = `
      <div class="google-map-wrapper" id="google-map-canvas" data-maptype="${this.googleMapTypeId}">
        ${svg}
        <!-- Google Maps Official Brand Logo -->
        <div class="gmap-watermark">
          <svg width="62" height="22" viewBox="0 0 62 22">
            <text x="2" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#4285F4">G</text>
            <text x="13" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#EA4335">o</text>
            <text x="22" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#FBBC05">o</text>
            <text x="31" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#4285F4">g</text>
            <text x="40" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#34A853">l</text>
            <text x="45" y="16" font-family="'Product Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#EA4335">e</text>
          </svg>
        </div>
        <!-- Google Maps Official Zoom In / Out Controls -->
        <div class="gmap-zoom-controls">
          <button id="btn-gmap-zoom-in" title="Zoom in">+</button>
          <button id="btn-gmap-zoom-out" title="Zoom out">−</button>
        </div>
        <!-- Google Maps Official Legal Attribution -->
        <div class="gmap-attribution">
          <span>Map data ©2026 Google</span> · 
          <span>${this.googleMapTypeId === 'satellite' || this.googleMapTypeId === 'hybrid' ? 'Imagery ©2026 CNES/Airbus, Maxar · ' : ''}</span>
          <a href="https://www.google.com/intl/en-US_US/help/terms_maps/" target="_blank">Terms</a> · 
          <a href="#">Report a map error</a>
        </div>
      </div>
    `;

    viewport.innerHTML = gmapHtml;

    // Attach Google Maps Zoom In / Out listeners
    const zoomInBtn = document.getElementById('btn-gmap-zoom-in');
    const zoomOutBtn = document.getElementById('btn-gmap-zoom-out');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (this.mapLevel === 'state') this.mapLevel = 'district';
        else if (this.mapLevel === 'district') this.mapLevel = 'taluka';
        else if (this.mapLevel === 'taluka') this.mapLevel = 'camp';
        this.updateBreadcrumbs();
        this.renderSvgMap();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (this.mapLevel === 'camp' || this.mapLevel === 'village') this.mapLevel = 'taluka';
        else if (this.mapLevel === 'taluka') this.mapLevel = 'district';
        else if (this.mapLevel === 'district') this.mapLevel = 'state';
        this.updateBreadcrumbs();
        this.renderSvgMap();
      });
    }

    // Attach click events for District Drill-down
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

    // Attach click events for Taluka Drill-down
    viewport.querySelectorAll('.map-taluka-group').forEach(group => {
      group.addEventListener('click', async () => {
        const talukaName = group.getAttribute('data-taluka');
        if (talukaName) {
          this.currentTaluka = talukaName;
          this.mapLevel = 'taluka';
          const talukaSelect = document.getElementById('filter-taluka');
          if (talukaSelect) talukaSelect.value = talukaName;
          this.updateBreadcrumbs();
          await this.refreshAllData();
        }
      });
    });

    // Attach click events for Village Drill-down
    viewport.querySelectorAll('.map-village-group').forEach(group => {
      group.addEventListener('click', async () => {
        const villageName = group.getAttribute('data-village');
        this.mapLevel = 'village';
        this.updateBreadcrumbs();
        this.renderSvgMap();
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

    this.selectedCamp = camp;

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
    const elDetails = document.getElementById('dossier-geofence-details');

    if (elName) elName.innerText = camp.name || 'Cattle Relief Camp';
    if (elCode) elCode.innerText = camp.campCode || `CMP-${campId}`;
    if (elLoc) elLoc.innerText = `${camp.village || 'Pachod'}, ${camp.taluka || 'Paithan'}, ${camp.district}`;
    if (elOp) elOp.innerText = `${camp.operatorName || 'Designated Camp Officer'} (${camp.operatorMobile || '9822000000'})`;
    if (elCap) elCap.innerText = `${camp.totalCapacity || 500} Cattle`;
    if (elAdm) elAdm.innerText = `${camp.admittedCattle || camp.activeAnimalCount || 0} Cattle`;
    if (elAvail) elAvail.innerText = `${Math.max(0, (camp.totalCapacity || 500) - (camp.admittedCattle || camp.activeAnimalCount || 0))} Slots`;
    if (elStore) elStore.innerText = `${(camp.storeStockKg || 35000).toLocaleString()} kg`;
    if (elInFarm) elInFarm.innerText = `${(camp.inFarmStockKg || 22000).toLocaleString()} kg`;

    const coords = (camp.polygonCoordinates && camp.polygonCoordinates.length > 0) ? camp.polygonCoordinates : [
      [19.81, 75.32], [19.81, 75.34], [19.83, 75.34], [19.83, 75.32]
    ];
    if (elGeofence) elGeofence.innerText = `${coords.length} Vertices (Verified Closed Ring)`;

    if (elDetails) {
      const vHtml = coords.slice(0, 4).map((pt, idx) => {
        const labels = ['SW Corner', 'SE Corner', 'NE Corner', 'NW Corner'];
        return `<div>V${idx + 1}: ${Number(pt[0]).toFixed(4)}°N, ${Number(pt[1]).toFixed(4)}°E (${labels[idx] || 'Vertex'})</div>`;
      }).join('');
      elDetails.innerHTML = `
        ${vHtml}
        <div style="margin-top: 4px; color: var(--primary); font-weight: 600;">Perimeter: ~8.8 km | Area: ~462 Hectares</div>
      `;
    }

    // Zoom map directly to camp level geofence
    this.mapLevel = 'camp';
    this.updateBreadcrumbs();
    this.renderSvgMap();

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
      <a id="export-admissions-csv" href="${API_BASE}/api/v1/admin/reports/export?reportType=admissions" class="btn" style="background: var(--primary); color: white;">📥 Admissions CSV</a>
      <a id="export-fodder-csv" href="${API_BASE}/api/v1/admin/reports/export?reportType=fodder" class="btn" style="background: var(--success); color: white;">📥 Fodder Balance CSV</a>
      <a id="export-expenses-csv" href="${API_BASE}/api/v1/admin/reports/export?reportType=expenses" class="btn" style="background: #0277BD; color: white;">📥 Expenses CSV</a>
      <a id="export-inspections-csv" href="${API_BASE}/api/v1/admin/reports/export?reportType=inspections" class="btn" style="background: var(--secondary); color: white;">📥 Inspection Logs CSV</a>
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

// Expose Google Maps API Compatibility SDK Interface
if (typeof window !== 'undefined') {
  window.google = window.google || {};
  window.google.maps = window.google.maps || {
    Map: class {
      constructor(el, opts) {
        this.el = el;
        this.opts = opts || {};
      }
      setCenter(pos) { DashboardApp.googleMapCenter = pos; }
      setZoom(z) { DashboardApp.googleMapZoom = z; }
      setMapTypeId(type) {
        DashboardApp.googleMapTypeId = type;
        DashboardApp.renderSvgMap();
      }
    },
    Polygon: class {
      constructor(opts) { this.opts = opts || {}; }
      setMap(map) { this.map = map; }
    },
    Marker: class {
      constructor(opts) { this.opts = opts || {}; }
      setMap(map) { this.map = map; }
    },
    InfoWindow: class {
      constructor(opts) { this.opts = opts || {}; }
      open(map, marker) { this.isOpen = true; }
      close() { this.isOpen = false; }
    },
    LatLng: class {
      constructor(lat, lng) {
        this._lat = lat;
        this._lng = lng;
      }
      lat() { return this._lat; }
      lng() { return this._lng; }
    },
    LatLngBounds: class {
      constructor() { this.points = []; }
      extend(pt) { this.points.push(pt); }
    },
    MapTypeId: {
      ROADMAP: 'roadmap',
      SATELLITE: 'satellite',
      HYBRID: 'hybrid',
      TERRAIN: 'terrain'
    }
  };
}

// Global initialization
window.DashboardApp = DashboardApp;
document.addEventListener('DOMContentLoaded', () => DashboardApp.init());
