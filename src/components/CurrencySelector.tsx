import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.009 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.018 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.016 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.016 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.044 },
];

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange, className = '' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency) || currencies[0];
      setSelectedCurrency(currency);
      onCurrencyChange?.(currency);
    }
  }, [onCurrencyChange]);

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency.code);
    onCurrencyChange?.(currency);
    console.log('Currency changed to:', currency.code, currency.symbol);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-28 h-8 text-xs border-none shadow-none focus:ring-0">
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
    </div>
  );
};

export { CurrencySelector, type Currency };