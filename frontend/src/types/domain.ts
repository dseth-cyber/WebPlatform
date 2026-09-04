export interface ApiResponse<T> {
  data: T;
  metadata?: {
    pagination?: PaginationMetadata;
    timestamp?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
    requestId?: string;
  } | null;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface LocalizedPageSection {
  id: string;
  sectionType: string;
  sortOrder: number;
  config: Record<string, any>;
  title: string;
  subtitle: string;
  contentBody: string;
  payload: Record<string, any>;
}

export interface LocalizedPage {
  id: string;
  slug: string;
  language: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  metaKeys: string;
  ogMetadata: Record<string, any>;
  sections: LocalizedPageSection[];
  publishedAt?: string;
}

export interface PageSectionAdmin {
  id: string;
  pageId: string;
  sectionType: string;
  sortOrder: number;
  isActive: boolean;
  config: Record<string, any>;
  translations: Record<string, {
    title?: string;
    subtitle?: string;
    contentBody?: string;
    payload?: Record<string, any>;
  }>;
}

export interface PageAdmin {
  id: string;
  slug: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  translations: Record<string, {
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }>;
  sections: PageSectionAdmin[];
}

export interface ProductCategory {
  id: string;
  slug: string;
  sortOrder: number;
  name: string;
  description?: string;
}

export interface LocalizedProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  sku: string;
  language: string;
  name: string;
  slug: string;
  description: string;
  features: string;
  applications: string;
  material: string;
  coatingType: string;
  unRating?: string;
  specifications: Record<string, any>;
  primaryImageURL: string;
  galleryImages: string[];
  pdfSpecURL?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPinned?: boolean;
  isActive?: boolean;
}

export interface LocalizedNewsArticle {
  id: string;
  category: string;
  language: string;
  title: string;
  slug: string;
  summary: string;
  contentBody: string;
  featuredImageURL: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPinned?: boolean; // 📌 ปักหมุดข่าวเด่นหน้าแรก
}

export interface MediaFile {
  id: string;
  filename: string;
  originalFilename: string;
  bucket: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  hashSha256: string;
  altText: Record<string, string>;
  folder: string;
  url: string;
  uploaderName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmitRequest {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  interestCategory?: string;
  website?: string; // honeypot
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent?: string;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
}

export interface UserAdmin {
  id: string;
  email: string;
  fullName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  lastLoginAt?: string;
  createdAt: string;
  roles: string[];
}
