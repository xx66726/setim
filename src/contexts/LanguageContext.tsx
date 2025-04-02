import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, TranslationKey, AvailableLanguages } from '../translations';

interface LanguageContextType {
  language: AvailableLanguages;
  setLanguage: (lang: AvailableLanguages) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

const getBrowserLanguage = (): AvailableLanguages => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'fr'; // Default to 'fr' for any other language
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<AvailableLanguages>(() => {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem('timeClothesLanguage') as AvailableLanguages | null;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      return savedLanguage;
    }
    
    // Fall back to browser language
    return getBrowserLanguage();
  });

  // Function to set language and save to localStorage
  const setLanguage = (lang: AvailableLanguages) => {
    setLanguageState(lang);
    localStorage.setItem('timeClothesLanguage', lang);
  };

  // Translator function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Update language based on browser settings when it changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Only update if user hasn't manually set a language
      if (!localStorage.getItem('timeClothesLanguage')) {
        setLanguageState(getBrowserLanguage());
      }
    };

    // This is a bit of a hack since there's no direct event for language change
    window.addEventListener('languagechange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
