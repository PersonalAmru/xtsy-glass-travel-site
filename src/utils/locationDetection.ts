interface LocationData {
  country: string;
  currency: string;
  language: string;
}

// Country to currency mapping
const countryCurrencyMap: Record<string, string> = {
  'US': 'USD',
  'IN': 'INR',
  'DE': 'EUR',
  'FR': 'EUR',
  'ES': 'EUR',
  'IT': 'EUR',
  'PT': 'EUR',
  'NL': 'EUR',
  'AT': 'EUR',
  'BE': 'EUR',
  'FI': 'EUR',
  'IE': 'EUR',
  'LU': 'EUR',
  'MT': 'EUR',
  'SI': 'EUR',
  'SK': 'EUR',
  'EE': 'EUR',
  'LV': 'EUR',
  'LT': 'EUR',
  'CY': 'EUR',
  'GR': 'EUR',
  // Default to INR for other countries
};

// Country to language mapping
const countryLanguageMap: Record<string, string> = {
  'US': 'en',
  'GB': 'en',
  'AU': 'en',
  'CA': 'en',
  'NZ': 'en',
  'DE': 'de',
  'FR': 'fr',
  'ES': 'es',
  'IT': 'it',
  'PT': 'pt',
  'RU': 'ru',
  'PL': 'pl',
  'NL': 'nl',
  'CN': 'zh',
  'JP': 'ja',
  'KR': 'ko',
  'IN': 'hi',
  'TH': 'th',
  'VN': 'vi',
  'ID': 'id',
  'MY': 'ms',
  'SA': 'ar',
  'AE': 'ar',
  // Default to English for other countries
};

// Euro-area time zones → country (the only places where the currency differs from the default).
const EURO_TZ: Record<string, string> = {
  'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT',
  'Europe/Amsterdam': 'NL', 'Europe/Vienna': 'AT', 'Europe/Brussels': 'BE', 'Europe/Helsinki': 'FI', 'Europe/Dublin': 'IE',
  'Europe/Luxembourg': 'LU', 'Europe/Malta': 'MT', 'Europe/Ljubljana': 'SI', 'Europe/Bratislava': 'SK', 'Europe/Tallinn': 'EE',
  'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT', 'Asia/Nicosia': 'CY', 'Europe/Athens': 'GR',
};

/**
 * Visitor's country (for the default currency and language), worked out in the browser from its
 * time zone and language — no request to a third-party IP-lookup service, so nothing slows the
 * page and no IP address leaves the visitor's device.
 */
export const detectUserLocation = async (): Promise<LocationData> => {
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* old browser */ }
  const region = (typeof navigator !== 'undefined' ? navigator.language : 'en-IN').split('-')[1]?.toUpperCase() || '';
  const country =
    tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' ? 'IN'
    : EURO_TZ[tz] ? EURO_TZ[tz]
    : tz.startsWith('America/') && (region === 'US' || !region) ? 'US'
    : region || 'IN';
  const browserLang = (typeof navigator !== 'undefined' ? navigator.language : 'en').split('-')[0];
  const supportedLanguages = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'nl', 'zh', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'ar'];
  return {
    country,
    currency: countryCurrencyMap[country] || 'INR',
    language: supportedLanguages.includes(browserLang) ? browserLang : countryLanguageMap[country] || 'en',
  };
};

// Fetch real-time exchange rates
export const fetchExchangeRates = async (baseCurrency: string = 'INR'): Promise<Record<string, number>> => {
  try {
    // Using a free exchange rate API
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const data = await response.json();
    
    return {
      INR: baseCurrency === 'INR' ? 1 : 1 / data.rates.INR,
      USD: baseCurrency === 'USD' ? 1 : data.rates.USD,
      EUR: baseCurrency === 'EUR' ? 1 : data.rates.EUR,
    };
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using defaults:', error);
    // Fallback rates (approximate)
    return {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
    };
  }
};