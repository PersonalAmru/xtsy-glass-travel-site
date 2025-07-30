import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectUserLocation, fetchExchangeRates } from '@/utils/locationDetection';

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
  language: Language;
  exchangeRates: Record<string, number>;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  formatPrice: (price: number) => string;
  updateExchangeRates: () => Promise<void>;
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
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-detect location and set preferences on first load
  useEffect(() => {
    const initializePreferences = async () => {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      const savedLanguage = localStorage.getItem('selectedLanguage');
      
      if (savedCurrency && savedLanguage) {
        // Use saved preferences
        try {
          const parsedCurrency = JSON.parse(savedCurrency);
          const parsedLanguage = JSON.parse(savedLanguage);
          setCurrencyState(parsedCurrency);
          setLanguageState(parsedLanguage);
        } catch (error) {
          console.warn('Failed to parse saved preferences:', error);
        }
      } else {
        // Auto-detect based on location
        try {
          const locationData = await detectUserLocation();
          
          const detectedCurrency = availableCurrencies.find(c => c.code === locationData.currency) || defaultCurrency;
          const detectedLanguage = availableLanguages.find(l => l.code === locationData.language) || defaultLanguage;
          
          setCurrencyState(detectedCurrency);
          setLanguageState(detectedLanguage);
          
          // Save auto-detected preferences
          localStorage.setItem('selectedCurrency', JSON.stringify(detectedCurrency));
          localStorage.setItem('selectedLanguage', JSON.stringify(detectedLanguage));
          
          console.log('Auto-detected preferences:', { currency: detectedCurrency.code, language: detectedLanguage.code });
        } catch (error) {
          console.warn('Failed to auto-detect location, using defaults:', error);
        }
      }
      
      // Fetch real-time exchange rates
      await updateExchangeRates();
      setIsInitialized(true);
    };

    initializePreferences();
  }, []);

  // Update document language when language changes
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.lang = language.code;
    }
  }, [language.code, isInitialized]);

  const updateExchangeRates = async () => {
    try {
      const rates = await fetchExchangeRates('INR');
      setExchangeRates(rates);
      
      // Update current currency with new rate
      const updatedCurrency = { ...currency, rate: rates[currency.code] || currency.rate };
      setCurrencyState(updatedCurrency);
      
      console.log('Exchange rates updated:', rates);
    } catch (error) {
      console.warn('Failed to update exchange rates:', error);
    }
  };

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
    console.log('Currency updated:', updatedCurrency);
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('selectedLanguage', JSON.stringify(newLanguage));
    console.log('Language updated:', newLanguage);
  };

  return (
    <AppContext.Provider 
      value={{
        currency,
        language,
        exchangeRates,
        setCurrency: handleSetCurrency,
        setLanguage: handleSetLanguage,
        formatPrice,
        updateExchangeRates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};