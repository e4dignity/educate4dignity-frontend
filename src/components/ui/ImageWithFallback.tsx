import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  disable?: boolean; // economy mode
  showLoader?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ fallback = '/images/placeholder-generic.svg', disable, alt, showLoader = true, ...rest }) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    if (disable) { setLoaded(true); }
  },[disable]);

  if (disable) {
    return <div className="w-full h-full flex items-center justify-center text-[10px] text-text-tertiary bg-background-light border border-border rounded">IMG OFF</div>;
  }

  const source = !errored ? rest.src : fallback;

  return (
    <div className={`relative w-full h-full ${!loaded && showLoader ? 'animate-pulse bg-background-light' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...rest}
        src={source}
        alt={alt}
        loading={rest.loading || 'lazy'}
        onError={() => setErrored(true)}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover ${rest.className || ''} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
      {!loaded && showLoader && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-text-tertiary">Loading…</span>
      )}
    </div>
  );
};

export default ImageWithFallback;
