import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { getFlagSources, getCountryCode } from '../utils/flags';

interface FlagImageProps {
  country: Country;
  width?: number;
  className?: string;
  containerClassName?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

export const FlagImage: React.FC<FlagImageProps> = ({
  country,
  width = 320,
  className = '',
  containerClassName = '',
  alt,
  loading = 'lazy',
}) => {
  const sources = React.useMemo(() => getFlagSources(country, width), [country, width]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Reset when country or width changes
  useEffect(() => {
    setSourceIndex(0);
    setHasError(false);
  }, [country.id, width]);

  const handleError = () => {
    if (sourceIndex + 1 < sources.length) {
      setSourceIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const code = getCountryCode(country);

  // If all sources failed, display country code in a styled box instead of alt text
  if (hasError) {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 select-none shadow-xs p-2 text-center min-w-[70px] min-h-[46px] ${className} ${containerClassName}`}
        title={`Código de país: ${code} (${country.name})`}
        role="img"
        aria-label={`Código de ${country.name}`}
      >
        <span className="font-mono font-bold text-base sm:text-lg tracking-wider leading-none">
          {code}
        </span>
        <span className="text-[10px] font-sans font-medium opacity-70 mt-1 line-clamp-1 max-w-full">
          {country.name}
        </span>
      </div>
    );
  }

  const currentSrc = sources[sourceIndex] || '';

  return (
    <img
      src={currentSrc}
      alt={alt || `Bandera de ${country.name}`}
      onError={handleError}
      loading={loading}
      className={className}
    />
  );
};
