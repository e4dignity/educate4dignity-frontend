import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  className,
  ...props 
}) => {
  return (
    <textarea
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'placeholder-gray-500 dark:placeholder-gray-400',
        'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'resize-vertical min-h-[80px]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
};

// Export par défaut aussi pour compatibilité
export default Textarea;