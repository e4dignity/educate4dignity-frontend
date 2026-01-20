import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { UploadModal } from '../../components/ui/UploadModal';
import { EditImageModal } from '../../components/ui/EditImageModal';
import AdminPage from '../../components/admin/AdminPage';
import { useGallery } from '../../hooks/useGallery';
import { GalleryImage } from '../../types/gallery';

interface AdminGalleryProps {}

const AdminGallery: React.FC<AdminGalleryProps> = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    images,
    loading,
    error,
    stats,
    updateFilters,
    uploadImage,
    updateImage,
    deleteImage,
    toggleVisibility,
    refreshImages
  } = useGallery();

  useEffect(() => {
    updateFilters({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      // Add search logic if needed
    });
  }, [selectedCategory, updateFilters]);

  const categories = [
    { id: 'all', label: t('gallery.categories.all', 'All Images'), icon: ImageIcon },
    { id: 'education', label: t('gallery.categories.education', 'Education'), icon: ImageIcon },
    { id: 'distribution', label: t('gallery.categories.distribution', 'Distribution'), icon: ImageIcon },
    { id: 'impact', label: t('gallery.categories.impact', 'Impact Stories'), icon: ImageIcon },
    { id: 'community', label: t('gallery.categories.community', 'Community'), icon: ImageIcon }
  ];

  const filteredImages = images.filter(image => 
    searchTerm === '' || 
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminPage title={t('admin.gallery', 'Gallery Management')}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header with Stats and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <Card className="p-4">
              <div className="text-2xl font-bold text-[var(--primary-accent)]">
                {stats?.total || 0}
              </div>
              <div className="text-sm text-[var(--muted-color)]">
                {t('gallery.stats.total', 'Total Images')}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-[var(--success)]">
                {stats?.public || 0}
              </div>
              <div className="text-sm text-[var(--muted-color)]">
                {t('gallery.stats.public', 'Public')}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-[var(--muted-color)]">
                {stats?.private || 0}
              </div>
              <div className="text-sm text-[var(--muted-color)]">
                {t('gallery.stats.private', 'Private')}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-[var(--primary-accent)]">
                {stats?.byCategory?.education || 0}
              </div>
              <div className="text-sm text-[var(--muted-color)]">
                {t('gallery.stats.education', 'Education')}
              </div>
            </Card>
          </div>
          
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-[var(--primary-accent)] hover:bg-[var(--color-primary-dark)] text-white"
          >
            <Plus className="w-4 h-4" />
            {t('gallery.upload', 'Upload Images')}
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-color)]" />
                <Input
                  placeholder={t('gallery.search', 'Search images...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${ 
                      selectedCategory === category.id
                        ? 'bg-[var(--primary-accent)] text-white border-[var(--primary-accent)]'
                        : 'bg-[var(--card-bg)] text-[var(--muted-color)] border-[var(--border-color)] hover:border-[var(--primary-accent)]'
                    }`}
                  >
                    {category.label}
                    {stats?.byCategory?.[category.id] && category.id !== 'all' && (
                      <span className="ml-1 opacity-75">({stats.byCategory[category.id]})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-[var(--border-color)] rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-l-lg ${viewMode === 'grid' ? 'bg-[var(--primary-accent)] text-white' : 'bg-[var(--card-bg)] text-[var(--muted-color)]'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-r-lg border-l border-[var(--border-color)] ${viewMode === 'list' ? 'bg-[var(--primary-accent)] text-white' : 'bg-[var(--card-bg)] text-[var(--muted-color)]'}`}
                >
                  List
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--primary-accent)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[var(--muted-color)]">{t('common.loading', 'Loading...')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-[var(--error)] bg-[var(--error-bg)]">
            <CardContent className="p-4">
              <p className="text-[var(--error)]">{error}</p>
              <Button 
                onClick={refreshImages} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                {t('common.retry', 'Retry')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Images Grid/List */}
        {!loading && !error && (
          <>
            {filteredImages.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[var(--muted-color)]" />
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                    {t('gallery.empty.title', 'No Images Found')}
                  </h3>
                  <p className="text-[var(--muted-color)] mb-4">
                    {searchTerm 
                      ? t('gallery.empty.search', 'No images match your search criteria.')
                      : t('gallery.empty.category', 'No images in this category yet.')}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setShowUploadModal(true)}>
                      {t('gallery.upload.first', 'Upload Your First Image')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
              }>
                {filteredImages.map(image => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    viewMode={viewMode}
                    onEdit={() => setEditingImage(image)}
                    onDelete={() => deleteImage(image.id)}
                    onToggleVisibility={() => toggleVisibility(image.id, !image.isPublic)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Upload Modal */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={uploadImage}
        />

        {/* Edit Modal */}
        <EditImageModal
          isOpen={!!editingImage}
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={updateImage}
        />
      </div>
    </AdminPage>
  );
};

// Individual Image Card Component
interface ImageCardProps {
  image: GalleryImage;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  viewMode, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}) => {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="w-24 h-24 flex-shrink-0 bg-[var(--color-border)]">
            <img 
              src={image.url} 
              alt={image.title || 'Gallery image'} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 p-4 flex justify-between items-start">
            <div className="space-y-1 flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-[var(--text-primary)] truncate">
                {image.title || 'Untitled'}
              </h3>
              <p className="text-sm text-[var(--muted-color)] line-clamp-2">
                {image.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-color)]">
                <span className="px-2 py-1 bg-[var(--chip-bg)] rounded-full">
                  {image.category}
                </span>
                {image.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[var(--color-border)] rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleVisibility}
                className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors"
                title={image.isPublic ? 'Make private' : 'Make public'}
              >
                {image.isPublic ? (
                  <Eye className="w-4 h-4 text-[var(--success)]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[var(--muted-color)]" />
                )}
              </button>
              <button
                onClick={onEdit}
                className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-[var(--muted-color)]" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 hover:bg-[var(--error-bg)] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[var(--error)]" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative aspect-square bg-[var(--color-border)]">
        <img 
          src={image.url} 
          alt={image.title || 'Gallery image'} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={onToggleVisibility}
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
              title={image.isPublic ? 'Make private' : 'Make public'}
            >
              {image.isPublic ? (
                <Eye className="w-4 h-4 text-[var(--success)]" />
              ) : (
                <EyeOff className="w-4 h-4 text-[var(--muted-color)]" />
              )}
            </button>
            <button
              onClick={onEdit}
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[var(--error)]" />
            </button>
          </div>
        </div>

        {/* Visibility indicator */}
        <div className="absolute top-2 right-2">
          {image.isPublic ? (
            <Eye className="w-4 h-4 text-white bg-[var(--success)] p-1 rounded-full" />
          ) : (
            <EyeOff className="w-4 h-4 text-white bg-[var(--muted-color)] p-1 rounded-full" />
          )}
        </div>

        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            {image.category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-[var(--text-primary)] truncate mb-1">
          {image.title || 'Untitled'}
        </h3>
        {image.description && (
          <p className="text-sm text-[var(--muted-color)] line-clamp-2 mb-2">
            {image.description}
          </p>
        )}
        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-[var(--chip-bg)] text-xs rounded-full">
                {tag}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="px-2 py-1 bg-[var(--color-border)] text-xs rounded-full">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};



export default AdminGallery;