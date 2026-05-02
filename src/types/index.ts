// Property Schema
export interface PropertyConfig {
  ref: string;
  name: string;
  tagline: string;
  address: string;
  district: string;
  propertyType: string;
  tenure: string;
  landArea?: string;
  builtUpArea?: string;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  architect?: string;
  features: string[];
  heroMedia: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
  };
  gallery: GalleryImage[];
  sections: PropertySection[];
  documents: PropertyDocument[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'exterior' | 'interior' | 'amenity' | 'view';
}

export interface PropertySection {
  id: string;
  titleKey: string;
  content: string;
  images?: string[];
}

export interface PropertyDocument {
  id: string;
  nameKey: string;
  filename: string;
  type: 'floorplan' | 'brochure' | 'title' | 'other';
  restricted: boolean;
}

// NDA Types
export interface NDASubmission {
  name: string;
  email: string;
  company?: string;
  ip: string;
  timestamp: string;
  userAgent: string;
  propertyRef: string;
}

export interface NDALog {
  submissions: NDASubmission[];
}

// Download Log Types
export interface DownloadEntry {
  filename: string;
  viewerName: string;
  viewerEmail: string;
  timestamp: string;
  ip: string;
  propertyRef: string;
}

export interface DownloadLog {
  downloads: DownloadEntry[];
}

// Lead Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  viewingDate?: string;
  source: 'calendly' | 'contact_form' | 'whatsapp';
  timestamp: string;
  propertyRef: string;
  notes?: string;
}

export interface LeadsLog {
  leads: Lead[];
}

// Analytics Types
export interface PageView {
  page: string;
  pageName: string;
  enterTime: string;
  duration: number; // seconds
}

export interface VisitorEntry {
  sessionId: string;
  visitorId: string;
  name: string;
  email: string;
  ip: string;
  userAgent: string;
  firstVisit: string;
  lastVisit: string;
  pagesViewed: string[];
  pageViews: PageView[];
  totalTimeSpent: number;
  ndaSigned: boolean;
  documentsViewed: string[];
}

export interface AnalyticsData {
  visitors: VisitorEntry[];
}

export interface TrackingEvent {
  sessionId: string;
  page: string;
  pageName: string;
  action: 'enter' | 'leave' | 'heartbeat';
  timestamp: string;
  duration?: number;
}

// Consultant Config
export interface ConsultantConfig {
  name: string;
  title: string;
  agency: string;
  ceaNo: string;
  email: string;
  phone: string;
  whatsapp?: string;
  photo?: string;
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Cookie Types
export interface NDASignedCookie {
  name: string;
  email: string;
  signedAt: string;
}
