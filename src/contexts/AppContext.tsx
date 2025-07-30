import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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

  // Fetch real-time exchange rates
  const fetchExchangeRates = async () => {
    try {
      // Using a free API that provides real-time exchange rates
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
      const rates = response.data.rates;
      
      const newRates = {
        INR: 1,
        USD: rates.USD || 0.012,
        EUR: rates.EUR || 0.011,
      };
      
      setExchangeRates(newRates);
      
      // Update currency rates in available currencies
      availableCurrencies.forEach(curr => {
        curr.rate = newRates[curr.code] || curr.rate;
      });
      
      console.log('Exchange rates updated:', newRates);
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using fallback rates:', error);
      // Keep existing fallback rates
    }
  };

  // Load saved currency preference and fetch exchange rates on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    
    if (savedCurrency) {
      try {
        const parsedCurrency = JSON.parse(savedCurrency);
        const matchedCurrency = availableCurrencies.find(c => c.code === parsedCurrency.code) || defaultCurrency;
        setCurrencyState(matchedCurrency);
      } catch (error) {
        console.warn('Failed to parse saved currency:', error);
      }
    }
    
    // Fetch current exchange rates
    fetchExchangeRates();
    
    // Set up interval to fetch rates every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    
    setIsInitialized(true);
    
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
    console.log('Currency updated:', updatedCurrency);
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