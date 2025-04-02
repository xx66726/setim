import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { userData, isFirstVisit } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // If first visit, redirect to onboarding
    if (isFirstVisit) {
      navigate('/onboarding');
    }
    
    // Get previously used location if available
    const savedLocation = localStorage.getItem('weatherWearLocation');
    if (savedLocation) {
      setLocation(savedLocation);
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
    
    // Store the location in localStorage and navigate to recommendation
    localStorage.setItem('weatherWearLocation', location);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/recommendation');
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">WeatherWear</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('welcomeMessage')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="mb-6">
            {userData && (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {t('hello')} {userData.name} ! {userData.visitCount > 2 ? (language === 'fr' ? "Ravi de vous revoir !" : "Nice to see you again!") : (language === 'fr' ? "Comment puis-je vous aider aujourd'hui ?" : "How can I help you today?")}
              </h2>
            )}
            {userData && userData.lastVisit && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === 'fr' 
                  ? `Votre dernière visite était le ${new Date(userData.lastVisit).toLocaleDateString()} à ${new Date(userData.lastVisit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`
                  : `Your last visit was on ${new Date(userData.lastVisit).toLocaleDateString()} at ${new Date(userData.lastVisit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`
                }
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition pl-10"
                placeholder={t('enterLocation')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            
            {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
              ) : null}
              {isLoading ? t('loading') : t('getRecommendations')}
            </button>
          </form>
        </div>

        {userData && userData.style && (
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>{t('style')}: <span className="font-medium">{userData.style.style}</span></p>
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
