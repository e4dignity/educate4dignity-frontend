export interface GalleryImage {
  id: string;
  filename: string;
  url: string;
  title?: string;
  description?: string;
  category: 'education' | 'distribution' | 'impact' | 'community';
  tags: string[];
  uploadedAt: Date;
  isPublic: boolean;
}

export interface GalleryStats {
  total: number;
  public: number;
  private: number;
  byCategory: Record<string, number>;
}

export interface GalleryFilters {
  page?: number;
  limit?: number;
  category?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface GalleryUploadMetadata {
  title?: string;
  description?: string;
  category: 'education' | 'distribution' | 'impact' | 'community';
  tags?: string[];
  isPublic?: boolean;
}

export interface GalleryApiResponse {
  images: GalleryImage[];
  total: number;
  page: number;
  totalPages: number;
  stats: GalleryStats;
}

export interface PublicGalleryResponse {
  images: GalleryImage[];
}

// Legacy interface for existing JessicaGalleryPage
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: 'education' | 'distribution' | 'impact' | 'community';
  featured?: boolean;
  tags: string[];
}