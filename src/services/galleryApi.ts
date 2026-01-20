import { API_BASE_URL } from '../config';
import { 
  GalleryImage, 
  GalleryApiResponse, 
  PublicGalleryResponse, 
  GalleryFilters, 
  GalleryUploadMetadata 
} from '../types/gallery';

class GalleryApiService {
  private baseUrl = `${API_BASE_URL}/api/uploads/gallery`;
  private publicUrl = `${API_BASE_URL}/api/uploads/gallery/public`;

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('e4d_access_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  }

  private async getAuthHeadersForUpload(): Promise<HeadersInit> {
    const token = localStorage.getItem('e4d_access_token');
    return {
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set Content-Type for FormData uploads
    };
  }

  /**
   * Get all gallery images (admin only)
   */
  async getImages(filters: GalleryFilters = {}): Promise<GalleryApiResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('pageSize', filters.limit.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));

    const url = `${this.baseUrl}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: await this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery images: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform dates
    return {
      ...data,
      images: data.images.map((img: any) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt)
      }))
    };
  }

  /**
   * Get public gallery images (no auth required)
   */
  async getPublicImages(category?: string): Promise<PublicGalleryResponse> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);

    const url = `${this.publicUrl}?${params.toString()}`;
    
  // Apply a client-side timeout to avoid hanging UI; treat timeout as unavailable
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const response = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      // Normalize to a consistent error for UI to show unavailable/404 message
      const status = response.status;
      if (status === 404) throw new Error('NOT_FOUND');
      throw new Error('UNAVAILABLE');
    }
    const data = await response.json();
    // Support both legacy array response and new object shape { images: [...] }
    const rawImages = Array.isArray(data) ? data : data.images;
    if (!Array.isArray(rawImages)) {
      throw new Error('Unexpected gallery response shape');
    }
    return {
      images: rawImages.map((img: any) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt)
      }))
    };
  }

  /**
   * Upload new gallery image
   */
  async uploadImage(file: File, metadata: GalleryUploadMetadata): Promise<GalleryImage> {
    const formData = new FormData();
    // Backend expects field name 'image'
    formData.append('image', file);
    
    // Add metadata
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    formData.append('category', metadata.category);
    if (metadata.tags?.length) formData.append('tags', metadata.tags.join(','));
    if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic.toString());

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: await this.getAuthHeadersForUpload(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      uploadedAt: new Date(data.uploadedAt)
    };
  }

  /**
   * Update existing gallery image
   */
  async updateImage(id: string, updateData: Partial<GalleryImage>): Promise<GalleryImage> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        tags: updateData.tags,
        isPublic: updateData.isPublic
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Update failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      uploadedAt: new Date(data.uploadedAt)
    };
  }

  /**
   * Delete gallery image
   */
  async deleteImage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Delete failed: ${response.statusText}`);
    }
  }

  /**
   * Get single image details
   */
  async getImage(id: string): Promise<GalleryImage> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: await this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      uploadedAt: new Date(data.uploadedAt)
    };
  }

  /**
   * Batch upload multiple images
   */
  async uploadImages(files: File[], metadata: GalleryUploadMetadata): Promise<GalleryImage[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, metadata));
    return Promise.all(uploadPromises);
  }

  /**
   * Batch update multiple images
   */
  async updateImages(updates: Array<{ id: string; data: Partial<GalleryImage> }>): Promise<GalleryImage[]> {
    const updatePromises = updates.map(({ id, data }) => this.updateImage(id, data));
    return Promise.all(updatePromises);
  }

  /**
   * Get gallery statistics
   */
  async getStats(): Promise<any> {
    // Backend endpoint is /api/uploads/gallery-stats
    const statsUrl = `${API_BASE_URL}/api/uploads/gallery-stats`;
    const response = await fetch(statsUrl, {
      headers: await this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery stats: ${response.statusText}`);
    }

    return response.json();
  }
}

export const galleryApi = new GalleryApiService();

// Helper functions for transforming data
export const transformGalleryImageToPhoto = (image: GalleryImage) => ({
  id: image.id,
  src: image.url,
  alt: image.title || image.description || 'Gallery image',
  title: image.title || '',
  description: image.description || '',
  category: image.category,
  featured: false, // Could be determined by tags or separate field
  tags: image.tags
});

export const transformPhotoToGalleryImage = (photo: any): Partial<GalleryImage> => ({
  url: photo.src,
  title: photo.title,
  description: photo.description,
  category: photo.category,
  tags: photo.tags || [],
  isPublic: true // Default to public for legacy photos
});