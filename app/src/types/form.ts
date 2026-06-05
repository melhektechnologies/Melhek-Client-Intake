export interface CompanyInfo {
  companyName: string;
  industry: string;
  contactPerson: string;
  position: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  socialMedia: string;
}

export interface BusinessOverview {
  description: string;
  productsServices: string;
  targetCustomers: string;
  geographicMarket: string;
  competitors: string;
  goals: string;
}

export interface ProjectType {
  selected: string[];
  otherDescription: string;
}

export interface ProjectGoals {
  why: string;
  problem: string;
  success: string;
}

export interface RequiredFeatures {
  selected: string[];
  customFeatures: string;
}

export interface DesignPreferences {
  logoFiles: File[];
  brandGuidelines: File[];
  colors: string[];
  exampleWebsites: string;
  style: string[];
}

export interface ContentItem {
  checked: boolean;
  needsHelp: boolean;
  details: string;
}

export interface ContentAvailability {
  logo: ContentItem;
  images: ContentItem;
  videos: ContentItem;
  productInfo: ContentItem;
  serviceInfo: ContentItem;
  companyProfile: ContentItem;
  testimonials: ContentItem;
  legalContent: ContentItem;
  additionalNotes: string;
}

export interface TechnicalRequirements {
  domain: string;
  domainName: string;
  hosting: string;
  hostingProvider: string;
  email: string;
  integrations: string[];
  customIntegration: string;
}

export interface TimelineBudget {
  launchDate: string;
  urgency: string;
  budgetRange: string;
  budgetContext: string;
}

export interface StrategicIntelligence {
  challenges: string;
  manualProcesses: string;
  automate: string;
  growth: string;
  bottlenecks: string;
}

export interface FormData {
  companyInfo: CompanyInfo;
  businessOverview: BusinessOverview;
  projectType: ProjectType;
  projectGoals: ProjectGoals;
  requiredFeatures: RequiredFeatures;
  designPreferences: DesignPreferences;
  contentAvailability: ContentAvailability;
  technicalRequirements: TechnicalRequirements;
  timelineBudget: TimelineBudget;
  strategicIntelligence: StrategicIntelligence;
}

export const defaultFormData: FormData = {
  companyInfo: {
    companyName: '',
    industry: '',
    contactPerson: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    socialMedia: '',
  },
  businessOverview: {
    description: '',
    productsServices: '',
    targetCustomers: '',
    geographicMarket: '',
    competitors: '',
    goals: '',
  },
  projectType: {
    selected: [],
    otherDescription: '',
  },
  projectGoals: {
    why: '',
    problem: '',
    success: '',
  },
  requiredFeatures: {
    selected: [],
    customFeatures: '',
  },
  designPreferences: {
    logoFiles: [],
    brandGuidelines: [],
    colors: ['#6F4E37'],
    exampleWebsites: '',
    style: [],
  },
  contentAvailability: {
    logo: { checked: false, needsHelp: false, details: '' },
    images: { checked: false, needsHelp: false, details: '' },
    videos: { checked: false, needsHelp: false, details: '' },
    productInfo: { checked: false, needsHelp: false, details: '' },
    serviceInfo: { checked: false, needsHelp: false, details: '' },
    companyProfile: { checked: false, needsHelp: false, details: '' },
    testimonials: { checked: false, needsHelp: false, details: '' },
    legalContent: { checked: false, needsHelp: false, details: '' },
    additionalNotes: '',
  },
  technicalRequirements: {
    domain: '',
    domainName: '',
    hosting: '',
    hostingProvider: '',
    email: '',
    integrations: [],
    customIntegration: '',
  },
  timelineBudget: {
    launchDate: '',
    urgency: '',
    budgetRange: '',
    budgetContext: '',
  },
  strategicIntelligence: {
    challenges: '',
    manualProcesses: '',
    automate: '',
    growth: '',
    bottlenecks: '',
  },
};

export type FormSection = keyof FormData;
