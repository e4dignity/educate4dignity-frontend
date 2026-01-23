import React, { useState } from 'react';

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export const ImageWithSpinner: React.FC<Props> = ({
  src,
  alt = '',
  className = '',
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
            <span className="text-xs text-neutral-500">
              Loading image…
            </span>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // éviter blocage
        loading="eager"
      />
    </div>
  );
};
