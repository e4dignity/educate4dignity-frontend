import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

interface FilePreview {
  file: File;
  url: string;
  id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = true,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFilesSelected,
  disabled = false,
  className = ''
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`;
    }

    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      return `File "${file.name}" is not an image.`;
    }

    return null;
  };

  const processFiles = useCallback((files: File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    // Create previews
    const newPreviews: FilePreview[] = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));

    if (multiple) {
      setPreviews(prev => [...prev, ...newPreviews]);
      onFilesSelected([...previews.map(p => p.file), ...validFiles]);
    } else {
      // Clean up old previews
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
      setPreviews(newPreviews);
      onFilesSelected(validFiles);
    }
  }, [previews, multiple, onFilesSelected, maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [processFiles]);

  const removePreview = useCallback((id: string) => {
    setPreviews(prev => {
      const updated = prev.filter(p => p.id !== id);
      const removedPreview = prev.find(p => p.id === id);
      if (removedPreview) {
        URL.revokeObjectURL(removedPreview.url);
      }
      onFilesSelected(updated.map(p => p.file));
      return updated;
    });
  }, [onFilesSelected]);

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isDragOver ? 'Drop files here' : 'Drop files here or click to browse'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept === 'image/*' ? 'Images only' : accept} • Max {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Selected Files ({previews.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previews.map(preview => (
              <div key={preview.id} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {preview.file.type.startsWith('image/') ? (
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(preview.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* File Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {preview.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {Math.round(preview.file.size / 1024)}KB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              previews.forEach(preview => URL.revokeObjectURL(preview.url));
              setPreviews([]);
              onFilesSelected([]);
            }}
            disabled={disabled}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};