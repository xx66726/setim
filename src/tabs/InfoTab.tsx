import { Info } from 'lucide-react';

const InfoTab = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full">
            <Info size={32} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">À venir bientôt !</h2>
        <p className="text-gray-700 text-sm">
          Cet onglet sera bientôt mis à jour avec toutes les nouvelles informations liées à <strong>TimesClothes</strong>. Restez à l'écoute pour découvrir les dernières actualités et fonctionnalités !
        </p>
      </div>
    </div>
  );
};

export default InfoTab;