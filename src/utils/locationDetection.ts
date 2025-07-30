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

export const detectUserLocation = async (): Promise<LocationData> => {
  try {
    // Try to get location from IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const country = data.country_code || 'IN';
    const currency = countryCurrencyMap[country] || 'INR';
    const language = countryLanguageMap[country] || 'en';
    
    return { country, currency, language };
  } catch (error) {
    console.warn('Failed to detect location, using defaults:', error);
    // Fallback to browser language if available
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'nl', 'zh', 'ja', 'ko', 'hi', 'th', 'vi', 'id', 'ms', 'ar'];
    const language = supportedLanguages.includes(browserLang) ? browserLang : 'en';
    
    return { 
      country: 'IN', 
      currency: 'INR', 
      language 
    };
  }
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