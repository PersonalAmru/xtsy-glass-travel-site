import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  formatPrice: (price: number) => string;
}

const defaultCurrency: Currency = { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 };
const defaultLanguage: Language = { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedLanguage = localStorage.getItem('selectedLanguage');

    if (savedCurrency) {
      // We'll need to import the currencies array, but for now use a simple mapping
      const currencies = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
        { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
        { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
        { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.009 },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.018 },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.016 },
        { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.016 },
        { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.044 },
      ];
      const foundCurrency = currencies.find(c => c.code === savedCurrency);
      if (foundCurrency) setCurrency(foundCurrency);
    }

    if (savedLanguage) {
      const languages = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
        { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
        { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
        { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
      ];
      const foundLanguage = languages.find(l => l.code === savedLanguage);
      if (foundLanguage) setLanguage(foundLanguage);
    }
  }, []);

  useEffect(() => {
    // Update document language attribute when language changes
    document.documentElement.lang = language.code;
  }, [language]);

  const formatPrice = (price: number): string => {
    const convertedPrice = price * currency.rate;
    return `${currency.symbol}${convertedPrice.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency.code);
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage.code);
  };

  const value: AppContextType = {
    currency,
    language,
    setCurrency: handleSetCurrency,
    setLanguage: handleSetLanguage,
    formatPrice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};