import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
        aria-label="Changer de langue"
        title="Changer de langue"
      >
        <Globe size={20} className="text-indigo-600 dark:text-indigo-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => selectLanguage('fr')}
            className={`w-full text-left px-4 py-2 text-sm ${
              language === 'fr' 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Français 🇫🇷
          </button>
          <button
            onClick={() => selectLanguage('en')}
            className={`w-full text-left px-4 py-2 text-sm ${
              language === 'en' 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            English 🇬🇧
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
