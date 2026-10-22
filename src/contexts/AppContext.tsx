import { SELF_TRACKING_ENABLED } from '@/lib/selfTracking';
import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabase } from '@/integrations/supabase/lazy';
import { deferUntilIdle } from '@/utils/deferUntilIdle';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface AppContextType {
  currency: Currency;
  exchangeRates: Record<string, number>;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

// Available currencies and languages
const availableCurrencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
];

const availableLanguages: Language[] = [
  // European Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  
  // Asian Languages
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

// Default values
const defaultCurrency: Currency = availableCurrencies[0];
const defaultLanguage: Language = availableLanguages[0];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch exchange rates from Edge Function (non-blocking with deduplication)
  const fetchExchangeRates = async () => {
    // Rates change once a day, so keep them for 12 hours across visits (one request per visitor
    // per half day instead of one per tab session — fewer 429s from shared networks).
    const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
    const cachedRates = read('exchangeRates');
    const cacheTime = read('exchangeRatesTime');
    const ttl = 12 * 60 * 60 * 1000;
    
    if (cachedRates && cacheTime && (Date.now() - parseInt(cacheTime)) < ttl) {
      const rates = JSON.parse(cachedRates);
      setExchangeRates(rates);
      availableCurrencies.forEach(curr => {
        curr.rate = rates[curr.code] || curr.rate;
      });
      console.log('Exchange rates loaded from cache');
      return;
    }

    try {
      const { data, error } = await (await getSupabase()).functions.invoke('fetch-exchange-rates', {
        body: {},
      });

      if (error) throw error;

      const newRates = data.rates || {
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
      };
      
      setExchangeRates(newRates);
      
      // Update currency rates in available currencies
      availableCurrencies.forEach(curr => {
        curr.rate = newRates[curr.code] || curr.rate;
      });
      
      // Cache for 12 hours (see above)
      try {
        localStorage.setItem('exchangeRates', JSON.stringify(newRates));
        localStorage.setItem('exchangeRatesTime', Date.now().toString());
      } catch { /* storage unavailable: rates stay in memory */ }
      
      console.log('Exchange rates updated from Edge Function:', newRates);
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback:', error);
      // Keep existing fallback rates - app remains functional
    }
  };

  // Load saved currency preference and fetch exchange rates (non-blocking)
  useEffect(() => {
    const initializeCurrency = async () => {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      const hasManualSelection = localStorage.getItem('hasManualCurrencySelection');
      
      if (savedCurrency && hasManualSelection === 'true') {
        // User has manually selected a currency, respect their choice
        try {
          const parsedCurrency = JSON.parse(savedCurrency);
          const matchedCurrency = availableCurrencies.find(c => c.code === parsedCurrency.code) || defaultCurrency;
          setCurrencyState(matchedCurrency);
        } catch (error) {
          console.warn('Failed to parse saved currency:', error);
        }
      } else if (!savedCurrency) {
        // First visit - auto-detect location and set currency
        try {
          const { detectUserLocation } = await import('@/utils/locationDetection');
          const locationData = await detectUserLocation();
          
          // Log anonymized location data (GDPR compliant - only country code)
          // This is completely non-blocking and failures are silently ignored
          if (SELF_TRACKING_ENABLED) void getSupabase().then((sb) => sb.from('user_location_preferences').insert({
            country_code: locationData.country,
            detected_currency: locationData.currency,
            detected_at: new Date().toISOString()
          }));
          
          // Set currency based on detected location
          const detectedCurrency = availableCurrencies.find(c => c.code === locationData.currency);
          if (detectedCurrency) {
            setCurrencyState(detectedCurrency);
            localStorage.setItem('selectedCurrency', JSON.stringify(detectedCurrency));
            console.log('Currency auto-set to:', locationData.currency);
          }
        } catch (error) {
          console.warn('Auto-detection failed, using default currency:', error);
          // Fallback to default currency (INR)
        }
      } else if (savedCurrency && hasManualSelection !== 'true') {
        // Currency was set but not manually - load it
        try {
          const parsedCurrency = JSON.parse(savedCurrency);
          const matchedCurrency = availableCurrencies.find(c => c.code === parsedCurrency.code) || defaultCurrency;
          setCurrencyState(matchedCurrency);
        } catch (error) {
          console.warn('Failed to parse saved currency:', error);
        }
      }
      
      // Mark as initialized
      setIsInitialized(true);
    };
    
    initializeCurrency();
    
    // Fetch exchange rates AFTER LCP (non-blocking, deferred until idle so it
    // never competes with the critical first render). Falls back to cached/default rates.
    deferUntilIdle(() => { void fetchExchangeRates(); });
    
    // Set up interval to fetch rates every 12 hours (Edge Function handles caching)
    const interval = setInterval(fetchExchangeRates, 12 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number): string => {
    const convertedPrice = price * currency.rate;
    return `${currency.symbol}${convertedPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const handleSetCurrency = (newCurrency: Currency) => {
    const updatedCurrency = { ...newCurrency, rate: exchangeRates[newCurrency.code] || newCurrency.rate };
    setCurrencyState(updatedCurrency);
    localStorage.setItem('selectedCurrency', JSON.stringify(updatedCurrency));
    // Mark that user has manually selected a currency
    localStorage.setItem('hasManualCurrencySelection', 'true');
    console.log('Currency manually updated:', updatedCurrency);
  };

  return (
    <AppContext.Provider 
      value={{
        currency,
        exchangeRates,
        setCurrency: handleSetCurrency,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};