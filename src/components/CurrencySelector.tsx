
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

// Remove local currencies array - use global state from AppContext

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange, className = '' }) => {
  const { currency, setCurrency } = useApp();
  const [showCurrencyPrompt, setShowCurrencyPrompt] = useState(false);
  
  // Available currencies (should match AppContext)
  const availableCurrencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
  ];

  useEffect(() => {
    // Show currency selection prompt for new users who haven't selected a currency
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (!savedCurrency) {
      setShowCurrencyPrompt(true);
    }
  }, []);

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = availableCurrencies.find(c => c.code === currencyCode) || availableCurrencies[0];
    
    // Update global currency state
    setCurrency(selectedCurrency);
    
    // Call optional callback for backward compatibility
    onCurrencyChange?.(selectedCurrency);
    
    setShowCurrencyPrompt(false);
    console.log('Currency changed to:', selectedCurrency.code, selectedCurrency.symbol);
  };

  return (
    <div className={`flex items-center gap-2 relative ${className}`}>
      <Globe className="h-4 w-4 text-white/80" />
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className={`w-28 h-8 text-xs bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-white/40 hover:bg-white/15 transition-all ${
          showCurrencyPrompt ? 'ring-2 ring-primary animate-pulse' : ''
        } ${className.includes('w-full') ? 'w-full h-10' : ''}`}>
          <SelectValue className="text-white" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 backdrop-blur-md border border-white/20 shadow-xl z-50">
          {availableCurrencies.map((currency) => (
            <SelectItem 
              key={currency.code} 
              value={currency.code}
              className="text-white hover:bg-white/10 focus:bg-white/20 focus:text-white"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white">{currency.symbol}</span>
                <span className="text-xs text-white/90">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCurrencyPrompt && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-primary/90 backdrop-blur-sm text-white text-xs rounded shadow-lg z-50">
          Select your preferred currency
        </div>
      )}
    </div>
  );
};

export { CurrencySelector, type Currency };
