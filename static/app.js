// CHENNAI FLOOD NAV - PRODUCTION ENGINE v4.1
// Community Flood Warning & Commuter Safe-Nav System for Chennai

const API = "/api/v1";

// 85+ Comprehensive Chennai Landmarks Database by Category
const CHENNAI_DESTINATIONS = [
  // 1. TRANSIT & MAJOR TERMINALS
  { name: "Chennai Central Railway Station (MAS)", lat: 13.0827, lng: 80.2755, area: "Central Chennai • Main Railway Hub", cat: "TRANSIT" },
  { name: "Chennai Egmore Railway Station (MS)", lat: 13.0784, lng: 80.2587, area: "Central Chennai • South Bound Trains", cat: "TRANSIT" },
  { name: "Tambaram Railway Terminal & GST Stand", lat: 12.9249, lng: 80.1182, area: "South Chennai • 3rd Railway Terminal", cat: "TRANSIT" },
  { name: "Chennai International Airport (MAA)", lat: 12.9812, lng: 80.1754, area: "GST Road Meenambakkam • Terminals 1-4", cat: "TRANSIT" },
  { name: "Koyambedu CMBT Bus Terminus", lat: 13.0694, lng: 80.1948, area: "West Chennai • Mofussil Bus Terminus", cat: "TRANSIT" },
  { name: "Kilambakkam KCBT Bus Terminus", lat: 12.8550, lng: 80.0760, area: "South GST Road • New South Bound Hub", cat: "TRANSIT" },
  { name: "Madhavaram Mofussil Bus Terminus (MMBT)", lat: 13.1480, lng: 80.2280, area: "North Chennai • Andhra/Tirupati Buses", cat: "TRANSIT" },
  { name: "Perambur Railway Station", lat: 13.1095, lng: 80.2450, area: "North Chennai • Main North Junction", cat: "TRANSIT" },
  { name: "Guindy Railway & Metro Hub", lat: 13.0075, lng: 80.2120, area: "South-Central • Intermodal Transit", cat: "TRANSIT" },
  { name: "Velachery MRTS Railway Station", lat: 12.9785, lng: 80.2205, area: "South Chennai • MRTS Line Terminal", cat: "TRANSIT" },
  { name: "Chennai Beach Railway Station", lat: 13.0910, lng: 80.2930, area: "North Harbor • Suburban Terminal", cat: "TRANSIT" },

  // 2. METRO STATIONS
  { name: "Alandur Metro Station (Interchange)", lat: 13.0035, lng: 80.2015, area: "Blue & Green Line Junction", cat: "METRO" },
  { name: "Vadapalani Metro Station", lat: 13.0512, lng: 80.2125, area: "100ft Jawaharlal Nehru Road", cat: "METRO" },
  { name: "AG-DMS Metro Station", lat: 13.0450, lng: 80.2485, area: "Anna Salai • Teynampet", cat: "METRO" },
  { name: "Nandanam Metro Station", lat: 13.0315, lng: 80.2405, area: "Anna Salai & Chamiers Rd Junction", cat: "METRO" },
  { name: "LIC Metro Station", lat: 13.0645, lng: 80.2640, area: "Mount Road Commercial Hub", cat: "METRO" },
  { name: "Shenoy Nagar Metro Station", lat: 13.0785, lng: 80.2255, area: "Thiru Vi Ka Park Corridor", cat: "METRO" },
  { name: "Anna Nagar Tower Metro Station", lat: 13.0850, lng: 80.2140, area: "Anna Nagar 2nd Avenue", cat: "METRO" },
  { name: "Thirumangalam Metro Station", lat: 13.0855, lng: 80.1985, area: "VR Mall Junction", cat: "METRO" },
  { name: "Saidapet Metro Station", lat: 13.0245, lng: 80.2255, area: "Anna Salai • Near Maraimalai Bridge", cat: "METRO" },
  { name: "High Court Metro Station", lat: 13.0885, lng: 80.2885, area: "Parrys • George Town", cat: "METRO" },
  { name: "Arumbakkam Metro Station", lat: 13.0615, lng: 80.2045, area: "100ft Inner Ring Road", cat: "METRO" },

  // 3. IT CORRIDORS & TECH PARKS
  { name: "OMR Sholinganallur Junction (ELCOT SEZ)", lat: 12.8992, lng: 80.2282, area: "Rajiv Gandhi Salai • Tech Epicenter", cat: "IT_PARK" },
  { name: "TIDEL Park & Taramani Junction", lat: 12.9890, lng: 80.2485, area: "CSIR Road • IT Expressway Gateway", cat: "IT_PARK" },
  { name: "Ramanujan IT City & Ascendas", lat: 12.9880, lng: 80.2440, area: "Taramani • International Tech Park", cat: "IT_PARK" },
  { name: "Perungudi Toll Plaza & IT Corridor", lat: 12.9640, lng: 80.2450, area: "OMR • Industrial & Tech Estate", cat: "IT_PARK" },
  { name: "Thoraipakkam 200ft Radial Rd Junction", lat: 12.9410, lng: 80.2360, area: "OMR • Airport Link Gateway", cat: "IT_PARK" },
  { name: "Navalur (Marina Mall & Vivira)", lat: 12.8465, lng: 80.2260, area: "South OMR IT Hub", cat: "IT_PARK" },
  { name: "SIPCOT IT Park Siruseri", lat: 12.8285, lng: 80.2185, area: "OMR Southern Tech Corridor", cat: "IT_PARK" },
  { name: "DLF Cybercity (Manapakkam)", lat: 13.0180, lng: 80.1685, area: "Mount-Poonamallee High Road", cat: "IT_PARK" },
  { name: "Olympia Tech Park (Guindy)", lat: 13.0115, lng: 80.2075, area: "Guindy Industrial Estate", cat: "IT_PARK" },
  { name: "Ambattur IT Park & Industrial Estate", lat: 13.0980, lng: 80.1610, area: "West Chennai Industrial Hub", cat: "IT_PARK" },

  // 4. CENTRAL CHENNAI & COMMERCIAL HUBS
  { name: "T. Nagar (Panagal Park & Pondy Bazaar)", lat: 13.0416, lng: 80.2312, area: "Central Shopping District", cat: "CENTRAL" },
  { name: "T. Nagar (Usman Road Flyover)", lat: 13.0375, lng: 80.2325, area: "Ranganathan Street & Bus Stand", cat: "CENTRAL" },
  { name: "Nungambakkam (Valluvar Kottam)", lat: 13.0600, lng: 80.2400, area: "High Road Commercial Corridor", cat: "CENTRAL" },
  { name: "Mylapore (Kapaleeshwarar Temple)", lat: 13.0335, lng: 80.2695, area: "Historic Cultural Heart of Chennai", cat: "CENTRAL" },
  { name: "Alwarpet (Music Academy & TTK Road)", lat: 13.0425, lng: 80.2535, area: "Eldams Road Junction", cat: "CENTRAL" },
  { name: "Royapettah (Express Avenue Mall)", lat: 13.0585, lng: 80.2640, area: "Whites Road Junction", cat: "CENTRAL" },
  { name: "Marina Beach (Light House & Santhome)", lat: 13.0385, lng: 80.2785, area: "Kamajar Salai Coastal Arterial", cat: "CENTRAL" },
  { name: "Triplicane (Pycrofts Road)", lat: 13.0590, lng: 80.2760, area: "Near Parthasarathy Temple & Chepauk", cat: "CENTRAL" },
  { name: "Sowcarpet & George Town", lat: 13.0945, lng: 80.2790, area: "North-Central Wholesale Trade Hub", cat: "CENTRAL" },
  { name: "Kilpauk (EVR Periyar Salai)", lat: 13.0805, lng: 80.2415, area: "Poonamallee High Road Medical Corridor", cat: "CENTRAL" },
  { name: "Chetpet (Spur Tank Road & Eco Park)", lat: 13.0715, lng: 80.2410, area: "Central Chennai Lake Corridor", cat: "CENTRAL" },
  { name: "Choolaimedu High Road", lat: 13.0650, lng: 80.2220, area: "Nelson Manickam Road Link", cat: "CENTRAL" },

  // 5. SOUTH CHENNAI & RESIDENTIAL
  { name: "Adyar (Madhya Kailash Junction)", lat: 13.0067, lng: 80.2541, area: "OMR / Sardar Patel Rd Gateway", cat: "SOUTH" },
  { name: "Besant Nagar (Elliot's Beach)", lat: 12.9995, lng: 80.2685, area: "South Coastal Promenade", cat: "SOUTH" },
  { name: "Thiruvanmiyur (Marundeeswarar Temple)", lat: 12.9845, lng: 80.2600, area: "ECR Starting Junction", cat: "SOUTH" },
  { name: "Guindy (Kathipara Grade Separator)", lat: 13.0075, lng: 80.2065, area: "Chennai Elevated Highway Junction", cat: "SOUTH" },
  { name: "Kotturpuram (Anna Centenary Library)", lat: 13.0160, lng: 80.2415, area: "Gandhi Mandapam Road", cat: "SOUTH" },
  { name: "Velachery (Vijayanagar Bus Terminus)", lat: 12.9815, lng: 80.2212, area: "South Chennai Commuter Junction", cat: "SOUTH" },
  { name: "Velachery (Phoenix MarketCity Mall)", lat: 12.9915, lng: 80.2170, area: "Guru Nanak College Road", cat: "SOUTH" },
  { name: "Madipakkam (Koot Road Junction)", lat: 12.9642, lng: 80.1985, area: "Medavakkam Main Road", cat: "SOUTH" },
  { name: "Perumbakkam (Global Health City)", lat: 12.9056, lng: 80.1925, area: "Medavakkam-Sholinganallur Link", cat: "SOUTH" },
  { name: "Medavakkam (Koot Road)", lat: 12.9180, lng: 80.1915, area: "Tambaram-Velachery Artery", cat: "SOUTH" },
  { name: "Nanganallur (Thillai Ganga Nagar)", lat: 12.9868, lng: 80.1884, area: "Near Subway & Anjaneyar Temple", cat: "SOUTH" },
  { name: "Chromepet (GST Road & MIT Flyover)", lat: 12.9515, lng: 80.1410, area: "South Gateway GST Corridor", cat: "SOUTH" },
  { name: "Pallavaram (Radial Road Junction)", lat: 12.9680, lng: 80.1550, area: "Airport Bypass Link", cat: "SOUTH" },
  { name: "Mudichur (Krishna Nagar Flood Belt)", lat: 12.9152, lng: 80.0682, area: "West Tambaram • Adyar Basin", cat: "SOUTH" },

  // 6. WEST & NORTH-WEST CHENNAI
  { name: "Anna Nagar (Roundtana & 2nd Avenue)", lat: 13.0850, lng: 80.2100, area: "North-West Upscale Commercial Hub", cat: "WEST" },
  { name: "Koyambedu (Market & Metro)", lat: 13.0725, lng: 80.1875, area: "Inner Ring Road Junction", cat: "WEST" },
  { name: "Porur Junction & Toll Gate", lat: 13.0382, lng: 80.1565, area: "Mount-Poonamallee & Arcot Road", cat: "WEST" },
  { name: "Vadapalani (Murugan Temple)", lat: 13.0530, lng: 80.2145, area: "Arcot Road Central West Hub", cat: "WEST" },
  { name: "Ashok Nagar (11th Avenue Pillar)", lat: 13.0360, lng: 80.2120, area: "Residential Boulevard", cat: "WEST" },
  { name: "K.K. Nagar (Double Tank & Sivan Park)", lat: 13.0385, lng: 80.1975, area: "Munusamy Salai", cat: "WEST" },
  { name: "Valasaravakkam (Arcot Road)", lat: 13.0425, lng: 80.1765, area: "Residential Shopping Corridor", cat: "WEST" },
  { name: "Virugambakkam (Chinmaya Nagar)", lat: 13.0550, lng: 80.1920, area: "Koyambedu Link", cat: "WEST" },
  { name: "Mogappair East & West", lat: 13.0860, lng: 80.1740, area: "Ambattur Estate Link", cat: "WEST" },
  { name: "Poonamallee Bus Terminus & Bypass", lat: 13.0480, lng: 80.1080, area: "Bangalore Highway Gateway", cat: "WEST" },
  { name: "Kolathur (Retteri Junction)", lat: 13.1252, lng: 80.2165, area: "200ft Ring Road North Link", cat: "WEST" },
  { name: "Vyasarpadi (Basin Bridge)", lat: 13.1092, lng: 80.2643, area: "North Chennai Industrial & Rail", cat: "WEST" },
  { name: "Avadi Checkpost & Bus Stand", lat: 13.1160, lng: 80.1015, area: "CTH Road Western Suburb", cat: "WEST" },

  // 7. MAJOR HOSPITALS (CRITICAL LIFELINES)
  { name: "Apollo Hospitals (Greams Road)", lat: 13.0610, lng: 80.2520, area: "Thousand Lights • Main Center", cat: "HOSPITAL" },
  { name: "Rajiv Gandhi Government General Hospital", lat: 13.0805, lng: 80.2780, area: "Opposite Central Railway Station", cat: "HOSPITAL" },
  { name: "MIOT International Hospital (Manapakkam)", lat: 13.0235, lng: 80.1770, area: "Mount-Poonamallee Road", cat: "HOSPITAL" },
  { name: "SIMS Hospital (Vadapalani)", lat: 13.0505, lng: 80.2115, area: "Next to Metro Station", cat: "HOSPITAL" },
  { name: "Sri Ramachandra Hospital (Porur)", lat: 13.0410, lng: 80.1415, area: "Mount-Poonamallee High Road", cat: "HOSPITAL" },
  { name: "Gleneagles Global Health City (Perumbakkam)", lat: 12.9020, lng: 80.1955, area: "South Chennai Super-Specialty Hub", cat: "HOSPITAL" },
  { name: "Fortis Malar Hospital (Adyar)", lat: 13.0030, lng: 80.2585, area: "Besant Avenue Adyar", cat: "HOSPITAL" },
  { name: "Kauvery Hospital (Alwarpet)", lat: 13.0360, lng: 80.2555, area: "TTK Road Alwarpet", cat: "HOSPITAL" }
];

const state = {
  vehicle: "two_wheeler",
  viewMode: "fullscreen",
  isNavigating: false,
  isMapPickMode: false,
  activeDestCategory: "ALL",
  activeSubwayFilter: "ALL",
  activeWorksFilter: "ON_ROUTE",
  liveSyncTimer: null,
  userLocation: { lat: 12.9815, lng: 80.2212, accuracy: 25, isLive: false },
  destination: { name: "Chennai Central Railway Station (MAS)", lat: 13.0827, lng: 80.2755 },
  activeRouteData: null,
  watchId: null,
  weather: { is_rainy: false, subways_flooded: false, past_24h_rain_mm: 0.0, current_rain_mm: 0.0, summary: "Checking..." },
  subways: [],
  canals: [],
  reports: [],
  works: [],
  bowls: [],
  corridors: [],
  presets: [],
  contacts: [],
  map: null,
  userMarker: null,
  layers: {
    subways: null,
    canals: null,
    reports: null,
    works: null,
    bowls: null,
    corridors: null,
    routeSafe: null,
    routeStd: null,
    pins: null
  }
};

const VEHICLE_CONFIG = {
  two_wheeler: {
    name: "2-Wheeler",
    limit: 4.0,
    banner: "2-Wheeler Mode: Strictly avoid >4\" water to prevent engine stall.",
    icon: "🏍️"
  },
  sedan_hatchback: {
    name: "Car / Sedan",
    limit: 7.0,
    banner: "Car Mode: Avoid >7\" water to prevent engine hydrolock.",
    icon: "🚗"
  },
  suv: {
    name: "SUV / 4x4",
    limit: 14.0,
    banner: "SUV Mode: Passable up to 14\" with caution.",
    icon: "🚙"
  },
  bus_heavy: {
    name: "Bus / Heavy",
    limit: 24.0,
    banner: "Heavy Commercial Mode: High ground clearance allowed.",
    icon: "🚌"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initInteractions();
  fetchInitialData();
  requestUserGeolocation();
});

// 1. MAP INITIALIZATION
function initMap() {
  state.map = L.map("leafletMap", {
    center: [13.0400, 80.2250],
    zoom: 12,
    zoomControl: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap | Chennai Flood Nav',
    maxZoom: 18
  }).addTo(state.map);

  state.layers.bowls = L.layerGroup().addTo(state.map);
  state.layers.corridors = L.layerGroup().addTo(state.map);
  state.layers.canals = L.layerGroup().addTo(state.map);
  state.layers.works = L.layerGroup().addTo(state.map);
  state.layers.subways = L.layerGroup().addTo(state.map);
  state.layers.reports = L.layerGroup().addTo(state.map);
  state.layers.routeStd = L.layerGroup().addTo(state.map);
  state.layers.routeSafe = L.layerGroup().addTo(state.map);
  state.layers.pins = L.layerGroup().addTo(state.map);

  state.map.on("click", (e) => {
    if (state.isMapPickMode) {
      setDestinationFromCoords(e.latlng.lat, e.latlng.lng, `Custom Pin (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`);
      state.isMapPickMode = false;
      showToast("📍 Destination pin dropped!", "success");
    } else {
      openReportActionSheet(e.latlng.lat, e.latlng.lng);
    }
  });
}

// 2. HTML5 GEOLOCATION
function requestUserGeolocation() {
  if (!navigator.geolocation) {
    showToast("⚠️ Geolocation not supported by this browser. Using central Chennai.", "warning");
    return;
  }

  showToast("📍 Requesting GPS Location permission...", "info");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      handleGpsSuccess(pos);
      if (!state.watchId) {
        state.watchId = navigator.geolocation.watchPosition(handleGpsSuccess, handleGpsError, {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        });
      }
    },
    (err) => {
      console.warn("GPS Permission Denied or Timeout:", err.message);
      showToast("ℹ️ Location permission denied. Tap 📍 button to retry anytime.", "warning");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function handleGpsSuccess(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const acc = pos.coords.accuracy;

  state.userLocation = { lat, lng, accuracy: acc, isLive: true };

  const originInput = document.getElementById("inputOriginText");
  if (originInput) originInput.value = `My Live GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  const oLat = document.getElementById("originLat");
  const oLng = document.getElementById("originLng");
  if (oLat) oLat.value = lat;
  if (oLng) oLng.value = lng;

  updateUserLocationMarker(lat, lng);
  checkProximityHazards(lat, lng);

  if (state.destination) {
    recalcCurrentRoute();
  }
}

function handleGpsError(err) {
  console.warn("GPS watch error:", err.message);
}

function updateUserLocationMarker(lat, lng) {
  if (state.userMarker) {
    state.userMarker.setLatLng([lat, lng]);
  } else {
    const gpsIcon = L.divIcon({
      className: "user-gps-icon",
      html: `
        <div class="user-gps-marker-box">
          <div class="gps-pulse-ring"></div>
          <div class="user-gps-dot"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    state.userMarker = L.marker([lat, lng], { icon: gpsIcon, zIndexOffset: 1000 })
      .addTo(state.map)
      .bindPopup("<strong>📍 You Are Here (Live GPS)</strong>");
  }
}

// 3. PROXIMITY HAZARD DETECTION
function checkProximityHazards(userLat, userLng) {
  const banner = document.getElementById("proximityBanner");
  if (!banner) return;

  // If weather is dry and subways are not flooded, do NOT trigger false flood alerts!
  if (!state.weather.subways_flooded) {
    let nearestClosure = null;
    let minClosureDist = 999999;
    (state.works || []).forEach(w => {
      if (w.impact_level === "ROAD_FULLY_CLOSED") {
        const d = haversineDistanceMeters(userLat, userLng, w.latitude, w.longitude);
        if (d < minClosureDist) {
          minClosureDist = d;
          nearestClosure = w;
        }
      }
    });

    if (nearestClosure && minClosureDist < 450) {
      banner.style.display = "flex";
      document.getElementById("proxTitle").innerText = `🛑 ROAD CLOSED: ${nearestClosure.road_name}`;
      document.getElementById("proxDesc").innerText = `${nearestClosure.work_title} ${Math.round(minClosureDist)}m ahead. Follow diversion!`;
    } else {
      banner.style.display = "none";
    }
    return;
  }

  // If weather is rainy, alert on closed submerged subways
  let nearestClosed = null;
  let minDistanceM = 999999;

  (state.subways || []).forEach((s) => {
    if (s.water_depth_inches > 0 && s.status === "CLOSED_SUBMERGED") {
      const distM = haversineDistanceMeters(userLat, userLng, s.latitude, s.longitude);
      if (distM < minDistanceM) {
        minDistanceM = distM;
        nearestClosed = s;
      }
    }
  });

  if (nearestClosed && minDistanceM < 550) {
    banner.style.display = "flex";
    document.getElementById("proxTitle").innerText = `⚠️ HAZARD PROXIMITY: ${nearestClosed.name}`;
    document.getElementById("proxDesc").innerText = `${nearestClosed.name} is ${Math.round(minDistanceM)}m ahead (${nearestClosed.water_depth_inches}" submerged). Diverting to elevated corridor!`;
  } else {
    banner.style.display = "none";
  }
}

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dlat = (lat2 - lat1) * Math.PI / 180;
  const dlon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dlon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 4. DATA FETCHING & WEATHER SYNC
async function fetchInitialData() {
  try {
    const [weather, subways, canals, reports, works, bowls, corridors, presets, contacts] = await Promise.all([
      fetch(`${API}/weather`).then(r => r.json()).catch(() => ({ subways_flooded: false, summary: "Dry Weather" })),
      fetch(`${API}/subways?apply_weather=true`).then(r => r.json()),
      fetch(`${API}/canals`).then(r => r.json()),
      fetch(`${API}/reports`).then(r => r.json()),
      fetch(`${API}/works`).then(r => r.json()),
      fetch(`${API}/emergency/bowls`).then(r => r.json()),
      fetch(`${API}/emergency/corridors`).then(r => r.json()),
      fetch(`${API}/navigation/presets`).then(r => r.json()),
      fetch(`${API}/emergency/contacts`).then(r => r.json())
    ]);

    state.weather = weather;
    state.subways = subways;
    state.canals = canals;
    state.reports = reports;
    state.works = works;
    state.bowls = bowls;
    state.corridors = corridors;
    state.presets = presets;
    state.contacts = contacts;

    // Update tab counter badges
    const closedSubways = subways.filter(s => s.status === "CLOSED_SUBMERGED" && s.water_depth_inches > 0);
    const subwaysBadge = document.getElementById("subwaysClosedCount");
    if (subwaysBadge) subwaysBadge.innerText = closedSubways.length;

    const worksBadge = document.getElementById("worksCount");
    if (worksBadge) worksBadge.innerText = works.length;

    updateWeatherUI(weather);
    updateWorksProximityAndBadges();
    renderMapLayers();
    renderPresetsBar();
    renderSubwaysList();
    renderWorksList();
    startRealTimeSync();
    renderCanalsList();
    renderReportsList();
    renderEmergencySheet();
    renderDestinationSuggestions();

    recalcCurrentRoute();
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

function updateWeatherUI(w) {
  const iconEl = document.getElementById("weatherIcon");
  const textEl = document.getElementById("weatherText");
  const subEl = document.getElementById("weatherSub");
  const bannerText = document.getElementById("vehicleBannerText");

  if (!w.subways_flooded) {
    if (iconEl) iconEl.innerText = "☀️";
    if (textEl) textEl.innerText = `Chennai Weather: Clear / Dry (${w.past_24h_rain_mm}mm rain)`;
    if (subEl) subEl.innerText = "All 10 subways dry & open • Normal city transit times";
    if (bannerText) {
      bannerText.innerText = `${VEHICLE_CONFIG[state.vehicle].name} Mode: Surface roads clear. Normal traffic flow.`;
    }
  } else {
    if (iconEl) iconEl.innerText = "⛈️";
    if (textEl) textEl.innerText = `Monsoon Alert: ${w.current_rain_mm}mm/hr rain (${w.past_24h_rain_mm}mm in 24h)`;
    if (subEl) subEl.innerText = "Low-lying subways submerged • Flood rerouting active";
    if (bannerText) {
      bannerText.innerText = VEHICLE_CONFIG[state.vehicle].banner;
    }
  }

  // Update modal values
  const currRain = document.getElementById("metricCurrentRain");
  const rain24 = document.getElementById("metric24hRain");
  const tempEl = document.getElementById("metricTemp");
  const subStatus = document.getElementById("metricSubwayStatus");
  const notice = document.getElementById("weatherNoticeText");

  if (currRain) currRain.innerText = `${w.current_rain_mm || 0} mm/hr`;
  if (rain24) rain24.innerText = `${w.past_24h_rain_mm || 0} mm`;
  if (tempEl) tempEl.innerText = `${w.temperature_c || 31}°C`;
  if (subStatus) subStatus.innerText = w.subways_flooded ? "FLOODED" : "100% DRY";
  if (notice) notice.innerText = w.summary || "Weather synced with live IMD radar.";
}

// 5. WEATHER MODE CONTROLLER
function openWeatherModal() {
  const modal = document.getElementById("weatherModal");
  if (modal) modal.style.display = "flex";
}

function closeWeatherModal() {
  const modal = document.getElementById("weatherModal");
  if (modal) modal.style.display = "none";
}

async function switchWeatherMode(mode) {
  showToast(`Switching weather mode to ${mode}...`, "info");
  try {
    const res = await fetch(`${API}/weather/mode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    if (res.ok) {
      const data = await res.json();
      state.weather = data.weather;
      updateWeatherUI(data.weather);
      
      ["modeBtnLive", "modeBtnDry", "modeBtnRain"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove("active");
      });
      if (mode === "LIVE") document.getElementById("modeBtnLive")?.classList.add("active");
      if (mode === "SIMULATE_DRY") document.getElementById("modeBtnDry")?.classList.add("active");
      if (mode === "SIMULATE_HEAVY_RAIN") document.getElementById("modeBtnRain")?.classList.add("active");

      await fetchInitialData();
      showToast(`Weather mode updated: ${mode}`, "success");
      closeWeatherModal();
    }
  } catch (err) {
    showToast("Failed to switch weather mode", "warning");
  }
}

// 6. MAP RENDERING
function renderMapLayers() {
  // 1. Subways
  state.layers.subways.clearLayers();
  const vLimit = VEHICLE_CONFIG[state.vehicle].limit;

  state.subways.forEach((s) => {
    const isClosed = s.status === "CLOSED_SUBMERGED" && s.water_depth_inches > 0;
    const isWarning = s.status === "WATERLOGGED_WARNING";
    const isPassable = s.water_depth_inches <= vLimit;

    let pinColor = isClosed ? "#EF4444" : isWarning ? (isPassable ? "#F59E0B" : "#EF4444") : "#10B981";
    let pinSymbol = isClosed ? "⛔" : isWarning ? (isPassable ? "⚠️" : "❌") : "✓";

    const customIcon = L.divIcon({
      className: "custom-pin",
      html: `
        <div style="background: ${pinColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          ${pinSymbol}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const popup = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 200px; color: #0F172A;">
        <h4 style="margin: 0 0 2px; font-size: 13px; font-weight: 800;">${s.name}</h4>
        <div style="font-size: 10px; color: #64748B; margin-bottom: 6px;">${s.area_name}</div>
        <div style="background: #F1F5F9; padding: 6px 8px; border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
          <div><strong>Water Depth:</strong> ${s.water_depth_inches}" (${(s.water_depth_inches / 12).toFixed(1)} ft)</div>
          <div><strong>Pump Status:</strong> ${s.pump_status}</div>
          <div style="margin-top: 4px; font-weight: 700; color: ${isPassable ? '#059669' : '#DC2626'};">
            ${isPassable ? '✓ Passable for ' + VEHICLE_CONFIG[state.vehicle].name : '❌ IMPASSABLE for ' + VEHICLE_CONFIG[state.vehicle].name}
          </div>
        </div>
        <button onclick="upvoteSubway(${s.id})" style="width: 100%; background: #0EA5E9; color: white; border: none; padding: 5px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">
          👍 Verify Status (${s.upvotes})
        </button>
      </div>
    `;

    const marker = L.marker([s.latitude, s.longitude], { icon: customIcon }).bindPopup(popup);
    state.layers.subways.addLayer(marker);
  });

  // 2. Civic Works (Orange Cones)
  state.layers.works.clearLayers();
  state.works.forEach((w) => {
    const isFullClosure = w.impact_level === "ROAD_FULLY_CLOSED";
    const coneColor = isFullClosure ? "#DC2626" : "#D97706";
    const coneSymbol = isFullClosure ? "🛑" : "🚧";

    const workIcon = L.divIcon({
      className: "custom-work-pin",
      html: `
        <div style="background: ${coneColor}; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          ${coneSymbol}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const workPopup = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; color: #0F172A;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${isFullClosure ? '#FEE2E2; color: #DC2626' : '#FEF3C7; color: #B45309'}">
            ${w.impact_level.replace(/_/g, " ")}
          </span>
          <span style="font-size: 10px; color: #64748B;">👍 ${w.upvotes} verified</span>
        </div>
        <h4 style="margin: 0 0 2px; font-size: 13px; font-weight: 800;">${w.work_title}</h4>
        <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">📍 ${w.road_name} (${w.area_name})</div>
        <div style="font-size: 10.5px; color: #334155; background: #F8FAFC; padding: 6px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #E2E8F0;">
          ${w.description || 'Active civic obstacle. Proceed with caution.'}
        </div>
        <button onclick="upvoteWork(${w.id})" style="width: 100%; background: #D97706; color: white; border: none; padding: 5px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">
          👍 Confirm Road Work (${w.upvotes})
        </button>
      </div>
    `;

    const marker = L.marker([w.latitude, w.longitude], { icon: workIcon }).bindPopup(workPopup);
    state.layers.works.addLayer(marker);
  });

  // 3. Canals
  state.layers.canals.clearLayers();
  state.canals.forEach((c) => {
    const isCritical = c.water_level_percent > 90;
    const isHigh = c.water_level_percent > 75;
    const canalColor = isCritical ? "#DC2626" : isHigh ? "#EA580C" : "#0284C7";

    const canalMarker = L.circleMarker([c.latitude, c.longitude], {
      color: canalColor,
      fillColor: canalColor,
      fillOpacity: 0.6,
      radius: 9,
      weight: 2
    }).bindPopup(`
      <strong>🌊 ${c.name}</strong><br>
      Catchment: ${c.catchment_area}<br>
      Discharge Level: <strong>${c.water_level_percent}%</strong> (${c.status})
    `);

    state.layers.canals.addLayer(canalMarker);
  });

  // 4. Bowls
  state.layers.bowls.clearLayers();
  state.bowls.forEach((b) => {
    state.layers.bowls.addLayer(L.circle([b.latitude, b.longitude], {
      color: "#F43F5E",
      fillColor: "#F43F5E",
      fillOpacity: 0.15,
      weight: 1.5,
      radius: b.radius_meters
    }).bindPopup(`<strong>⚠️ ${b.name}</strong><br>Low depression flood bowl.`));
  });

  // 5. Corridors
  state.layers.corridors.clearLayers();
  state.corridors.forEach((c) => {
    if (c.waypoints && c.waypoints.length > 1) {
      state.layers.corridors.addLayer(L.polyline(c.waypoints, {
        color: "#10B981",
        weight: 4,
        opacity: 0.8,
        dashArray: "6, 6"
      }).bindPopup(`<strong>🛡️ ${c.name}</strong><br>Elevated dry arterial corridor.`));
    }
  });
}

// 7. DESTINATION AUTOCOMPLETE & CATEGORY FILTERING
function filterDestCategory(cat) {
  state.activeDestCategory = cat;
  document.querySelectorAll(".cat-chip").forEach(c => {
    if (c.getAttribute("data-cat") === cat || (cat === "ALL" && c.innerText.startsWith("All"))) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });

  const searchVal = document.getElementById("destSearchInput")?.value || "";
  renderDestinationSuggestions(searchVal);
}

function renderDestinationSuggestions(filterText = "") {
  const container = document.getElementById("destSuggestionsList");
  if (!container) return;

  const fText = filterText.toLowerCase().trim();
  const cat = state.activeDestCategory;

  const filtered = CHENNAI_DESTINATIONS.filter(d => {
    const matchesCategory = (cat === "ALL" || d.cat === cat);
    const matchesText = !fText || d.name.toLowerCase().includes(fText) || d.area.toLowerCase().includes(fText);
    return matchesCategory && matchesText;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #94A3B8;">
        <i class="fa-solid fa-map-location-dot" style="font-size: 24px; margin-bottom: 8px; display: block; color: #38BDF8;"></i>
        <div>No exact landmark match for "${filterText}"</div>
        <div style="font-size: 11px; margin-top: 4px;">Tap <strong>Pick on Map</strong> to drop a pin anywhere in Chennai.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="dest-item" onclick="setDestinationFromCoords(${d.lat}, ${d.lng}, '${d.name.replace(/'/g, "\\'")}')">
      <div>
        <div class="dest-item-name">${d.name}</div>
        <div class="dest-item-sub">${d.area}</div>
      </div>
      <i class="fa-solid fa-arrow-right text-teal"></i>
    </div>
  `).join("");
}

function setDestinationFromCoords(lat, lng, name) {
  state.destination = { name, lat, lng };
  document.getElementById("inputDestText").value = name;
  document.getElementById("destLat").value = lat;
  document.getElementById("destLng").value = lng;
  document.getElementById("destinationModal").style.display = "none";

  recalcCurrentRoute();
  showToast(`🎯 Destination: ${name}`, "success");
}

// 8. DYNAMIC ROUTING ENGINE WITH REAL DISTANCE & DURATION
async function recalcCurrentRoute() {
  const oLat = parseFloat(document.getElementById("originLat").value) || state.userLocation.lat;
  const oLng = parseFloat(document.getElementById("originLng").value) || state.userLocation.lng;
  const dLat = parseFloat(document.getElementById("destLat").value) || state.destination.lat;
  const dLng = parseFloat(document.getElementById("destLng").value) || state.destination.lng;
  const dName = document.getElementById("inputDestText").value || state.destination.name;

  try {
    const res = await fetch(`${API}/navigation/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin_name: "Live Origin",
        origin_lat: oLat,
        origin_lng: oLng,
        dest_name: dName,
        dest_lat: dLat,
        dest_lng: dLng,
        vehicle_type: state.vehicle
      })
    });

    if (!res.ok) return;
    const data = await res.json();
    state.activeRouteData = data;
    updateWorksProximityAndBadges();
    renderWorksList();
    renderRouteDataInSheet(data);
    drawRoutesOnMap(data);
  } catch (err) {
    console.error("Routing error:", err);
  }
}

function drawRoutesOnMap(data) {
  state.layers.routeStd.clearLayers();
  state.layers.routeSafe.clearLayers();
  state.layers.pins.clearLayers();

  const std = data.standard_route;
  const safe = data.monsoon_safe_route;

  if (std && std.coordinates && std.coordinates.length > 1) {
    const stdColor = std.passable_for_vehicle ? "#38BDF8" : "#EF4444";
    const stdPoly = L.polyline(std.coordinates, {
      color: stdColor,
      weight: 5,
      opacity: 0.85,
      dashArray: std.passable_for_vehicle ? null : "6, 8"
    }).addTo(state.layers.routeStd);

    stdPoly.bindPopup(`<strong>${std.route_name}</strong><br>Distance: ${std.total_distance_km} km | Time: ~${std.estimated_duration_mins} mins`);
  }

  if (safe && safe.coordinates && safe.coordinates.length > 1) {
    const safePoly = L.polyline(safe.coordinates, {
      color: "#10B981",
      weight: 6,
      opacity: 0.95
    }).addTo(state.layers.routeSafe);

    safePoly.bindPopup(`<strong>${safe.route_name}</strong><br>Distance: ${safe.total_distance_km} km | Time: ~${safe.estimated_duration_mins} mins`);
  }

  const originPin = L.divIcon({
    className: "nav-pin",
    html: `<div style="background: #0EA5E9; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">A</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  L.marker([data.origin.latitude, data.origin.longitude], { icon: originPin }).addTo(state.layers.pins);

  const destPin = L.divIcon({
    className: "nav-pin",
    html: `<div style="background: #10B981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">B</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  L.marker([data.destination.latitude, data.destination.longitude], { icon: destPin }).addTo(state.layers.pins);
}

function renderStepsHtml(steps) {
  if (!steps || steps.length === 0) return '<div style="padding: 10px; color: #94A3B8;">No turn details available.</div>';
  return steps.map((step, idx) => `
    <div class="step-card ${step.is_hazard ? 'hazard-step' : ''}">
      <div class="step-num">${idx + 1}</div>
      <div class="step-info">
        <div class="step-inst">${step.instruction}</div>
        <div class="step-meta">
          <span>${step.distance_meters}m</span> • <span class="step-badge">${step.elevation_type}</span>
        </div>
        ${step.hazard_description ? `<div class="step-warn">${step.hazard_description}</div>` : ''}
      </div>
    </div>
  `).join("");
}

function toggleStepsAccordion(id) {
  const dropdown = document.getElementById(`stepsDropdown_${id}`);
  const chevron = document.getElementById(`stepsChevron_${id}`);
  if (dropdown) {
    const isHidden = dropdown.style.display === "none";
    dropdown.style.display = isHidden ? "block" : "none";
    if (chevron) {
      chevron.className = isHidden ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down";
    }
  }
}

// 9. DYNAMIC ROUTE CARDS IN BOTTOM SHEET
function renderRouteDataInSheet(data) {
  const std = data.standard_route;
  const safe = data.monsoon_safe_route;
  const isFlooded = state.weather.subways_flooded && !std.passable_for_vehicle;

  // 1. Update Peek Bar in Bottom Sheet Header
  const peekTitle = document.getElementById("peekRouteTitle");
  const peekMetrics = document.getElementById("peekMetrics");

  if (peekTitle) {
    peekTitle.innerText = `${data.origin.name} ➔ ${data.destination.name}`;
  }

  if (peekMetrics) {
    if (isFlooded) {
      peekMetrics.innerHTML = `
        <span class="text-emerald font-bold">${safe.total_distance_km} km • ~${safe.estimated_duration_mins} mins</span>
        <span class="peek-dot">•</span>
        <span class="badge-pill-safe">🛡️ Monsoon Safe</span>
      `;
    } else {
      peekMetrics.innerHTML = `
        <span class="text-teal font-bold">${std.total_distance_km} km • ~${std.estimated_duration_mins} mins</span>
        <span class="peek-dot">•</span>
        <span class="badge-pill-safe" style="color: #38BDF8;">✓ Direct Route (Clear &amp; Dry)</span>
      `;
    }
  }

  // 2. Render Cards in #routeCardsContainer
  const container = document.getElementById("routeCardsContainer");
  if (!container) return;

  if (!isFlooded) {
    // DRY WEATHER: Standard Route is 100% CLEAR, GREEN & RECOMMENDED! (NO false flood hazard)
    container.innerHTML = `
      <!-- Recommended Direct Route (Clear & Dry) -->
      <div class="app-card safe-route-card">
        <div class="card-tag safe-tag">
          <i class="fa-solid fa-circle-check"></i> RECOMMENDED DIRECT ROUTE (CLEAR &amp; DRY)
        </div>
        
        <div class="card-main-row">
          <div>
            <h3 class="card-title text-emerald">${std.route_name}</h3>
            <p class="card-sub">Direct roads &amp; subways are completely dry. 0" water logging.</p>
          </div>
          <div class="card-stat">
            <span class="stat-num text-emerald">~${std.estimated_duration_mins}m</span>
            <span class="stat-lbl">${std.total_distance_km} km</span>
          </div>
        </div>

        <div class="benefit-chips">
          <span class="benefit-chip">✓ 0 Submerged Subways</span>
          <span class="benefit-chip">✓ 100% Passable for ${VEHICLE_CONFIG[state.vehicle].name}</span>
          <span class="benefit-chip">✓ Direct City Arterial</span>
        </div>

        <div class="steps-container">
          <button class="btn-accordion" onclick="toggleStepsAccordion('std')">
            <span><i class="fa-solid fa-list-ol"></i> Step-by-Step Directions (${std.steps.length} turns)</span>
            <i class="fa-solid fa-chevron-down" id="stepsChevron_std"></i>
          </button>
          <div class="steps-dropdown" id="stepsDropdown_std" style="display: none;">
            ${renderStepsHtml(std.steps)}
          </div>
        </div>
      </div>

      <!-- Alternative: Elevated Monsoon Corridor -->
      <div class="app-card" style="background: rgba(30, 41, 59, 0.65); border: 1px solid rgba(255, 255, 255, 0.1);">
        <div class="card-tag" style="background: rgba(14, 165, 233, 0.2); color: #38BDF8;">
          <i class="fa-solid fa-shield-halved"></i> ELEVATED ARTERIAL CORRIDOR (ALTERNATIVE)
        </div>
        
        <div class="card-main-row">
          <div>
            <h3 class="card-title">${safe.route_name}</h3>
            <p class="card-sub">Via grade-separated flyovers (Kathipara / Anna Salai ridge)</p>
          </div>
          <div class="card-stat">
            <span class="stat-num text-teal">~${safe.estimated_duration_mins}m</span>
            <span class="stat-lbl">${safe.total_distance_km} km</span>
          </div>
        </div>

        <div class="benefit-chips">
          <span class="benefit-chip">✓ Grade-separated Bridges</span>
          <span class="benefit-chip">✓ Signal-Free Elevated Flow</span>
        </div>

        <div class="steps-container">
          <button class="btn-accordion" onclick="toggleStepsAccordion('safe')">
            <span><i class="fa-solid fa-list-ol"></i> Step-by-Step Directions (${safe.steps.length} turns)</span>
            <i class="fa-solid fa-chevron-down" id="stepsChevron_safe"></i>
          </button>
          <div class="steps-dropdown" id="stepsDropdown_safe" style="display: none;">
            ${renderStepsHtml(safe.steps)}
          </div>
        </div>
      </div>
    `;
  } else {
    // MONSOON FLOODING DETECTED: Show Elevated Route in Green & Direct Route in Red
    container.innerHTML = `
      <!-- Recommended Monsoon Safe Route -->
      <div class="app-card safe-route-card">
        <div class="card-tag safe-tag">
          <i class="fa-solid fa-shield-halved"></i> RECOMMENDED MONSOON ROUTE
        </div>
        
        <div class="card-main-row">
          <div>
            <h3 class="card-title">${safe.route_name}</h3>
            <p class="card-sub">Via Kathipara flyover &amp; Anna Salai elevated ridge</p>
          </div>
          <div class="card-stat">
            <span class="stat-num text-emerald">~${safe.estimated_duration_mins}m</span>
            <span class="stat-lbl">${safe.total_distance_km} km</span>
          </div>
        </div>

        <div class="benefit-chips">
          <span class="benefit-chip">✓ 0 Submerged Subways</span>
          <span class="benefit-chip">✓ 100% Dry Ridge</span>
          <span class="benefit-chip">✓ Free-flowing Traffic</span>
        </div>

        <div class="steps-container">
          <button class="btn-accordion" onclick="toggleStepsAccordion('safe')">
            <span><i class="fa-solid fa-list-ol"></i> Step-by-Step Directions</span>
            <i class="fa-solid fa-chevron-down" id="stepsChevron_safe"></i>
          </button>
          <div class="steps-dropdown" id="stepsDropdown_safe" style="display: none;">
            ${renderStepsHtml(safe.steps)}
          </div>
        </div>
      </div>

      <!-- Standard Route Card: High Flood Hazard -->
      <div class="app-card danger-route-card">
        <div class="card-tag danger-tag">
          <i class="fa-solid fa-triangle-exclamation"></i> STANDARD DIRECT ROUTE (SUBMERGED)
        </div>
        
        <div class="card-main-row">
          <div>
            <h3 class="card-title text-danger">High Flood Hazard</h3>
            <p class="card-sub">Direct low-lying roads &amp; railway subways</p>
          </div>
          <div class="card-stat">
            <span class="stat-num text-danger">~${std.estimated_duration_mins}m</span>
            <span class="stat-lbl">${std.total_distance_km} km</span>
          </div>
        </div>

        <div class="warning-callout">
          <i class="fa-solid fa-ban"></i>
          <span>${data.critical_warning || 'Impassable in ' + VEHICLE_CONFIG[state.vehicle].name + '! Water depth in subway exceeds clearance limit.'}</span>
        </div>
      </div>
    `;
  }
}

// 10. LIST RENDERING (SUBWAYS, WORKS, CANALS, REPORTS)
function renderPresetsBar() {
  const container = document.getElementById("presetsScrollBar");
  if (!container) return;

  container.innerHTML = state.presets.map(p => `
    <button class="preset-chip" onclick="applyPresetRoute('${p.id}')">
      <span>${p.title}</span>
    </button>
  `).join("");
}

function applyPresetRoute(presetId) {
  const p = state.presets.find(x => x.id === presetId);
  if (!p) return;

  document.getElementById("inputOriginText").value = p.origin.name;
  document.getElementById("originLat").value = p.origin.latitude;
  document.getElementById("originLng").value = p.origin.longitude;

  document.getElementById("inputDestText").value = p.destination.name;
  document.getElementById("destLat").value = p.destination.latitude;
  document.getElementById("destLng").value = p.destination.longitude;

  state.destination = {
    name: p.destination.name,
    lat: p.destination.latitude,
    lng: p.destination.longitude
  };

  recalcCurrentRoute();
  showToast(`⚡ Loaded corridor: ${p.title}`, "info");
}

function renderSubwaysList() {
  const container = document.getElementById("subwaysAppList");
  if (!container) return;

  const filter = state.activeSubwayFilter;
  const filtered = state.subways.filter(s => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #94A3B8; padding: 24px;">No subways in this status.</div>`;
    return;
  }

  container.innerHTML = filtered.map(s => {
    const isClosed = s.status === "CLOSED_SUBMERGED" && s.water_depth_inches > 0;
    const isWarning = s.status === "WATERLOGGED_WARNING";
    const statusColor = isClosed ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981";

    return `
      <div class="subway-card" style="border-left: 4px solid ${statusColor}; margin-bottom: 10px; background: rgba(30, 41, 59, 0.7); border-radius: 12px; padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #F8FAFC;">${s.name}</h4>
            <div style="font-size: 0.72rem; color: #94A3B8;">📍 ${s.area_name}</div>
          </div>
          <span style="font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}44;">
            ${s.status.replace(/_/g, " ")}
          </span>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 8px 10px; border-radius: 8px; font-size: 0.75rem; color: #CBD5E1; margin-bottom: 8px;">
          <div><strong>Water Depth:</strong> ${s.water_depth_inches}" (${(s.water_depth_inches / 12).toFixed(1)} ft) • <strong>Pumps:</strong> ${s.pump_status}</div>
          <div style="margin-top: 4px; color: ${s.water_depth_inches === 0 ? '#34D399' : '#F87171'};">
            ${s.vehicle_clearance_notes}
          </div>
        </div>
        <button onclick="upvoteSubway(${s.id})" style="background: rgba(14, 165, 233, 0.15); color: #38BDF8; border: 1px solid rgba(14, 165, 233, 0.3); padding: 5px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
          👍 Verify Clear (${s.upvotes})
        </button>
      </div>
    `;
  }).join("");
}


// --- DYNAMIC CIVIC WORK & OBSTACLE ANALYSIS ENGINE ---
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

function minDistanceToPolylineKm(lat, lng, coords) {
  if (!coords || coords.length === 0) return 999.0;
  let minMeters = 999999.0;
  for (let i = 0; i < coords.length; i++) {
    const pt = coords[i];
    const d = haversineDistanceMeters(lat, lng, pt[0], pt[1]);
    if (d < minMeters) minMeters = d;
    if (i < coords.length - 1) {
      const next = coords[i + 1];
      const midLat = (pt[0] + next[0]) / 2.0;
      const midLng = (pt[1] + next[1]) / 2.0;
      const dMid = haversineDistanceMeters(lat, lng, midLat, midLng);
      if (dMid < minMeters) minMeters = dMid;
    }
  }
  return minMeters / 1000.0;
}

function updateWorksProximityAndBadges() {
  const destLat = state.destination ? state.destination.lat : 13.0827;
  const destLng = state.destination ? state.destination.lng : 80.2755;
  const userLat = state.userLocation ? state.userLocation.lat : 12.9815;
  const userLng = state.userLocation ? state.userLocation.lng : 80.2212;

  const stdCoords = (state.activeRouteData && state.activeRouteData.standard_route)
    ? state.activeRouteData.standard_route.coordinates
    : null;

  (state.works || []).forEach(w => {
    // Proximity to destination
    w.distToDestKm = haversineDistanceMeters(w.latitude, w.longitude, destLat, destLng) / 1000.0;
    w.nearDest = w.distToDestKm <= 2.8;

    // Proximity to route corridor (within 550m)
    if (stdCoords && stdCoords.length > 1) {
      w.distToRouteKm = minDistanceToPolylineKm(w.latitude, w.longitude, stdCoords);
      w.onRoute = w.distToRouteKm <= 0.55;
    } else {
      w.distToRouteKm = 999.0;
      w.onRoute = false;
    }

    // Distance from user GPS
    w.distFromUserKm = haversineDistanceMeters(w.latitude, w.longitude, userLat, userLng) / 1000.0;
  });

  const onRouteCount = (state.works || []).filter(w => w.onRoute).length;
  const nearDestCount = (state.works || []).filter(w => w.nearDest).length;
  const allCount = (state.works || []).length;

  // Sub-filter counts
  const rBadge = document.getElementById("routeWorksCount");
  if (rBadge) rBadge.innerText = onRouteCount;

  const dBadge = document.getElementById("destWorksCount");
  if (dBadge) dBadge.innerText = nearDestCount;

  const aBadge = document.getElementById("allWorksCount");
  if (aBadge) aBadge.innerText = allCount;

  // Bottom sheet tab header badge: dynamically reflects destination/route!
  const worksTabBadge = document.getElementById("worksCount");
  if (worksTabBadge) {
    worksTabBadge.innerText = onRouteCount;
  }
}

function filterWorksCategory(cat) {
  state.activeWorksFilter = cat;
  const pillMap = {
    "ON_ROUTE": "pillWorkRoute",
    "NEAR_DEST": "pillWorkDest",
    "ALL": "pillWorkAll"
  };
  Object.entries(pillMap).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) {
      if (key === cat) el.classList.add("active");
      else el.classList.remove("active");
    }
  });
  renderWorksList();
}
window.filterWorksCategory = filterWorksCategory;

function renderWorksList() {
  const container = document.getElementById("worksAppList");
  if (!container) return;

  const filter = state.activeWorksFilter || "ON_ROUTE";
  const destName = state.destination ? state.destination.name : "Selected Destination";

  if (filter === "ON_ROUTE") {
    const onRouteList = (state.works || []).filter(w => w.onRoute);
    if (onRouteList.length === 0) {
      container.innerHTML = `
        <div class="app-card" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); padding: 22px 16px; border-radius: 14px; text-align: center; margin: 8px 0;">
          <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
          <h4 style="margin: 0 0 6px 0; font-size: 0.95rem; font-weight: 800; color: #34D399;">Zero Road Obstacles on Route</h4>
          <p style="margin: 0 0 14px 0; font-size: 0.78rem; color: #94A3B8; line-height: 1.4;">
            All carriage lanes toward <strong>${escapeHtml(destName)}</strong> are clear! No civic excavations, stormwater trenches, or pipeline cuts intersect this route.
          </p>
          <button onclick="filterWorksCategory('ALL')" style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.18); color: #E2E8F0; font-size: 0.74rem; font-weight: 700; padding: 7px 16px; border-radius: 20px; cursor: pointer;">
            Browse all ${state.works.length} Chennai civic works
          </button>
        </div>
      `;
      return;
    }
    renderWorkItems(onRouteList, container, "ON_ROUTE");
  } else if (filter === "NEAR_DEST") {
    const nearDestList = (state.works || []).filter(w => w.nearDest);
    if (nearDestList.length === 0) {
      container.innerHTML = `
        <div class="app-card" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px 16px; border-radius: 12px; text-align: center; margin: 8px 0;">
          <div style="font-size: 28px; margin-bottom: 6px;">📍</div>
          <h4 style="margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 800; color: #F8FAFC;">Destination Area Clear</h4>
          <p style="margin: 0 0 12px 0; font-size: 0.78rem; color: #94A3B8; line-height: 1.4;">
            No active civic excavations or road work reported within 2.8 km of <strong>${escapeHtml(destName)}</strong>.
          </p>
          <button onclick="filterWorksCategory('ALL')" style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.18); color: #E2E8F0; font-size: 0.74rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; cursor: pointer;">
            View all Chennai works
          </button>
        </div>
      `;
      return;
    }
    renderWorkItems(nearDestList, container, "NEAR_DEST");
  } else {
    // ALL
    const allSorted = [...(state.works || [])].sort((a, b) => (a.distFromUserKm || 0) - (b.distFromUserKm || 0));
    renderWorkItems(allSorted, container, "ALL");
  }
}

function renderWorkItems(items, container, filterMode) {
  container.innerHTML = items.map(w => {
    const isClosed = w.impact_level === "ROAD_FULLY_CLOSED";
    const impactColor = isClosed ? "#DC2626" : "#D97706";
    let locationBadge = "";

    if (w.onRoute) {
      locationBadge = `<span style="background: rgba(239, 68, 68, 0.2); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.4); font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 6px;">⚠️ ON YOUR ROUTE (~${Math.round((w.distToRouteKm || 0) * 1000)}m)</span>`;
    } else if (w.nearDest) {
      locationBadge = `<span style="background: rgba(14, 165, 233, 0.2); color: #38BDF8; border: 1px solid rgba(14, 165, 233, 0.4); font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 6px;">📍 Near Destination (${(w.distToDestKm || 0).toFixed(1)} km)</span>`;
    } else {
      locationBadge = `<span style="background: rgba(148, 163, 184, 0.15); color: #94A3B8; font-size: 0.68rem; padding: 2px 7px; border-radius: 6px;">${(w.distFromUserKm || 0).toFixed(1)} km from GPS</span>`;
    }

    return `
      <div class="subway-card" style="border-left: 4px solid ${impactColor}; margin-bottom: 10px; background: rgba(30, 41, 59, 0.7); border-radius: 12px; padding: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px;">
              ${locationBadge}
              <span style="font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; background: ${impactColor}22; color: ${impactColor}; border: 1px solid ${impactColor}44;">
                ${escapeHtml(w.impact_level.replace(/_/g, " "))}
              </span>
            </div>
            <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #F8FAFC;">🚧 ${escapeHtml(w.work_title)}</h4>
            <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 2px;">📍 ${escapeHtml(w.road_name)} (${escapeHtml(w.area_name)})</div>
          </div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 8px 10px; border-radius: 8px; font-size: 0.75rem; color: #CBD5E1; margin-bottom: 8px;">
          <div><strong>Type:</strong> ${escapeHtml(w.work_type.replace(/_/g, " "))}</div>
          <div style="margin-top: 4px; color: #E2E8F0;">${escapeHtml(w.description || 'Active road work. Slow down and follow signage.')}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button onclick="upvoteWork(${w.id})" style="background: rgba(217, 119, 6, 0.2); color: #F59E0B; border: 1px solid rgba(217, 119, 6, 0.3); padding: 5px 12px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
            👍 Confirm Road Work (${w.upvotes})
          </button>
          <span style="font-size: 0.7rem; color: #64748B;">Source: ${escapeHtml(w.reported_by || 'CITIZEN')}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderCanalsList() {
  const container = document.getElementById("canalsAppList");
  if (!container) return;

  container.innerHTML = state.canals.map(c => `
    <div class="subway-card" style="border-left: 4px solid #0284C7; margin-bottom: 10px; background: rgba(30, 41, 59, 0.7); border-radius: 12px; padding: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #F8FAFC;">🌊 ${c.name}</h4>
        <span style="font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: rgba(14, 165, 233, 0.2); color: #0EA5E9;">
          ${c.water_level_percent}% Level
        </span>
      </div>
      <div style="font-size: 0.75rem; color: #94A3B8;">📍 Catchment: ${c.catchment_area}</div>
      <div style="font-size: 0.75rem; color: #CBD5E1; margin-top: 4px;">${c.flow_rate_desc}</div>
    </div>
  `).join("");
}

function renderReportsList() {
  const container = document.getElementById("reportsAppList");
  if (!container) return;

  container.innerHTML = state.reports.map(r => `
    <div class="subway-card" style="border-left: 4px solid #F59E0B; margin-bottom: 10px; background: rgba(30, 41, 59, 0.7); border-radius: 12px; padding: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: #F8FAFC;">📍 ${r.road_name}</h4>
        <span style="font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: rgba(245, 158, 11, 0.2); color: #F59E0B;">
          ${r.depth_level.replace(/_/g, " ")} (${r.depth_inches}")
        </span>
      </div>
      <div style="font-size: 0.75rem; color: #94A3B8;">Area: <strong>${r.area_name}</strong></div>
      <div style="font-size: 0.75rem; color: #CBD5E1; margin-top: 4px;">${r.description}</div>
      <button onclick="upvoteReport(${r.id})" style="margin-top: 8px; background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); padding: 5px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
        👍 Upvote Report (${r.upvotes})
      </button>
    </div>
  `).join("");
}

function renderEmergencySheet() {
  const container = document.getElementById("emergencyContactsSheet");
  if (!container) return;

  container.innerHTML = state.contacts.map(c => `
    <div class="emergency-card">
      <div class="em-left">
        <div class="em-org">${c.organization}</div>
        <div class="em-purp">${c.purpose}</div>
      </div>
      <a href="tel:${c.helpline.replace(/[^0-9]/g, '')}" class="btn-call-helpline">
        <i class="fa-solid fa-phone"></i> ${c.helpline}
      </a>
    </div>
  `).join("");
}

// 11. INTERACTION LISTENERS & TAB CONTROLLER
function initInteractions() {
  // 1. Bottom Sheet Tab Switcher (FIXED SELECTOR)
  document.querySelectorAll(".sheet-tab").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".sheet-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));

      tabBtn.classList.add("active");
      const targetId = tabBtn.getAttribute("data-target");
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add("active");
      }

      // Expand sheet so the user can easily see the tab content
      const sheet = document.getElementById("bottomSheet");
      if (sheet) {
        sheet.classList.remove("state-peek");
        if (!sheet.classList.contains("state-full")) {
          sheet.classList.add("state-half");
        }
      }
    });
  });

  // 2. Bottom Sheet Handle & Peek Bar Expand/Collapse
  const sheet = document.getElementById("bottomSheet");
  const handle = document.getElementById("sheetDragHandle");
  const peekBar = document.getElementById("sheetPeekBar");

  function toggleSheetState() {
    if (!sheet) return;
    if (sheet.classList.contains("state-peek")) {
      sheet.classList.remove("state-peek");
      sheet.classList.add("state-half");
    } else if (sheet.classList.contains("state-half")) {
      sheet.classList.remove("state-half");
      sheet.classList.add("state-full");
    } else {
      sheet.classList.remove("state-full");
      sheet.classList.add("state-half");
    }
  }

  handle?.addEventListener("click", toggleSheetState);
  peekBar?.addEventListener("click", (e) => {
    if (e.target.closest("#btnStartDrive")) return;
    toggleSheetState();
  });

  // 3. Subway Filter Pills
  document.querySelectorAll(".filter-pill[data-subway-filter]").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill[data-subway-filter]").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.activeSubwayFilter = pill.getAttribute("data-subway-filter");
      renderSubwaysList();
    });
  });

  // 4. "Report Work" button inside tabWorks
  document.getElementById("btnAddWorkReport")?.addEventListener("click", () => {
    openWorkActionSheet(state.userLocation.lat, state.userLocation.lng);
  });

  // 5. Vehicle Switcher
  document.querySelectorAll(".v-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".v-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.vehicle = btn.getAttribute("data-v");
      renderMapLayers();
      recalcCurrentRoute();
      showToast(`Vehicle mode: ${VEHICLE_CONFIG[state.vehicle].name}`, "info");
    });
  });

  // 6. GPS Button
  document.getElementById("btnUseLiveGps")?.addEventListener("click", () => {
    requestUserGeolocation();
  });

  // 7. Pick on Map
  document.getElementById("btnPickOnMap")?.addEventListener("click", () => {
    state.isMapPickMode = true;
    showToast("📍 Tap anywhere on Chennai map to set destination pin", "info");
  });

  // 8. Destination Search Modal Triggers
  document.getElementById("destBoxTrigger")?.addEventListener("click", () => {
    document.getElementById("destinationModal").style.display = "flex";
    document.getElementById("destSearchInput").focus();
  });

  document.getElementById("btnCloseDestModal")?.addEventListener("click", () => {
    document.getElementById("destinationModal").style.display = "none";
  });

  document.getElementById("destSearchInput")?.addEventListener("input", (e) => {
    renderDestinationSuggestions(e.target.value);
  });

  // 9. Weather Modal Triggers
  document.getElementById("weatherPill")?.addEventListener("click", openWeatherModal);
  document.getElementById("btnOpenWeatherModal")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openWeatherModal();
  });
  document.getElementById("btnCloseWeatherModal")?.addEventListener("click", closeWeatherModal);

  // 10. View Mode Toggle (Phone Simulator vs Full Screen)
  document.getElementById("btnToggleViewMode")?.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("mode-fullscreen");
    body.classList.toggle("mode-simulator");
    state.viewMode = body.classList.contains("mode-simulator") ? "simulator" : "fullscreen";
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 300);
  });

  // 11. Navigation Drive Mode
  document.getElementById("btnStartDrive")?.addEventListener("click", startNavigationMode);
  document.getElementById("btnExitDrive")?.addEventListener("click", exitNavigationMode);

  // 12. Floating Action Buttons (FABs)
  document.getElementById("btnFabLocate")?.addEventListener("click", () => {
    if (state.userLocation.isLive) {
      state.map.setView([state.userLocation.lat, state.userLocation.lng], 14);
    } else {
      state.map.setView([13.0400, 80.2250], 12);
    }
  });

  document.getElementById("btnFabSos")?.addEventListener("click", () => {
    document.getElementById("emergencyActionSheet").style.display = "flex";
  });

  document.getElementById("btnCloseEmergencySheet")?.addEventListener("click", () => {
    document.getElementById("emergencyActionSheet").style.display = "none";
  });

  document.getElementById("btnFabReport")?.addEventListener("click", () => {
    openReportActionSheet(state.userLocation.lat, state.userLocation.lng);
  });

  document.getElementById("btnCloseReportSheet")?.addEventListener("click", () => {
    document.getElementById("reportActionSheet").style.display = "none";
  });

  document.getElementById("btnFabWork")?.addEventListener("click", () => {
    openWorkActionSheet(state.userLocation.lat, state.userLocation.lng);
  });

  document.getElementById("btnCloseWorkSheet")?.addEventListener("click", () => {
    document.getElementById("workActionSheet").style.display = "none";
  });

  // 13. Form Submissions
  document.getElementById("mobileReportForm")?.addEventListener("submit", handleReportSubmit);
  document.getElementById("mobileWorkForm")?.addEventListener("submit", handleWorkSubmit);
}

function openReportActionSheet(lat, lng) {
  document.getElementById("mobReportLat").value = lat;
  document.getElementById("mobReportLng").value = lng;
  document.getElementById("reportActionSheet").style.display = "flex";
}

function openWorkActionSheet(lat, lng) {
  document.getElementById("workLat").value = lat;
  document.getElementById("workLng").value = lng;
  document.getElementById("workActionSheet").style.display = "flex";
}

async function handleReportSubmit(e) {
  e.preventDefault();
  const area = document.getElementById("mobReportArea").value;
  const road = document.getElementById("mobReportRoad").value;
  const depthLevel = document.querySelector('input[name="mobDepth"]:checked').value;
  const notes = document.getElementById("mobReportNotes").value;
  const lat = parseFloat(document.getElementById("mobReportLat").value);
  const lng = parseFloat(document.getElementById("mobReportLng").value);

  const depthMap = {
    ANKLE_DEEP: 3.5,
    CALF_DEEP: 7.0,
    KNEE_DEEP: 14.0,
    WAIST_DEEP_SUBMERGED: 24.0
  };

  try {
    const res = await fetch(`${API}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area_name: area,
        road_name: road,
        latitude: lat,
        longitude: lng,
        depth_level: depthLevel,
        depth_inches: depthMap[depthLevel] || 6.0,
        passable_vehicles: ["bus"],
        hazard_tags: ["waterlog"],
        description: notes || "Citizen reported road water depth.",
        reporter_role: "CITIZEN"
      })
    });

    if (res.ok) {
      showToast("✅ Flood report broadcasted to Chennai!", "success");
      document.getElementById("reportActionSheet").style.display = "none";
      fetchInitialData();
    }
  } catch (err) {
    showToast("Failed to submit report.", "warning");
  }
}

async function handleWorkSubmit(e) {
  e.preventDefault();
  const area = document.getElementById("workArea").value;
  const road = document.getElementById("workRoad").value;
  const workType = document.getElementById("workTypeSelect").value;
  const impact = document.getElementById("workImpactSelect").value;
  const desc = document.getElementById("workDesc").value;
  const lat = parseFloat(document.getElementById("workLat").value);
  const lng = parseFloat(document.getElementById("workLng").value);

  try {
    const res = await fetch(`${API}/works`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area_name: area,
        road_name: road,
        latitude: lat,
        longitude: lng,
        work_type: workType,
        work_title: document.getElementById("workTypeSelect").selectedOptions[0].text.substring(2).trim(),
        impact_level: impact,
        description: desc || "Active civic obstacle reported.",
        reported_by: "CITIZEN"
      })
    });

    if (res.ok) {
      showToast("🚧 Road work alert broadcasted live in real time!", "success");
      document.getElementById("workActionSheet").style.display = "none";
      const latestWorks = await fetch(`${API}/works`).then(r => r.json());
      state.works = latestWorks;
      updateWorksProximityAndBadges();
      renderWorksList();
      renderMapLayers();
      recalcCurrentRoute();
    }
  } catch (err) {
    showToast("Failed to broadcast road work.", "warning");
  }
}

async function upvoteSubway(id) {
  try {
    const res = await fetch(`${API}/subways/${id}/upvote`, { method: "POST" });
    if (res.ok) {
      showToast("👍 Verified subway status!", "success");
      fetchInitialData();
    }
  } catch (e) {}
}

async function upvoteWork(id) {
  try {
    const res = await fetch(`${API}/works/${id}/upvote`, { method: "POST" });
    if (res.ok) {
      showToast("👍 Upvoted road work!", "success");
      fetchInitialData();
    }
  } catch (e) {}
}

async function upvoteReport(id) {
  try {
    const res = await fetch(`${API}/reports/${id}/vote?vote_type=upvote`, { method: "POST" });
    if (res.ok) {
      showToast("👍 Upvoted report!", "success");
      fetchInitialData();
    }
  } catch (e) {}
}

function startNavigationMode() {
  state.isNavigating = true;
  document.getElementById("activeNavHud").style.display = "block";
  document.getElementById("activeDriveBar").style.display = "flex";
  document.getElementById("bottomSheet").style.display = "none";

  const data = state.activeRouteData;
  if (!data) return;

  const route = (state.weather.subways_flooded && !data.standard_route.passable_for_vehicle)
    ? data.monsoon_safe_route
    : data.standard_route;

  document.getElementById("driveRemainingDist").innerText = `${route.total_distance_km} KM`;
  document.getElementById("driveEtaText").innerText = `~${route.estimated_duration_mins} MIN`;

  const firstStep = route.steps[0];
  if (firstStep) {
    document.getElementById("navManeuverText").innerText = firstStep.instruction;
    document.getElementById("navManeuverDist").innerText = `In ${firstStep.distance_meters}m`;
  }
}

function exitNavigationMode() {
  state.isNavigating = false;
  document.getElementById("activeNavHud").style.display = "none";
  document.getElementById("activeDriveBar").style.display = "none";
  document.getElementById("bottomSheet").style.display = "flex";
}

function showToast(msg, type = "info") {
  const hub = document.getElementById("toastHub");
  if (!hub) return;

  const toast = document.createElement("div");
  toast.className = `app-toast toast-${type}`;
  toast.innerHTML = msg;
  hub.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// 14. REAL-TIME LIVE SYNC ENGINE (POLLING & BROADCASTS)
function startRealTimeSync() {
  if (state.liveSyncTimer) clearInterval(state.liveSyncTimer);
  state.liveSyncTimer = setInterval(async () => {
    try {
      const [latestWorks, latestReports] = await Promise.all([
        fetch(`${API}/works`).then(r => r.json()),
        fetch(`${API}/reports`).then(r => r.json())
      ]);
      state.works = latestWorks;
      state.reports = latestReports;
      updateWorksProximityAndBadges();
      const worksTab = document.getElementById("tabWorks");
      if (worksTab && worksTab.classList.contains("active")) {
        renderWorksList();
      }
      const reportsTab = document.getElementById("tabReports");
      if (reportsTab && reportsTab.classList.contains("active")) {
        renderReportsList();
      }
    } catch (e) {
      // Background poll fail-safe
    }
  }, 5000);
}
