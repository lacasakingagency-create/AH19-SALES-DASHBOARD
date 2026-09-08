import { Request } from 'express';

export interface DetectedGeoInfo {
  ip: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  device_type: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  operating_system: string;
}

/**
 * Extracts real client IP address avoiding internal container IPs
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const parts = forwarded.split(',');
    return parts[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  if (typeof req.headers['x-real-ip'] === 'string') {
    return req.headers['x-real-ip'];
  }
  if (typeof req.headers['cf-connecting-ip'] === 'string') {
    return req.headers['cf-connecting-ip'];
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Parses user agent string into device type, browser, and OS
 */
export function parseUserAgent(uaString: string = ''): {
  device_type: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  operating_system: string;
} {
  let device_type: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(uaString)) {
    device_type = 'Tablet';
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(uaString)) {
    device_type = 'Mobile';
  }

  let browser = 'Chrome';
  if (/Edg\//i.test(uaString)) {
    browser = 'Edge';
  } else if (/Chrome|CriOS/i.test(uaString) && !/Edg/i.test(uaString)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(uaString) && !/Chrome/i.test(uaString)) {
    browser = 'Safari';
  } else if (/Firefox|FxiOS/i.test(uaString)) {
    browser = 'Firefox';
  } else if (/MSIE|Trident/i.test(uaString)) {
    browser = 'Internet Explorer';
  }

  let operating_system = 'Windows';
  if (/Mac OS X|macOS/i.test(uaString) && !/iPhone|iPad/i.test(uaString)) {
    operating_system = 'macOS';
  } else if (/iPhone|iPad|iPod/i.test(uaString)) {
    operating_system = 'iOS';
  } else if (/Android/i.test(uaString)) {
    operating_system = 'Android';
  } else if (/Linux/i.test(uaString)) {
    operating_system = 'Linux';
  } else if (/Windows/i.test(uaString)) {
    operating_system = 'Windows';
  }

  return { device_type, browser, operating_system };
}

/**
 * Detects visitor geolocation using Vercel/Cloudflare edge headers,
 * IP intelligence, with zero reliance on Google Maps GPS API.
 */
export async function detectLocationFromRequest(req: Request): Promise<DetectedGeoInfo> {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const parsedUa = parseUserAgent(userAgent);

  // 1. Check Vercel Edge Headers
  const vercelCountry = req.headers['x-vercel-ip-country'] as string;
  const vercelRegion = req.headers['x-vercel-ip-country-region'] as string;
  const vercelCity = req.headers['x-vercel-ip-city'] as string;
  const vercelLat = req.headers['x-vercel-ip-latitude'] as string;
  const vercelLon = req.headers['x-vercel-ip-longitude'] as string;
  const vercelTimezone = req.headers['x-vercel-ip-timezone'] as string;

  // 2. Check Cloudflare Headers
  const cfCountry = req.headers['cf-ipcountry'] as string;

  if (vercelCountry && vercelCountry.length === 2) {
    return {
      ip,
      country: getCountryNameFromCode(vercelCountry),
      country_code: vercelCountry.toUpperCase(),
      region: vercelRegion ? decodeURIComponent(vercelRegion) : '',
      city: vercelCity ? decodeURIComponent(vercelCity) : 'City',
      timezone: vercelTimezone || 'UTC',
      latitude: vercelLat ? parseFloat(vercelLat) : null,
      longitude: vercelLon ? parseFloat(vercelLon) : null,
      ...parsedUa,
    };
  }

  if (cfCountry && cfCountry.length === 2) {
    return {
      ip,
      country: getCountryNameFromCode(cfCountry),
      country_code: cfCountry.toUpperCase(),
      region: '',
      city: 'Metropolitan Area',
      timezone: 'UTC',
      latitude: null,
      longitude: null,
      ...parsedUa,
    };
  }

  // 3. Optional external IP lookup (if IP is public and not localhost)
  const isLocal =
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.');

  if (!isLocal) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,timezone`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success') {
          return {
            ip,
            country: json.country || 'United States',
            country_code: (json.countryCode || 'US').toUpperCase(),
            region: json.regionName || 'Florida',
            city: json.city || 'Miami',
            timezone: json.timezone || 'America/New_York',
            latitude: json.lat || 25.7617,
            longitude: json.lon || -80.1918,
            ...parsedUa,
          };
        }
      }
    } catch {
      // Fallback below
    }
  }

  // Default development fallback for realistic local testing
  return {
    ip: isLocal ? '67.220.149.1' : ip,
    country: 'United States',
    country_code: 'US',
    region: 'Florida',
    city: 'Miami',
    timezone: 'America/New_York',
    latitude: 25.7617,
    longitude: -80.1918,
    ...parsedUa,
  };
}

function getCountryNameFromCode(code: string): string {
  switch (code.toUpperCase()) {
    case 'US': return 'United States';
    case 'GB': return 'United Kingdom';
    case 'BR': return 'Brazil';
    case 'JP': return 'Japan';
    case 'DE': return 'Germany';
    case 'FR': return 'France';
    case 'CA': return 'Canada';
    case 'AU': return 'Australia';
    case 'IT': return 'Italy';
    case 'ES': return 'Spain';
    case 'PT': return 'Portugal';
    case 'MX': return 'Mexico';
    case 'AR': return 'Argentina';
    case 'CL': return 'Chile';
    case 'CO': return 'Colombia';
    case 'NL': return 'Netherlands';
    case 'SE': return 'Sweden';
    case 'CH': return 'Switzerland';
    default: return code;
  }
}
