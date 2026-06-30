/* ================================================================
   นิ่มซี่เส็งขนส่ง 1988 — NSS Data Model (Single Source of Truth)
   Phase A: tripCostItems · allocationGroups · goldenManifest · sampleOrders
   ================================================================ */

const NSS_COMPANY_DATA = {
  companyName: 'บริษัท นิ่มซี่เส็งขนส่ง 1988 จำกัด',

  defaultRoute: {
    id: 'CNX-MHN',
    name: 'เชียงใหม่ → สี่แยกมหานาค',
    origin: 'เชียงใหม่',
    destination: 'สี่แยกมหานาค',
    distanceKm: 720.0,
  },

  vehicles: [
    { id: '10W-REF', name: 'รถ 10 ล้อตู้เย็น', fuelLitersPerTrip: 194.59, maxPayloadTons: 15 },
    { id: '6W', name: 'รถ 6 ล้อ', fuelLitersPerTrip: 120.0, maxPayloadTons: 8 },
    { id: '18W', name: 'รถ 18 ล้อ', fuelLitersPerTrip: 280.0, maxPayloadTons: 25 },
  ],

  get defaultVehicle() {
    return this.vehicles[0];
  },

  dieselPrice: { min: 31.0, max: 33.0, default: 32.0 },

  /* ── Cost buckets — Slide ① (ภาพกว้าง: ผันแปร vs คงที่) ── */
  costLevels: {
    trip: {
      id: 'trip',
      label: 'ผันแปร',
      subtitle: 'เกิดตามจริง · จากใบเบิก',
      accent: '#39bf45',
      icon: '🚛',
    },
    period: {
      id: 'period',
      label: 'คงที่',
      subtitle: 'ค่าใช้จ่ายรายเดือน',
      accent: '#458fff',
      icon: '📅',
    },
  },

  /* ── All cost items with level + future allocation group ── */
  tripCostItems: [
    { id: 'fuel_travel', name: 'ค่าน้ำมันเดินทาง', level: 'trip', allocationGroup: 'trip', exampleAmount: 5800, note: 'เงินสด / บิลน้ำมัน' },
    { id: 'fuel_fleet', name: 'ค่าน้ำมัน Fleet Card', level: 'trip', allocationGroup: 'trip', exampleAmount: 427, note: null },
    { id: 'allowance_driver', name: 'เบี้ยเลี้ยง พขร.', level: 'trip', allocationGroup: 'trip', exampleAmount: 1000, note: null },
    { id: 'allowance_backup', name: 'เบี้ยเลี้ยง พขร. สำรอง', level: 'trip', allocationGroup: 'trip', exampleAmount: 200, note: null },
    { id: 'toll', name: 'ค่าทางด่วน', level: 'trip', allocationGroup: 'trip', exampleAmount: 950, note: null },
    { id: 'port', name: 'ค่าเข้าท่าเรือ', level: 'trip', allocationGroup: 'trip', exampleAmount: 700, note: null },
    { id: 'container_return', name: 'ค่าธรรมเนียมคืนตู้', level: 'trip', allocationGroup: 'trip', exampleAmount: 550, note: null },
    { id: 'tarpaulin', name: 'ค่าปิดเปิดผ้าใบ', level: 'trip', allocationGroup: 'trip', exampleAmount: 600, note: null },
    { id: 'repair_trip', name: 'ค่าซ่อมเที่ยว', level: 'trip', allocationGroup: 'trip', exampleAmount: 0, note: 'ถ้ามี' },
    { id: 'dispatch_salary', name: 'เงินเดือนฝ่ายจัดรถ', level: 'period', allocationGroup: 'abc', exampleAmount: 60000, note: '฿/เดือน' },
    { id: 'vehicle_lease', name: 'ค่าเช่า / ค่าเสื่อมรถ', level: 'period', allocationGroup: 'abc', exampleAmount: 150000, note: '฿/เดือน' },
    { id: 'insurance', name: 'ประกันภัย', level: 'period', allocationGroup: 'abc', exampleAmount: 25000, note: '฿/เดือน' },
    { id: 'maintenance_pool', name: 'ค่าซ่อมบำรุง (pool)', level: 'period', allocationGroup: 'abc', exampleAmount: 35000, note: '฿/เดือน' },
    { id: 'office_overhead', name: 'ค่าใช้จ่ายสำนักงาน', level: 'period', allocationGroup: 'abc', exampleAmount: 10000, note: '฿/เดือน' },
    { id: 'special_delivery', name: 'ค่าจัดส่งพิเศษ', level: 'order', allocationGroup: 'direct', exampleAmount: null, note: 'ต่อ bill' },
    { id: 'goods_insurance', name: 'ค่าประกันสินค้า', level: 'order', allocationGroup: 'direct', exampleAmount: null, note: 'ต่อ bill' },
    { id: 'cod_fee', name: 'ค่า COD', level: 'order', allocationGroup: 'direct', exampleAmount: null, note: 'ต่อ bill' },
  ],

  /* ── Allocation groups (Slide ② — prepared) ── */
  allocationGroups: {
    direct: {
      id: 'direct',
      label: 'A · แยกได้เลย',
      shortLabel: 'Direct',
      color: '#39bf45',
      description: 'เก็บตอนสร้าง order · ไม่ต้องปันส่วน',
      driver: null,
    },
    trip: {
      id: 'trip',
      label: 'B · ปันส่วนจากเที่ยว',
      shortLabel: 'Trip',
      color: '#ea580c',
      description: 'แบ่งจาก manifest · driver = น้ำหนัก / ton-km',
      driver: 'weight',
    },
    abc: {
      id: 'abc',
      label: 'C · ปันส่วนรายเดือน (ABC)',
      shortLabel: 'ABC',
      color: '#458fff',
      description: 'แบ่งจาก cost pool · driver = activity',
      driver: 'activity',
    },
  },

  allocationGroupOrder: ['direct', 'trip', 'abc'],

  /* ── Scatter layout — shared by Slide ① cloud & Slide ② entry animation ── */
  scatterLayout: {
    fuel_travel:       { x: 8,  y: 12, r: -6,  delay: 0 },
    fuel_fleet:        { x: 62, y: 6,  r: 4,   delay: 0.3 },
    allowance_driver:  { x: 28, y: 28, r: -3,  delay: 0.6 },
    allowance_backup:  { x: 78, y: 22, r: 7,   delay: 0.2 },
    toll:              { x: 45, y: 18, r: -5,  delay: 0.8 },
    port:              { x: 15, y: 48, r: 3,   delay: 0.4 },
    container_return:  { x: 55, y: 42, r: -8,  delay: 0.5 },
    tarpaulin:         { x: 82, y: 38, r: 5,   delay: 0.7 },
    repair_trip:       { x: 35, y: 55, r: -4,  delay: 0.9 },
    dispatch_salary:   { x: 68, y: 52, r: 6,   delay: 0.1 },
    vehicle_lease:     { x: 5,  y: 68, r: -7,  delay: 0.55 },
    insurance:         { x: 38, y: 72, r: 2,   delay: 0.35 },
    maintenance_pool:  { x: 72, y: 65, r: -3,  delay: 0.65 },
    office_overhead:   { x: 88, y: 78, r: 8,   delay: 0.45 },
    special_delivery:  { x: 22, y: 82, r: -5,  delay: 0.75 },
    goods_insurance:   { x: 52, y: 88, r: 4,   delay: 0.15 },
    cod_fee:           { x: 75, y: 85, r: -6,  delay: 0.85 },
  },

  /* ── Slide 3 demo bills ── */
  allocationDemoBills: [
    { id: 'LTL-12345', weightKg: 350 },
    { id: 'LTL-12389', weightKg: 1200 },
    { id: 'LTL-12401', weightKg: 80 },
  ],

  /* ── Golden Manifest (Slides ③–④ — prepared) ── */
  goldenManifest: {
    id: 'M-2024-0892',
    routeId: 'CNX-MHN',
    vehicleId: '10W-REF',
    totalWeightKg: 12000,
    billCount: 45,
    revenue: 42000,
    tripCosts: {
      fuel: 6226.88,
      allowance: 1200,
      siteFees: 2800,
      repair: 0,
    },
    abcConfig: {
      dispatchSalary: 60000,
      manifestCountPerMonth: 120,
    },
    get tripCostTotal() {
      const t = this.tripCosts;
      return t.fuel + t.allowance + t.siteFees + t.repair;
    },
    get loadFactor() {
      const veh = NSS_COMPANY_DATA.vehicles.find((v) => v.id === this.vehicleId);
      return veh ? this.totalWeightKg / 1000 / veh.maxPayloadTons : 0;
    },
    get dispatchRatePerManifest() {
      return this.abcConfig.dispatchSalary / this.abcConfig.manifestCountPerMonth;
    },
  },

  /* ── Sample orders (Slide ④ — prepared) ── */
  sampleOrders: [
    { id: 'LTL-12345', province: 'กรุงเทพ', productCategory: 'อาหาร', weightKg: 350, revenue: 980, directCost: 0 },
    { id: 'LTL-12389', province: 'กรุงเทพ', productCategory: 'อาหาร', weightKg: 1200, revenue: 3200, directCost: 0 },
    { id: 'LTL-12401', province: 'นครสวรรค์', productCategory: 'สินค้าทั่วไป', weightKg: 80, revenue: 450, directCost: 50 },
    { id: 'LTL-12455', province: 'พระนครศรีอยุธยา', productCategory: 'อาหาร', weightKg: 520, revenue: 1400, directCost: 0 },
    { id: 'LTL-12478', province: 'กรุงเทพ', productCategory: 'สินค้าทั่วไป', weightKg: 210, revenue: 620, directCost: 0 },
    { id: 'LTL-12502', province: 'ลพบุรี', productCategory: 'อาหาร', weightKg: 890, revenue: 2350, directCost: 0 },
    { id: 'LTL-12519', province: 'นครสวรรค์', productCategory: 'อาหาร', weightKg: 640, revenue: 1680, directCost: 0 },
    { id: 'LTL-12533', province: 'กรุงเทพ', productCategory: 'สินค้าทั่วไป', weightKg: 1500, revenue: 4100, directCost: 0 },
  ],

  /* ── Legacy: cost categories (dashboard + slide 2 placeholder) ── */
  costCategories: {
    fuel: {
      title: 'น้ำมัน & พลังงาน',
      accent: '#458fff',
      items: [
        'ค่าน้ำมันเดินทาง (เงินสด)',
        'ค่าน้ำมันขาล่อง (บิลน้ำมัน)',
        'ค่าน้ำมัน Fleet Card',
        'น้ำมันนอกเส้นทาง / รถวิ่งอ้อม',
        'ค่าแก๊สเดินทาง',
      ],
    },
    allowance: {
      title: 'เบี้ยเลี้ยง',
      accent: '#ea580c',
      items: ['เบี้ยเลี้ยง พขร.', 'เบี้ยเลี้ยง พขร. สำรอง', 'เบี้ยเลี้ยงนอกเส้นทาง'],
    },
    siteFees: {
      title: 'หน้างาน & ค่าธรรมเนียม',
      accent: '#d9a441',
      items: [
        'ค่าธรรมเนียมคืนตู้',
        'ค่าเข้าท่าเรือ',
        'ค่าทางด่วน',
        'ค่าปิดเปิดผ้าใบเทเลอร์',
        'ค่าซ่อมแซม (แยกรายอู่)',
      ],
    },
  },

  workflowDocs: [
    {
      step: 1,
      title: 'สร้าง Order (LTL)',
      doc: 'บิลขนส่งสินค้า LTL (รายชิ้น)',
      staff: 'พนักงานหน้าร้าน / ระบบคีย์บิล',
      keys: ['หัวบิล: เลขที่บิล, ต้นทาง, ปลายทาง, สายกระจาย, เงินสด/เงินเชื่อ', 'รายละเอียดบิล: ชื่อสินค้า, น้ำหนักรวม, จำนวนหน่วย, กว้าง×ยาว×สูง'],
      tables: ['bill_header', 'bill_detail'],
    },
    {
      step: 2,
      title: 'จัด Manifest',
      doc: 'เลขที่ใบรายการ (Manifest ID)',
      staff: 'ฝ่ายจัดรถ / Dispatch',
      keys: ['ผูกบิล LTL → Manifest ID', 'ระบุสาย เชียงใหม่–มหานาค', 'เลือกประเภทรถ (10 ล้อตู้เย็น)'],
      tables: ['manifests', 'manifest_bills'],
    },
    {
      step: 3,
      title: 'เบิกค่าใช้จ่ายเที่ยว',
      doc: 'ใบเบิกค่าเดินทาง',
      staff: 'พขร. / ฝ่ายบัญชีหน้างาน',
      keys: ['ค่าน้ำมัน (เงินสด/บิล/Fleet Card)', 'เบี้ยเลี้ยง พขร.', 'ทางด่วน, ท่าเรือ, คืนตู้'],
      tables: ['expense_vouchers', 'fleet_card_logs'],
    },
    {
      step: 4,
      title: 'เคลียร์ & ปันส่วน',
      doc: 'สรุปต้นทุน Manifest',
      staff: 'บัญชี / ผู้บริหาร',
      keys: ['รวมต้นทุน 3 กลุ่มจากใบเบิก', 'ปันส่วนลงบิล LTL ตามน้ำหนัก', 'คำนวณ Ton-Km, CM/Trip, CM/Ton-Km'],
      tables: ['manifest_cost_summary', 'bill_cost_allocation'],
    },
  ],

  dashboardDefaults: {
    distanceKm: 720.0,
    vehicleId: '10W-REF',
    fuelLitersPerTrip: 194.59,
    dieselPricePerLiter: 32.0,
    weightTons: 12,
    maxCapacityTons: 15,
    allowanceCost: 1200,
    siteFeesCost: 2800,
    repairCost: 0,
    ltlBillCount: 45,
    revenue: 42000,
  },

  getDefaultFuelCost(liters, price) {
    return (liters || this.defaultVehicle.fuelLitersPerTrip) * (price || this.dieselPrice.default);
  },

  /* ── Helpers ── */
  getCostItemsByLevel(levelId) {
    return this.tripCostItems.filter((item) => item.level === levelId);
  },

  getAllCostChipItems() {
    return this.tripCostItems;
  },

  getScatterStyle(itemId) {
    const pos = this.scatterLayout[itemId] || { x: 50, y: 50, r: 0, delay: 0 };
    return pos;
  },

  getItemsByAllocationGroup(groupId) {
    return this.tripCostItems.filter((item) => item.allocationGroup === groupId);
  },

  getLevelTotal(levelId) {
    return this.getCostItemsByLevel(levelId).reduce((sum, item) => sum + (item.exampleAmount || 0), 0);
  },

  getSlide1Buckets() {
    return ['trip', 'period'].map((id) => ({
      id,
      meta: this.costLevels[id],
      items: this.getCostItemsByLevel(id).filter((item) => item.exampleAmount == null || item.exampleAmount > 0),
      total: this.getLevelTotal(id),
    }));
  },

  getExampleTrip() {
    const m = this.goldenManifest;
    const route = this.defaultRoute;
    const veh = this.vehicles.find((v) => v.id === m.vehicleId) || this.defaultVehicle;
    return {
      manifestId: m.id,
      route: route.name,
      distanceKm: route.distanceKm,
      vehicle: veh.name,
      weightTons: m.totalWeightKg / 1000,
      maxCapacityTons: veh.maxPayloadTons,
      loadPercent: Math.round(m.loadFactor * 100),
      billCount: m.billCount,
      revenue: m.revenue,
      tripCostTotal: m.tripCostTotal,
      periodCostTotal: this.getLevelTotal('period'),
    };
  },
};

function formatBaht(n, opts = {}) {
  if (n == null || !isFinite(n)) return '—';
  const { compact = false, decimals = 2 } = opts;
  if (compact && Math.abs(n) >= 1000) {
    return '฿' + n.toLocaleString('th-TH', { maximumFractionDigits: 0 });
  }
  return '฿' + n.toLocaleString('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
