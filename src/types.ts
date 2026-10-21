export type ActiveTab = 
  | 'home' 
  | 'clearance-services'
  | 'quick-print' 
  | 'custom-request' 
  | 'track-order' 
  | 'services' 
  | 'media-gallery' 
  | 'pricing' 
  | 'contact';

export type ServiceCategory = 'student-govt' | 'commercial-print' | 'events-gifts';

// Kuwait Clearance Categories
export type ClearanceCategory = 
  | 'residency-labor'     // قسم خدمات الشؤون والإقامة (الأفراد والعمالة)
  | 'business-companies'   // قسم خدمات الشركات والأعمال (وزارة التجارة والقوى العاملة)
  | 'customs-shipping'     // قسم التخليص الجمركي والشحن
  | 'legal-translation'    // قسم التوثيق والترجمة والخدمات العدلية
  | 'traffic-civil-id';    // قسم الخدمات الإلكترونية والمرور

export interface ClearanceServiceItem {
  id: string;
  category: ClearanceCategory;
  categoryName: string;
  categoryIcon: string;
  name: string;
  metaDesc: string;
  detailedDesc: string;
  requiredDocuments: string[];
  whatWeDeliver: string[];
  badge?: string;
  estimatedTime?: string;
  officialEntity: string;
  defaultResidencyArticles?: string[];
  icon: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryName: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge?: string;
  features: string[];
  startingPrice?: string;
  popular?: boolean;
}

export type ColorMode = 'black_white' | 'color_standard' | 'color_premium';
export type PaperSize = 'a4_standard' | 'a4_heavy' | 'a3_standard' | 'a3_color' | 'glossy';
export type PrintSides = 'single' | 'double';
export type BindingType = 'none' | 'spiral_plastic' | 'wire_metal' | 'lamination' | 'staple';

export interface PrintOrderConfig {
  files: UploadedFile[];
  pageCount: number;
  colorMode: ColorMode;
  paperSize: PaperSize;
  sides: PrintSides;
  binding: BindingType;
  copies: number;
  notes: string;
  customerName: string;
  customerPhone: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  pageCountEstimate?: number;
  previewUrl?: string;
  rawFile?: File;
  // PDF specific custom controls & adjustments
  isPdf?: boolean;
  actualPdfPages?: number;
  printRangeType?: 'all' | 'custom';
  customPagesRange?: string;
  effectivePages?: number;
  isExactCount?: boolean;
}

export interface PriceBreakdown {
  basePerSheetCost: number;
  paperSheetsPerCopy: number;
  printingCostPerCopy: number;
  bindingCostPerCopy: number;
  singleCopyTotal: number;
  copies: number;
  grandTotalFils: number;
  grandTotalKWD: number;
  formattedKWD: string;
}

// Order Tracking Types
export type OrderStatus = 'reviewing' | 'processing' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface StatusUpdateRecord {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface TrackableOrder {
  id: string; // e.g. ORD-8412 or REQ-2031
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'quick_print' | 'custom_service' | 'other';
  serviceTitle: string;
  details: string;
  files?: { name: string; size?: number; type?: string; previewUrl?: string }[];
  totalCost?: string;
  createdAt: string;
  estimatedReadyTime?: string;
  status: OrderStatus;
  statusUpdates: StatusUpdateRecord[];
  pickupLocation: string;
  notes?: string;
}

// Custom Service Request Types
export interface CustomRequestAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  rawFile?: File;
}

export interface CustomServiceRequestData {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: string;
  serviceTitle: string;
  dimensions?: string;
  quantity: string;
  colorPreferences?: string;
  targetDate?: string;
  description: string;
  additionalNotes?: string;
  attachedFiles: CustomRequestAttachment[];
  createdAt?: string;
}

