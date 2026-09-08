import React from 'react';

interface AH19LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
  sloganLanguage?: 'pt' | 'en';
}

export const AH19LogoMark: React.FC<{ className?: string; sizePx?: number }> = ({
  className = 'w-10 h-10',
  sizePx = 40,
}) => {
  return (
    <div
      className={`relative rounded-xl icon-badge-blend flex items-center justify-center shrink-0 shadow-lg ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[72%] h-[72%] drop-shadow-[0_0_8px_rgba(255,208,0,0.7)]"
      >
        <defs>
          {/* Gradient com mais amarelo (#FFD000) e ouro profundo (#B8860B, #8C5903) e suave reflexo branco */}
          <linearGradient id="ah19GoldMaster" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="10%" stopColor="#FFF275" />
            <stop offset="42%" stopColor="#FFD000" />
            <stop offset="75%" stopColor="#C99712" />
            <stop offset="100%" stopColor="#875803" />
          </linearGradient>

          <linearGradient id="ah19AccentGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#875803" />
            <stop offset="50%" stopColor="#FFD000" />
            <stop offset="100%" stopColor="#FFF9A6" />
          </linearGradient>
        </defs>

        {/* Outer Modern Hexagon-Diamond Crest */}
        <path
          d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
          stroke="url(#ah19GoldMaster)"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Monogram A & H Stylized Geometric Vectors */}
        {/* Left 'A' Stem */}
        <path
          d="M14 34L21 14H25L18 34H14Z"
          fill="url(#ah19GoldMaster)"
        />

        {/* Right 'H' & '19' Vector Ascender with Growth Arrow Angle */}
        <path
          d="M27 14H31V34H27V14Z"
          fill="url(#ah19GoldMaster)"
        />

        {/* Dynamic Connecting Bridge (Forming both the 'A' crossbar and 'H' link) */}
        <path
          d="M17 24H31V27.5H17V24Z"
          fill="url(#ah19AccentGlow)"
        />

        {/* Geometric '19' Ascendant Beacon Node */}
        <circle cx="37" cy="11" r="2.5" fill="#FFFFFF" />
        <circle cx="37" cy="11" r="4" stroke="#FFD000" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export const AH19Logo: React.FC<AH19LogoProps> = ({
  className = '',
  size = 'md',
  showSlogan = true,
  sloganLanguage = 'pt',
}) => {
  const isPt = sloganLanguage === 'pt';
  const sloganText = isPt ? 'Crescimento Real' : 'Real Growth';

  const sizePx = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-[17px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <AH19LogoMark sizePx={sizePx} />

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-black text-white tracking-tight ${titleSize} font-sans`}>
            AH<span className="text-[#FFD000]">19</span>
          </span>
          <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded badge-gold-blend shadow-xs">
            COMMERCE OS
          </span>
        </div>

        {showSlogan && (
          <span
            className="text-[10px] text-neutral-400 font-medium tracking-tight truncate max-w-[220px]"
            title={sloganText}
          >
            {sloganText}
          </span>
        )}
      </div>
    </div>
  );
};
