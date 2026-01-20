import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Modal } from './Modal';
import { FileUpload } from './FileUpload';
import { ImageMetadataForm, ImageMetadata } from './ImageMetadataForm';
import { Button } from './Button';
import { GalleryUploadMetadata } from '../../types/gallery';

interface FileWithMetadata {
  file: File;
  preview: string;
  metadata: ImageMetadata;
  id: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], metadata: GalleryUploadMetadata) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'metadata' | 'upload'>('select');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadResults, setUploadResults] = useState<{ [key: string]: 'success' | 'error' }>({});
  const [error, setError] = useState<string | null>(null);

  const defaultMetadata: ImageMetadata = {
    title: '',
    description: '',
    category: 'education',
    tags: [],
    isPublic: true
  };

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: FileWithMetadata[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      metadata: {
        ...defaultMetadata,
        title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
      },
      id: Math.random().toString(36).substring(7)
    }));

    setFiles(newFiles);
    if (newFiles.length > 0) {
      setCurrentStep('metadata');
      setSelectedFileIndex(0);
    }
  }, []);

  const handleMetadataChange = useCallback((metadata: ImageMetadata) => {
    setFiles(prev => prev.map((file, index) => 
      index === selectedFileIndex 
        ? { ...file, metadata }
        : file
    ));
  }, [selectedFileIndex]);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setCurrentStep('upload');
    setError(null);
    setUploadProgress({});
    setUploadResults({});

    try {
      // Upload files one by one with progress tracking
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        
        try {
          setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
          
          // Convert metadata to the expected format
          const uploadMetadata: GalleryUploadMetadata = {
            title: fileData.metadata.title,
            description: fileData.metadata.description,
            category: fileData.metadata.category,
            tags: fileData.metadata.tags,
            isPublic: fileData.metadata.isPublic
          };

          // Simulate progress (since we can't track real progress with fetch)
          setUploadProgress(prev => ({ ...prev, [fileData.id]: 50 }));
          
          await onUpload([fileData.file], uploadMetadata);
          
          setUploadProgress(prev => ({ ...prev, [fileData.id]: 100 }));
          setUploadResults(prev => ({ ...prev, [fileData.id]: 'success' }));
        } catch (err) {
          console.error(`Failed to upload ${fileData.file.name}:`, err);
          setUploadResults(prev => ({ ...prev, [fileData.id]: 'error' }));
          setError(`Failed to upload ${fileData.file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      // If all uploads were successful, close the modal after a delay
      const allSuccess = Object.values(uploadResults).every(result => result === 'success') && 
                        Object.keys(uploadResults).length === files.length;
      
      if (allSuccess && !error) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    files.forEach(file => URL.revokeObjectURL(file.preview));
    
    setFiles([]);
    setCurrentStep('select');
    setSelectedFileIndex(0);
    setUploading(false);
    setUploadProgress({});
    setUploadResults({});
    setError(null);
    onClose();
  };

  const canProceedToUpload = files.every(file => 
    file.metadata.title.trim() !== '' && file.metadata.category
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('gallery.uploadModal.selectFiles', 'Select Images')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('gallery.uploadModal.selectHint', 'Choose one or more images to upload to the gallery')}
              </p>
            </div>

            <FileUpload
              accept="image/*"
              multiple={true}
              maxSize={5 * 1024 * 1024} // 5MB
              onFilesSelected={handleFilesSelected}
            />
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('gallery.uploadModal.addMetadata', 'Add Metadata')}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedFileIndex + 1} of {files.length}
              </span>
            </div>

            {/* File Navigation */}
            {files.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {files.map((file, index) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedFileIndex
                        ? 'border-blue-500'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Metadata Form */}
            {files[selectedFileIndex] && (
              <ImageMetadataForm
                metadata={files[selectedFileIndex].metadata}
                onChange={handleMetadataChange}
                imagePreview={files[selectedFileIndex].preview}
                fileName={files[selectedFileIndex].file.name}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('select')}
                disabled={uploading}
              >
                {t('common.back', 'Back')}
              </Button>

              <div className="flex space-x-2">
                {files.length > 1 && selectedFileIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFileIndex(selectedFileIndex - 1)}
                  >
                    Previous
                  </Button>
                )}

                {files.length > 1 && selectedFileIndex < files.length - 1 ? (
                  <Button
                    onClick={() => setSelectedFileIndex(selectedFileIndex + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpload}
                    disabled={!canProceedToUpload || uploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('gallery.uploadModal.start', 'Upload Images')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {uploading ? 
                  t('gallery.uploadModal.uploading', 'Uploading Images...') :
                  t('gallery.uploadModal.complete', 'Upload Complete')
                }
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploading ? 
                  t('gallery.uploadModal.uploadingHint', 'Please wait while we upload your images') :
                  t('gallery.uploadModal.completeHint', 'Your images have been uploaded to the gallery')
                }
              </p>
            </div>

            {/* Upload Progress */}
            <div className="space-y-3">
              {files.map((file) => {
                const progress = uploadProgress[file.id] || 0;
                const result = uploadResults[file.id];
                
                return (
                  <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={file.preview}
                        alt={file.metadata.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.metadata.title || file.file.name}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            result === 'success' ? 'bg-green-500' :
                            result === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {result === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : result === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : uploading ? (
                        <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Upload Error
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('metadata')}
                disabled={uploading}
              >
                {t('common.back', 'Back')}
              </Button>

              <Button
                onClick={handleClose}
                disabled={uploading}
                className={uploading ? 'opacity-50' : ''}
              >
                {uploading ? 
                  t('common.close', 'Close') :
                  t('common.done', 'Done')
                }
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('gallery.upload.title', 'Upload Images')}
      size="xl"
    >
      {renderStepContent()}
    </Modal>
  );
};