import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Search } from 'lucide-react'; // Importer l'icône de validation
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import NotificationButton from './NotificationButton';

const Home = () => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasViewedRecommendations, setHasViewedRecommendations] = useState(false); // Nouvel état
  const { userData, isFirstVisit } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Si c'est la première visite, rediriger vers l'onboarding
    if (isFirstVisit) {
      navigate('/onboarding');
    }

    // Récupérer la localisation précédemment utilisée si disponible
    const savedLocation = localStorage.getItem('weatherWearLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }

    // Vérifier si l'utilisateur a déjà consulté les recommandations aujourd'hui
    const lastViewedDate = localStorage.getItem('lastViewedRecommendations');
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    if (lastViewedDate === today) {
      setHasViewedRecommendations(true);
    }
  }, [isFirstVisit, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Veuillez entrer une ville ou un pays');
      return;
    }

    setError('');
    setIsLoading(true);

    // Stocker la localisation et la date de consultation dans localStorage
    localStorage.setItem('weatherWearLocation', location);
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    localStorage.setItem('lastViewedRecommendations', today);

    setTimeout(() => {
      setIsLoading(false);
      setHasViewedRecommendations(true); // Mettre à jour l'état
      navigate('/recommendation');
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">
            WeatherWear
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('welcomeMessage')}
          </p>
        </div>

        {/* Bouton de notification */}
        <NotificationButton />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="mb-6">
            {userData && (
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {t('hello')} {userData.name} !{' '}
                {userData.visitCount > 2
                  ? language === 'fr'
                    ? 'Ravi de vous revoir !'
                    : 'Nice to see you again!'
                  : language === 'fr'
                  ? "Comment puis-je vous aider aujourd'hui ?"
                  : 'How can I help you today?'} 
              </h2>
            )}
            {userData && userData.lastVisit && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('lastVisitMessage')
                  .replace('{date}', new Date(userData.lastVisit).toLocaleDateString())
                  .replace(
                    '{time}',
                    new Date(userData.lastVisit).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  )}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition pl-10 text-sm sm:text-base"
                placeholder={t('enterLocation')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={hasViewedRecommendations} // Désactiver si déjà consulté
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className={`w-full ${
                hasViewedRecommendations
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              } text-white font-medium py-3 rounded-lg transition flex items-center justify-center text-sm sm:text-base`}
              disabled={hasViewedRecommendations || isLoading} // Désactiver si déjà consulté ou en chargement
            >
              {hasViewedRecommendations ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('alreadyViewed')}
                </>
              ) : isLoading ? (
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
              ) : (
                t('getRecommendations')
              )}
            </button>
          </form>
        </div>

        {userData && userData.style && (
          <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            <p>
              {t('styleMessage').replace('{style}', userData.style.style)}
            </p>
            <div className="flex justify-center mt-2 space-x-2">
              {userData.style.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
