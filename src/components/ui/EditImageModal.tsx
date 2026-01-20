import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X, AlertCircle, Loader } from 'lucide-react';
import { Modal } from './Modal';
import { ImageMetadataForm, ImageMetadata } from './ImageMetadataForm';
import { Button } from './Button';
import { GalleryImage } from '../../types/gallery';

interface EditImageModalProps {
  isOpen: boolean;
  image: GalleryImage | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<GalleryImage>) => Promise<void>;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  image,
  onClose,
  onSave
}) => {
  const { t } = useTranslation();
  const [metadata, setMetadata] = useState<ImageMetadata>({
    title: '',
    description: '',
    category: 'education',
    tags: [],
    isPublic: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize metadata when image changes
  useEffect(() => {
    if (image) {
      const initialMetadata: ImageMetadata = {
        title: image.title || '',
        description: image.description || '',
        category: image.category as any || 'education',
        tags: image.tags || [],
        isPublic: image.isPublic
      };
      setMetadata(initialMetadata);
      setHasChanges(false);
      setError(null);
    }
  }, [image]);

  const handleMetadataChange = (newMetadata: ImageMetadata) => {
    setMetadata(newMetadata);
    
    // Check if there are changes
    if (image) {
      const hasChanged = 
        newMetadata.title !== (image.title || '') ||
        newMetadata.description !== (image.description || '') ||
        newMetadata.category !== image.category ||
        JSON.stringify(newMetadata.tags) !== JSON.stringify(image.tags || []) ||
        newMetadata.isPublic !== image.isPublic;
      
      setHasChanges(hasChanged);
    }
  };

  const handleSave = async () => {
    if (!image || !hasChanges) return;

    setSaving(true);
    setError(null);

    try {
      const updateData: Partial<GalleryImage> = {
        title: metadata.title,
        description: metadata.description,
        category: metadata.category as any,
        tags: metadata.tags,
        isPublic: metadata.isPublic
      };

      await onSave(image.id, updateData);
      
      // Update the original image data to reflect the new state
      Object.assign(image, updateData);
      setHasChanges(false);
      
      // Close the modal after a short delay to show success
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges && !saving) {
      const confirmClose = window.confirm(
        t('gallery.edit.confirmClose', 'You have unsaved changes. Are you sure you want to close?')
      );
      if (!confirmClose) return;
    }
    
    setError(null);
    setHasChanges(false);
    onClose();
  };

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('gallery.edit.title', 'Edit Image')}
      size="lg"
    >
      <div className="space-y-6">
        {/* Current Image Preview */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={image.url}
              alt={image.title || 'Gallery image'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {image.filename}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {image.id}
            </p>
          </div>
        </div>

        {/* Metadata Form */}
        <ImageMetadataForm
          metadata={metadata}
          onChange={handleMetadataChange}
          imagePreview={image.url}
          fileName={image.filename}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t('gallery.edit.saveError', 'Save Error')}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saving && !error && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <Loader className="w-5 h-5 text-green-500 animate-spin mr-3" />
              <p className="text-sm text-green-700 dark:text-green-300">
                {t('gallery.edit.saving', 'Saving changes...')}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            {t('common.cancel', 'Cancel')}
          </Button>

          <div className="flex space-x-2">
            {/* Reset Button */}
            {hasChanges && !saving && (
              <Button
                variant="outline"
                onClick={() => {
                  if (image) {
                    setMetadata({
                      title: image.title || '',
                      description: image.description || '',
                      category: image.category as any || 'education',
                      tags: image.tags || [],
                      isPublic: image.isPublic
                    });
                    setHasChanges(false);
                  }
                }}
              >
                {t('common.reset', 'Reset')}
              </Button>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`${
                hasChanges 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } ${saving ? 'opacity-50' : ''}`}
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {t('gallery.edit.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('common.save', 'Save Changes')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Changes Indicator */}
        {hasChanges && !saving && (
          <div className="text-xs text-orange-600 dark:text-orange-400 text-center">
            {t('gallery.edit.unsavedChanges', 'You have unsaved changes')}
          </div>
        )}
      </div>
    </Modal>
  );
};