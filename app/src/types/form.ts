// ─── Section 1: Business Information ─────────────────────────────────────────
export interface BusinessInfo {
  businessName: string;
  industry: string;
  businessType: string;
  branches: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  contactPerson: string;
  position: string;
  phone: string;
  email: string;
}

// ─── Section 2: Business Overview ────────────────────────────────────────────
export interface BusinessOverview {
  yearsInOperation: string;
  totalEmployees: string;
  cashiers: string;
  managers: string;
  storekeepers: string;
  dailyCustomers: string;
  monthlySalesRange: string;
  productsServices: string;
  businessGoals: string;
}

// ─── Section 3: Current Workflow ──────────────────────────────────────────────
export interface CurrentWorkflow {
  purchasing: string;
  stockArrival: string;
  stockRecording: string;
  stockUpdates: string;
  salesProcess: string;
  receipts: string;
  purchaseApprovals: string;
  returns: string;
  damagedItems: string;
  inventoryCorrections: string;
  monthEndCounting: string;
  yearEndCounting: string;
}

// ─── Section 4: Inventory ─────────────────────────────────────────────────────
export interface Inventory {
  approximateProducts: string;
  categories: string;
  unitsOfMeasurement: string;
  barcodes: string;
  supplierCodes: string;
  warehouseLocations: string;
  multipleBranches: string;
  weeklyStockArrivals: string;
  fastMovingProducts: string;
  slowMovingProducts: string;
  difficultToTrack: string;
}

// ─── Section 5: Current Software ──────────────────────────────────────────────
export interface CurrentSoftware {
  posSystem: string;
  inventorySoftware: string;
  accountingSoftware: string;
  usesExcel: boolean;
  paperRecords: boolean;
  cloudStorage: string;
  exportCapabilities: string[];
  canPosIntegrate: string;
}

// ─── Section 6: Business Challenges ──────────────────────────────────────────
export interface BusinessChallenges {
  timeWaste: string;
  inventoryChallenge: string;
  salesChallenge: string;
  employeeMistakes: string;
  recurringProblem: string;
  moneyLoss: string;
  timeLoss: string;
  frustration: string;
  customerImpact: string;
}

// ─── Section 7: Reporting & Decision Making ──────────────────────────────────
export interface Reporting {
  selectedReports: string[];
  morningInformation: string;
}

// ─── Section 8: Security & User Roles ────────────────────────────────────────
export interface SecurityRoles {
  userRoles: string[];
  samePermissions: string;
  stockAdjustmentApprover: string;
  priceChangeApprover: string;
  deleteRecordsApprover: string;
}

// ─── Section 9: Project Goals ─────────────────────────────────────────────────
export interface ProjectGoals {
  whyNow: string;
  successDefinition: string;
  topImprovements: string;
  manualWorkToEliminate: string;
  ifNothingChanges: string;
}

// ─── Section 10: Project Qualification ───────────────────────────────────────
export interface ProjectQualification {
  urgency: string;
  decisionMaker: string;
  budgetAllocated: string;
  investmentRange: string;
  spokenToVendor: string;
  vendorProposal: string;
}

// ─── Section 11: Additional Notes ────────────────────────────────────────────
export interface AdditionalNotes {
  notes: string;
}

// ─── Unified FormData ─────────────────────────────────────────────────────────
export interface FormData {
  businessInfo: BusinessInfo;
  businessOverview: BusinessOverview;
  currentWorkflow: CurrentWorkflow;
  inventory: Inventory;
  currentSoftware: CurrentSoftware;
  businessChallenges: BusinessChallenges;
  reporting: Reporting;
  securityRoles: SecurityRoles;
  projectGoals: ProjectGoals;
  projectQualification: ProjectQualification;
  additionalNotes: AdditionalNotes;
}

export type FormSection = keyof FormData;

// ─── Default Values ────────────────────────────────────────────────────────────
export const defaultFormData: FormData = {
  businessInfo: {
    businessName: '',
    industry: '',
    businessType: '',
    branches: '1',
    address: '',
    website: '',
    facebook: '',
    instagram: '',
    contactPerson: '',
    position: '',
    phone: '',
    email: '',
  },
  businessOverview: {
    yearsInOperation: '',
    totalEmployees: '',
    cashiers: '',
    managers: '',
    storekeepers: '',
    dailyCustomers: '',
    monthlySalesRange: '',
    productsServices: '',
    businessGoals: '',
  },
  currentWorkflow: {
    purchasing: '',
    stockArrival: '',
    stockRecording: '',
    stockUpdates: '',
    salesProcess: '',
    receipts: '',
    purchaseApprovals: '',
    returns: '',
    damagedItems: '',
    inventoryCorrections: '',
    monthEndCounting: '',
    yearEndCounting: '',
  },
  inventory: {
    approximateProducts: '',
    categories: '',
    unitsOfMeasurement: '',
    barcodes: '',
    supplierCodes: '',
    warehouseLocations: '',
    multipleBranches: '',
    weeklyStockArrivals: '',
    fastMovingProducts: '',
    slowMovingProducts: '',
    difficultToTrack: '',
  },
  currentSoftware: {
    posSystem: '',
    inventorySoftware: '',
    accountingSoftware: '',
    usesExcel: false,
    paperRecords: false,
    cloudStorage: '',
    exportCapabilities: [],
    canPosIntegrate: '',
  },
  businessChallenges: {
    timeWaste: '',
    inventoryChallenge: '',
    salesChallenge: '',
    employeeMistakes: '',
    recurringProblem: '',
    moneyLoss: '',
    timeLoss: '',
    frustration: '',
    customerImpact: '',
  },
  reporting: {
    selectedReports: [],
    morningInformation: '',
  },
  securityRoles: {
    userRoles: [],
    samePermissions: '',
    stockAdjustmentApprover: '',
    priceChangeApprover: '',
    deleteRecordsApprover: '',
  },
  projectGoals: {
    whyNow: '',
    successDefinition: '',
    topImprovements: '',
    manualWorkToEliminate: '',
    ifNothingChanges: '',
  },
  projectQualification: {
    urgency: '',
    decisionMaker: '',
    budgetAllocated: '',
    investmentRange: '',
    spokenToVendor: '',
    vendorProposal: '',
  },
  additionalNotes: {
    notes: '',
  },
};
