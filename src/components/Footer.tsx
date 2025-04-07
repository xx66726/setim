import React from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Assurez-vous que ce hook existe pour gérer la langue
import { translations } from '../translations';

const Footer: React.FC = () => {
  const { language } = useLanguage(); // Récupère la langue actuelle (fr ou en)

  return (
    <footer className="px-4 py-2 w-full text-center text-xs text-gray-500 dark:text-gray-400 bg-transparent">
      <p className="italic mb-1">{translations[language].footerQuote}</p>
      <p>by TimesClothes</p>
    </footer>
  );
};

export default Footer;
