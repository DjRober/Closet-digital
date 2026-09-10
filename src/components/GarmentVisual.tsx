import { GarmentIconKey } from '../types';

interface GarmentVisualProps {
  imageUrl?: string;
  iconKey?: GarmentIconKey;
  colorHex?: string;
  colorName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GarmentVisual({
  imageUrl,
  iconKey = 'hanger',
  colorHex,
  colorName,
  className = '',
  size = 'md',
}: GarmentVisualProps) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-black/20 flex items-center justify-center ${className}`}>
        <img
          src={imageUrl}
          alt={`Prenda ${colorName || ''}`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Dimension helpers
  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  // Check if stroke color needs contrast assistance
  const renderIconSvg = () => {
    // Determine effective stroke color with fallback
    let strokeColor = colorHex || '#44403c';

    // If black or very dark, use a smart CSS variable or class so in dark mode it is visible
    const isVeryDark = colorHex && (colorHex.toLowerCase() === '#1c1917' || colorHex.toLowerCase() === '#000000');

    switch (iconKey) {
      case 'shirt':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* T-Shirt / Camiseta path */}
            <path d="M22 10 C26 16 38 16 42 10 L56 18 L50 30 L44 26 L44 54 L20 54 L20 26 L14 30 L8 18 Z" />
            <path d="M32 14 L32 20" strokeWidth="2.5" />
          </svg>
        );

      case 'pants':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Trousers / Pantalón */}
            <path d="M18 10 L46 10 L48 54 L35 54 L32 26 L29 54 L16 54 Z" />
            <path d="M18 18 L46 18" strokeWidth="2.5" />
            <path d="M32 10 L32 18" strokeWidth="2.5" />
          </svg>
        );

      case 'jacket':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Jacket / Abrigo */}
            <path d="M22 10 L42 10 L58 20 L52 34 L46 30 L46 54 L18 54 L18 30 L12 34 L6 20 Z" />
            <path d="M22 10 L32 30 L42 10" />
            <path d="M32 30 L32 54" strokeWidth="2.5" />
            <circle cx="36" cy="38" r="1.5" fill={isVeryDark ? 'currentColor' : strokeColor} />
            <circle cx="36" cy="46" r="1.5" fill={isVeryDark ? 'currentColor' : strokeColor} />
          </svg>
        );

      case 'dress':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Dress / Vestido */}
            <path d="M24 10 L28 20 L20 28 L24 28 L14 54 L50 54 L40 28 L44 28 L36 20 L40 10 Z" />
            <path d="M24 10 C28 14 36 14 40 10" />
            <path d="M24 28 L40 28" strokeWidth="2" />
          </svg>
        );

      case 'shoes':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Shoes / Zapatillas */}
            <path d="M10 38 L22 24 L34 28 L44 34 L54 36 C56 36 58 38 58 41 L58 44 C58 46 56 48 54 48 L10 48 C8 48 6 46 6 44 L6 41 C6 39 8 38 10 38 Z" />
            <path d="M6 44 L58 44" strokeWidth="2.5" />
            <path d="M28 32 L34 38" strokeWidth="2" />
            <path d="M32 30 L38 36" strokeWidth="2" />
          </svg>
        );

      case 'accessory':
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Bag / Accessory */}
            <rect x="14" y="24" width="36" height="28" rx="4" />
            <path d="M24 24 C24 16 40 16 40 24" />
            <circle cx="32" cy="36" r="2" fill={isVeryDark ? 'currentColor' : strokeColor} />
            <path d="M32 38 L32 44" strokeWidth="2" />
          </svg>
        );

      case 'hanger':
      default:
        return (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke={isVeryDark ? 'currentColor' : strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${iconSizeClasses} ${isVeryDark ? 'text-stone-200' : ''}`}
          >
            {/* Hanger / Percha */}
            <path d="M32 24 C30 18 36 14 38 18 C39 21 35 24 32 26 L10 38 C8 39 8 42 11 42 L53 42 C56 42 56 39 54 38 Z" />
            <path d="M10 42 L54 42" strokeWidth="2.5" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-colors ${className}`}
      style={{
        backgroundColor: colorHex ? `${colorHex}22` : undefined,
      }}
    >
      {renderIconSvg()}
    </div>
  );
}
