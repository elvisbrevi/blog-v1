import { useState, useEffect, useRef } from 'react';
import './optimized-image.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  aspectRatio = '16/9',
  priority = false
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // If the image is already cached, onLoad won't fire — check immediately
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    // Fallback timeout: if image hasn't loaded in 10s, stop blocking the UI
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate srcset for responsive images from CDN
  const generateSrcSet = (originalSrc: string) => {
    // Check if it's a Hashnode CDN URL
    if (originalSrc.includes('cdn.hashnode.com')) {
      // Hashnode CDN supports width parameter
      const widths = [400, 800, 1200];
      return widths
        .map(w => `${originalSrc}?w=${w}&auto=compress,format ${w}w`)
        .join(', ');
    }
    return undefined;
  };

  const srcSet = generateSrcSet(src);

  if (hasError) {
    return (
      <div
        className={`optimized-image-placeholder error ${className}`}
        style={{ aspectRatio }}
      >
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`optimized-image-container ${className}`}>
      {!isLoaded && (
        <div
          className="optimized-image-placeholder loading"
          style={{ aspectRatio }}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
        style={{ aspectRatio }}
      />
    </div>
  );
};

export default OptimizedImage;
