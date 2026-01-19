import React, { useEffect, useRef, useState } from "react";

type OptimizedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "loading"
> & {
  src: string;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  wrapperClassName?: string;
  placeholderClassName?: string;
  fallbackContent?: React.ReactNode;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  placeholderClassName,
  fallbackSrc,
  fallbackContent,
  loading = "lazy",
  decoding = "async",
  priority = false,
  onLoad,
  onError,
  ...rest
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const supportsLazy = typeof HTMLImageElement !== "undefined" && "loading" in HTMLImageElement.prototype;
  const shouldLazyLoad = loading === "lazy" && !priority;

  const [isInView, setIsInView] = useState(!shouldLazyLoad || supportsLazy || priority);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setTriedFallback(false);
  }, [src]);

  useEffect(() => {
    if (!shouldLazyLoad || supportsLazy || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [priority, shouldLazyLoad, supportsLazy]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && !triedFallback) {
      setTriedFallback(true);
      setIsLoaded(false);
      setCurrentSrc(fallbackSrc);
      return;
    }

    setHasError(true);
    onError?.(event);
  };

  const showFallbackContent = (!currentSrc || hasError) && !!fallbackContent;
  const showPlaceholder = !showFallbackContent && (!isLoaded || (!currentSrc && !hasError));
  const showErrorOverlay = hasError && !fallbackContent;

  if (showFallbackContent) {
    return (
      <div className={`relative w-full h-full ${wrapperClassName || ""}`}>
        {fallbackContent}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative block w-full h-full overflow-hidden ${wrapperClassName || ""}`}
    >
      {showPlaceholder && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${
            placeholderClassName || ""
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/60 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}
      {showErrorOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 text-sm">
          Image indisponible
        </div>
      )}
      {isInView && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`${className || ""} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={priority ? "eager" : loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
