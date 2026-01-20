import React, { useState } from 'react';
import { X, Tag, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
// Import Textarea component
import { Textarea } from './Textarea';

export interface ImageMetadata {
  title: string;
  description: string;
  category: 'education' | 'distribution' | 'impact' | 'community';
  tags: string[];
  isPublic: boolean;
}

interface ImageMetadataFormProps {
  metadata: ImageMetadata;
  onChange: (metadata: ImageMetadata) => void;
  imagePreview?: string;
  fileName?: string;
  className?: string;
}

const categories = [
  { value: 'education' as const, label: 'Education' },
  { value: 'distribution' as const, label: 'Distribution' },
  { value: 'impact' as const, label: 'Impact Stories' },
  { value: 'community' as const, label: 'Community' }
];

export const ImageMetadataForm: React.FC<ImageMetadataFormProps> = ({
  metadata,
  onChange,
  imagePreview,
  fileName,
  className = ''
}) => {
  const [newTag, setNewTag] = useState('');

  const handleChange = (field: keyof ImageMetadata, value: any) => {
    onChange({
      ...metadata,
      [field]: value
    });
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !metadata.tags.includes(tag)) {
      handleChange('tags', [...metadata.tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', metadata.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {imagePreview && (
        <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {fileName || 'Image'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Image preview
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <Input
          value={metadata.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter image title..."
          className="w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <Textarea
          value={metadata.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
          placeholder="Describe this image..."
          rows={3}
          className="w-full"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={metadata.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        
        {/* Add Tag Input */}
        <div className="flex space-x-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addTag}
            disabled={!newTag.trim()}
            size="sm"
          >
            <Tag className="w-4 h-4" />
          </Button>
        </div>

        {/* Tags List */}
        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={metadata.isPublic}
            onChange={(e) => handleChange('isPublic', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            {metadata.isPublic ? (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Make Public
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Keep Private
              </>
            )}
          </span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {metadata.isPublic 
            ? 'This image will be visible on the public gallery'
            : 'This image will only be visible to administrators'
          }
        </p>
      </div>
    </div>
  );
};