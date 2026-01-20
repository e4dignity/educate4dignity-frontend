import { useState, useEffect, useCallback } from 'react';
import { GalleryImage, GalleryStats, GalleryFilters } from '../types/gallery';
import { galleryApi } from '../services/galleryApi';
import { useAuth } from './authContext';

interface UseGalleryReturn {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  stats: GalleryStats | null;
  filters: GalleryFilters;
  updateFilters: (newFilters: Partial<GalleryFilters>) => void;
  uploadImage: (files: File[], metadata: any) => Promise<void>;
  updateImage: (id: string, data: Partial<GalleryImage>) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  toggleVisibility: (id: string, isPublic: boolean) => Promise<void>;
  refreshImages: () => Promise<void>;
}

export const useGallery = (): UseGalleryReturn => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [filters, setFilters] = useState<GalleryFilters>({
    page: 1,
    limit: 24,
    category: undefined,
    isPublic: undefined,
    tags: undefined
  });

  const { user, hasRole } = useAuth();
  // Roles in frontend are lowercase (see types UserRole). Consider admin or team_member as admins here.
  const isAdmin = !!user && hasRole('admin', 'team_member');

  // Load images with current filters
  const loadImages = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await galleryApi.getImages(filters);
      setImages(result.images);
      setStats(result.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Failed to load gallery images:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin]);

  // Load images on mount and filter changes
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<GalleryFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to first page on filter change
    }));
  }, []);

  // Upload new images
  const uploadImage = useCallback(async (files: File[], metadata: any) => {
    if (!isAdmin) throw new Error('Unauthorized');

    setLoading(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => 
        galleryApi.uploadImage(file, metadata)
      );
      
      await Promise.all(uploadPromises);
      await loadImages(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, loadImages]);

  // Update existing image
  const updateImage = useCallback(async (id: string, data: Partial<GalleryImage>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      await galleryApi.updateImage(id, data);
      
      // Update local state
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, ...data } : img
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    }
  }, [isAdmin]);

  // Delete image
  const deleteImage = useCallback(async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      await galleryApi.deleteImage(id);
      
      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          total: prev.total - 1,
          public: images.find(img => img.id === id)?.isPublic ? prev.public - 1 : prev.public,
          private: !images.find(img => img.id === id)?.isPublic ? prev.private - 1 : prev.private
        } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      throw err;
    }
  }, [isAdmin, images, stats]);

  // Toggle visibility
  const toggleVisibility = useCallback(async (id: string, isPublic: boolean) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      await galleryApi.updateImage(id, { isPublic });
      
      // Update local state
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, isPublic } : img
      ));

      // Update stats
      if (stats) {
        const wasPublic = images.find(img => img.id === id)?.isPublic;
        setStats(prev => prev ? {
          ...prev,
          public: isPublic 
            ? prev.public + (wasPublic ? 0 : 1)
            : prev.public - (wasPublic ? 1 : 0),
          private: !isPublic 
            ? prev.private + (wasPublic ? 1 : 0)
            : prev.private - (wasPublic ? 0 : 1)
        } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle visibility');
      throw err;
    }
  }, [isAdmin, images, stats]);

  // Refresh images
  const refreshImages = useCallback(() => {
    return loadImages();
  }, [loadImages]);

  return {
    images,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    uploadImage,
    updateImage,
    deleteImage,
    toggleVisibility,
    refreshImages
  };
};

// Public gallery hook for frontend display
export const usePublicGallery = (category?: string) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadPublicImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFallback(false);

    try {
      const result = await galleryApi.getPublicImages(category);
      setImages(result.images);
    } catch (err) {
      console.error('Failed to load public gallery images:', err);
      // Use local demo images as a graceful fallback (no error shown to the user)
      const { fallbackGalleryImages } = await import('../data/galleryFallback');
      setImages(fallbackGalleryImages);
      setIsFallback(true);
      // Keep error internal to avoid alarming users; if needed, keep for telemetry
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadPublicImages();
  }, [loadPublicImages]);

  return { images, loading, error, isFallback, reload: loadPublicImages };
};