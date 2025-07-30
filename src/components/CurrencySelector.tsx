import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
];

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange, className = '' }) => {
  const { currency } = useApp();
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);

  useEffect(() => {
    // Show currency selection prompt for new users who haven't selected a currency
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (!savedCurrency) {
      setShowCurrencyPrompt(true);
    }
  }, []);

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];
    onCurrencyChange?.(selectedCurrency);
    setShowCurrencyPrompt(false);
    console.log('Currency changed to:', selectedCurrency.code, selectedCurrency.symbol);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className={`w-28 h-8 text-xs border-none shadow-none focus:ring-0 ${
          showCurrencyPrompt ? 'ring-2 ring-primary animate-pulse' : ''
        }`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{currency.symbol}</span>
                <span className="text-xs">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCurrencyPrompt && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-primary text-primary-foreground text-xs rounded shadow-lg z-50">
          Select your preferred currency
        </div>
      )}
    </div>
  );
};

export { CurrencySelector, type Currency };