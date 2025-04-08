import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InfoTab = () => {
  const { t } = useLanguage(); // Utiliser le contexte de langue pour accéder aux traductions

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
            <Info size={32} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('infoTabTitle')}</h2>
        <p className="text-gray-700 text-sm">{t('infoTabDescription')}</p>
        <p className="text-indigo-600 font-medium mt-4">{t('infoTabStayTuned')}</p>
      </div>
    </div>
  );
};

export default InfoTab;