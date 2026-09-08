import React from 'react';

export const GoldCrownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`drop-shadow-[0_0_10px_rgba(255,208,0,0.5)] ${className}`}
  >
    <defs>
      <linearGradient id="goldCrownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#FFF275" />
        <stop offset="55%" stopColor="#FFD000" />
        <stop offset="85%" stopColor="#C59B27" />
        <stop offset="100%" stopColor="#8A5D05" />
      </linearGradient>
    </defs>
    <path
      fill="url(#goldCrownGradient)"
      stroke="#FFFDE7"
      strokeWidth="0.5"
      d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"
    />
  </svg>
);

export const MetaIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#0081FB] ${className}`}>
    <path d="M12 4.2C7.3 4.2 3.5 7.9 3.5 12.4c0 3.2 1.9 6 4.6 7.4.2.1.4 0 .4-.3v-2.3c-.2-.1-.4-.2-.6-.3-1.8-1-2.9-2.9-2.9-4.9 0-3.3 2.7-6 6-6s6 2.7 6 6c0 2-1.1 3.9-2.9 4.9-.2.1-.4.2-.6.3v2.3c0 .2.2.4.4.3 2.8-1.4 4.6-4.2 4.6-7.4 0-4.5-3.8-8.2-8.5-8.2zm-2.8 10.9c-1.3 0-2.4-1.1-2.4-2.5 0-1.4 1.1-2.5 2.4-2.5 1.1 0 2 .7 2.3 1.7H9.2v1.6h2.3c-.3 1-1.2 1.7-2.3 1.7zm5.6 0c-1.3 0-2.4-1.1-2.4-2.5 0-1.4 1.1-2.5 2.4-2.5 1.1 0 2 .7 2.3 1.7h-2.3v1.6h2.3c-.3 1-1.2 1.7-2.3 1.7z" />
  </svg>
);

export const GoogleAdsIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#FBBC04"
      d="M3.7 15.5l5.8-10c.8-1.4 2.6-1.9 4-1.1l2.5 1.5c1.4.8 1.9 2.6 1.1 4l-5.8 10c-.8 1.4-2.6 1.9-4 1.1L4.8 19.5c-1.4-.8-1.9-2.6-1.1-4z"
    />
    <path
      fill="#4285F4"
      d="M20.3 15.5l-5.8-10c-.8-1.4-2.6-1.9-4-1.1l-2.5 1.5c-1.4.8-1.9 2.6-1.1 4l5.8 10c.8 1.4 2.6 1.9 4 1.1l2.5-1.5c1.4-.8 1.9-2.6 1.1-4z"
    />
    <circle fill="#34A853" cx="7.5" cy="17.5" r="3.2" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-slate-900 ${className}`}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.39 0 .76.08 1.1.22V9.45a6.33 6.33 0 0 0-1.1-.1 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.58a8.28 8.28 0 0 0 4.77 1.5V6.69z" />
  </svg>
);

export const ShopifyIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#95BF47] ${className}`}>
    <path d="M18.8 6.4c-.1-.3-.3-.4-.5-.4l-2.1-.2c-.1 0-.2-.1-.2-.2-.6-1.7-1.7-3.2-3.4-3.6h-.6c-.2.1-.3.3-.4.5l-1 4.7c-.1.3-.3.4-.6.5l-2.4.7c-.3.1-.5.3-.5.6l.8 11.2c.1.9.8 1.6 1.7 1.6h7.6c.9 0 1.6-.7 1.7-1.6l1.2-12.7c0-.3-.1-.6-.3-.7zm-5.6-2.6c.9.3 1.5 1.2 1.9 2.4l-3.3.3.9-2.4c.1-.2.3-.3.5-.3zm-1.8 5.6l1.2-.4-1.2 5.5-1.5-.4 1.5-4.7zm2.3 8.3c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1z" />
  </svg>
);

export const GA4Icon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="3" y="12" width="4" height="9" rx="1.5" fill="#E37400" />
    <rect x="10" y="7" width="4" height="14" rx="1.5" fill="#F9AB00" />
    <rect x="17" y="3" width="4" height="18" rx="1.5" fill="#F9AB00" />
    <circle cx="5" cy="5" r="2.5" fill="#E37400" />
  </svg>
);

export const KlaviyoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-slate-800 ${className}`}>
    <path d="M4 4h16v3H4zm0 6.5h16v3H4zm0 6.5h10v3H4z" />
  </svg>
);

export const StripeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#635BFF] ${className}`}>
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.835 15.01 0 12.33 0 6.574 0 2.6 3.056 2.6 7.828c0 5.064 4.542 6.536 7.64 7.674 2.378.873 3.19 1.583 3.19 2.551 0 .991-.873 1.53-2.355 1.53-2.072 0-4.873-.974-6.858-2.053l-.934 5.568c2.094 1.01 4.964 1.602 7.79 1.602 6.035 0 10.327-2.906 10.327-7.904 0-4.834-4.24-6.43-7.424-7.646z" />
  </svg>
);

export const AmazonIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#FF9900] ${className}`}>
    <path d="M15.4 12.8c-.3.4-.8.7-1.3.7-.8 0-1.2-.6-1.2-1.5 0-1.7 1.3-2.6 2.5-2.6v3.4zm1.9 3.8c-.2.2-.5.2-.7.1-.9-.7-1.1-1-1.6-1.8-1.2 1.4-2.6 1.9-4.2 1.9-2.3 0-3.9-1.5-3.9-3.7 0-1.8 1.1-3.2 2.6-3.9 1.3-.6 3.1-.7 4.5-.9v-.3c0-.6-.1-1.2-.5-1.6-.4-.4-1.1-.6-1.8-.6-1.2 0-2.3.5-2.7 1.2-.1.2-.3.3-.5.2l-1.9-.9c-.2-.1-.2-.4 0-.6 1.1-1.3 2.9-2.1 5.1-2.1 1.6 0 3 .5 3.9 1.4 1 1 1.3 2.3 1.3 4.1v4.4c0 1.2.5 1.7.9 2.3.2.2.1.5-.1.7l-1.3 1.2zM2.8 18.2c.2.2.5.2.7.1 4.7-3.4 11-3.4 16.4-.1.3.2.6.1.7-.1.3-.4.1-.7-.1-.9-5.9-3.6-12.7-3.6-17.9.2-.3.2-.2.6.2.8zm18.3-.4c-.3-.4-1.9-.5-2.9-.4-.3 0-.4.3-.1.5.8.6 2.4.7 2.8.5.3-.2.3-.4.2-.6z" />
  </svg>
);

export const BrandIcon: React.FC<{ iconKey?: string; name?: string; className?: string }> = ({
  iconKey,
  name,
  className = "w-5 h-5",
}) => {
  const key = (iconKey || name || '').toLowerCase();
  switch (key) {
    case 'meta':
    case 'facebook':
    case 'instagram':
      return <MetaIcon className={className} />;
    case 'google':
    case 'google-ads':
      return <GoogleAdsIcon className={className} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    case 'shopify':
      return <ShopifyIcon className={className} />;
    case 'ga4':
      return <GA4Icon className={className} />;
    case 'klaviyo':
      return <KlaviyoIcon className={className} />;
    case 'stripe':
      return <StripeIcon className={className} />;
    case 'amazon':
      return <AmazonIcon className={className} />;
    default:
      return <GoldCrownIcon className={className} />;
  }
};
