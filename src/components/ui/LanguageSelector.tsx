import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LS_KEY = 'e4d_lang';

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français' }
];

// Enhanced language selector with dropdown and language names
export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const current = i18n.language?.substring(0, 2) || 'en';
  const currentLang = LANGUAGES.find(lang => lang.code === current);

  // Initialize language on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      if (saved !== i18n.language) i18n.changeLanguage(saved);
    } else {
      // Force default to English if nothing stored
      if (i18n.language !== 'en') i18n.changeLanguage('en');
      localStorage.setItem(LS_KEY, 'en');
    }
  }, [i18n]);

  const switchLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem(LS_KEY, langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors min-w-[120px] justify-between bg-white"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Select language"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang?.flag}</span>
          <span className="text-sm font-medium">{currentLang?.nativeName}</span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1" role="listbox">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  current === lang.code 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700'
                }`}
                role="option"
                aria-selected={current === lang.code}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {current === lang.code && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
