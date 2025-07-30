import React, { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
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

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange, className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = languages.find(l => l.code === savedLanguage) || languages[0];
      setSelectedLanguage(language);
      onLanguageChange?.(language);
    }
  }, [onLanguageChange]);

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(l => l.code === languageCode) || languages[0];
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
    onLanguageChange?.(language);
    console.log('Language changed to:', language.code, language.nativeName);
    
    // Update document language attribute
    document.documentElement.lang = language.code;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedLanguage.code} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-8 text-xs border-none shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span className="flag-container text-sm leading-none">{language.flag}</span>
                <span className="text-xs">{language.nativeName}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { LanguageSelector, type Language };