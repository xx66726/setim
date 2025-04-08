import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, CircleAlert, Clock, Cloud, CloudRain, Droplets, ExternalLink, Shirt, Snowflake, Sun, Thermometer, Umbrella, Wind, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import { getClothingRecommendation } from '../utils/recommendationEngine';
import { WeatherData, ClothingRecommendation } from '../types';
import LoadingState from './LoadingState';
import FeedbackModal from './FeedbackModal'; // Import du composant FeedbackModal
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const OPENWEATHER_API_KEY = '2701ce497b33111bbb5eb1477500628c';

const WeatherRecommendation = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<ClothingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // État pour le FeedbackModal
  const [likeStatus, setLikeStatus] = useState<'liked' | 'none'>('none'); // État pour gérer le statut du like
  const [dislikeStatus, setDislikeStatus] = useState<'disliked' | 'none'>('none'); // État pour gérer le statut du dislike
  const { userData } = useUser();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLike = () => {
    // Enregistrer le like dans localStorage pour donner l'illusion qu'il est pris en compte
    localStorage.setItem('recommendationLiked', 'true');
    setLikeStatus('liked'); // Mettre à jour l'état pour afficher l'animation
    setTimeout(() => {
      setLikeStatus('none'); // Réinitialiser après un court délai
    }, 2000);
  };

  const handleDislike = () => {
    // Déclencher l'animation pour le dislike
    setDislikeStatus('disliked');
    setTimeout(() => {
      setDislikeStatus('none'); // Réinitialiser après un court délai
    }, 2000);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const location = localStorage.getItem('weatherWearLocation');
      if (!location) {
        navigate('/');
        return;
      }

      try {
        console.log(`Fetching weather data for location: ${location}`);
        
        // Properly encode the location parameter for the URL
        const encodedLocation = encodeURIComponent(location);
        
        // Use OpenWeatherMap API with provided key
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language}`
        );
        
        console.log('API response received:', response.status);
        
        // Check if we have a valid response
        if (response.status !== 200 || !response.data) {
          throw new Error(`Invalid response from weather API: ${response.status}`);
        }
        
        const data = response.data;
        
        // Validate that we have the required data fields
        if (!data.name || !data.main || !data.weather || data.weather.length === 0) {
          throw new Error('Incomplete weather data received');
        }
        
        // Convert OpenWeather data to our application format
        const weatherData: WeatherData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          icon: data.weather[0].icon
        };
        
        console.log('Weather data processed successfully:', weatherData);
        setWeather(weatherData);
        
        // Get clothing recommendation based on weather and user style if available
        const clothingRec = getClothingRecommendation(weatherData, userData?.style);
        setRecommendation(clothingRec);

        // Personalized greeting
        const greeting = userData?.name 
          ? `${t('hello')} ${userData.name} ! ${t('searchingWeather')} ${location}...`
          : `${t('hello')} ! ${t('searchingWeather')} ${location}...`;

        // Prepare messages sequence for AI-like experience
        const msgSequence = [
          greeting,
          `${t('weatherFound')} : ${weatherData.description} ${t('with')} ${weatherData.temperature}°C.`,
          `${t('analyzingConditions')}${userData?.style?.style ? ` ${userData.style.style}` : ''}...`,
          `${t('hereIsRecommendation')} ${location} !`
        ];
        setMessages(msgSequence);

        // Display messages sequence
        let index = 0;
        const messageInterval = setInterval(() => {
          if (index < msgSequence.length - 1) {
            index++;
            setCurrentMessageIndex(index);
          } else {
            clearInterval(messageInterval);
            setIsLoading(false);
          }
        }, 1500);

        return () => clearInterval(messageInterval);

      } catch (err) {
        console.error('Error fetching weather data:', err);
        
        // Provide more specific error messages based on error type
        if (axios.isAxiosError(err)) {
          const statusCode = err.response?.status;
          
          if (statusCode === 404) {
            setError(`La ville "${location}" n'a pas été trouvée. Veuillez vérifier l'orthographe et réessayer.`);
          } else if (statusCode === 401) {
            setError('Problème d\'authentification avec le service météo. Veuillez réessayer plus tard.');
          } else if (err.code === 'ECONNABORTED' || !err.response) {
            setError('Impossible de se connecter au service météo. Veuillez vérifier votre connexion internet et réessayer.');
          } else {
            setError(`Problème avec le service météo (code ${statusCode}). Veuillez réessayer plus tard.`);
          }
        } else {
          setError(t('locationError'));
        }
        
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [navigate, userData, language, t]);

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="text-yellow-500 dark:text-yellow-300" size={32} />;
    
    // Match OpenWeather icon codes to our icons
    const iconCode = weather.icon;
    
    if (iconCode.startsWith('01')) {
      return <Sun className="text-yellow-500 dark:text-yellow-300" size={32} />;
    } else if (iconCode.startsWith('02') || iconCode.startsWith('03')) {
      return <Cloud className="text-gray-400 dark:text-gray-300" size={32} />;
    } else if (iconCode.startsWith('04')) {
      return <Cloud className="text-gray-600 dark:text-gray-300" size={32} />;
    } else if (iconCode.startsWith('09') || iconCode.startsWith('10')) {
      return <CloudRain className="text-blue-500 dark:text-blue-300" size={32} />;
    } else if (iconCode.startsWith('11')) {
      return <CloudRain className="text-purple-600 dark:text-purple-300" size={32} />;
    } else if (iconCode.startsWith('13')) {
      return <Snowflake className="text-blue-300" size={32} />;
    } else if (iconCode.startsWith('50')) {
      return <Wind className="text-gray-400 dark:text-gray-300" size={32} />;
    }
    
    return <Sun className="text-yellow-500 dark:text-yellow-300" size={32} />;
  };

  const handleBack = () => {
    navigate('/');
  };

  const handlePinterestClick = () => {
    if (!weather || !recommendation) return;
    
    // Create search terms based on weather conditions and user style
    const temperatureDesc = weather.temperature > 25 
      ? 'summer' 
      : weather.temperature > 15 
        ? 'spring' 
        : weather.temperature > 5 
          ? 'fall' 
          : 'winter';
    
    const weatherDesc = weather.description.toLowerCase().includes('pluie') 
      ? 'rainy' 
      : weather.description.toLowerCase().includes('nuage') 
        ? 'cloudy' 
        : 'sunny';
    
    const styleDesc = userData?.style?.style || 'casual';
    
    // Construct Pinterest search URL
    const searchTerms = `${temperatureDesc} ${weatherDesc} ${styleDesc} outfit`;
    const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTerms)}`;
    
    // Open in new tab
    window.open(pinterestUrl, '_blank', 'noopener,noreferrer');
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <div className="max-w-md w-full text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{error}</h1>
          <button 
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-200">
      <button 
        onClick={handleBack}
        className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium mb-6 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        {t('back')}
      </button>
  
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <LoadingState message={messages[currentMessageIndex]} />
        </div>
      ) : (
        <div className="max-w-4xl w-full mx-auto grid gap-6 md:grid-cols-1 lg:grid-cols-5">
          {weather && (
            <>
              {/* Weather Card */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{weather.location}</h2>
                  <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    {getWeatherIcon()}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                  <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg">
                    <Calendar size={16} className="text-indigo-500 dark:text-indigo-300 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                      {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg">
                    <Clock size={16} className="text-indigo-500 dark:text-indigo-300 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                      {new Date().toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                      <Thermometer size={20} className="text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{weather.temperature}°C</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-300 font-medium">{weather.description}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('currentTemperature')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                      <Droplets size={20} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{weather.humidity}%</div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('humidity')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                      <Wind size={20} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{weather.windSpeed} km/h</div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('windSpeed')}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Recommendations Card */}
              {recommendation && (
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t('clothingRecommendations')}</h2>
                    {userData?.style && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('style')}</span>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                          {userData.style.style}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Main Outfit Card */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border-l-4 border-indigo-500 dark:border-indigo-400">
                      <div className="flex items-start">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                          <Shirt size={20} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg sm:text-xl text-indigo-800 dark:text-indigo-300 mb-2">{t('mainOutfit')}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recommendation.mainOutfit}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Accessories Card */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500 dark:border-blue-400">
                      <div className="flex items-start">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                          <Umbrella size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg sm:text-xl text-blue-800 dark:text-blue-300 mb-2">{t('accessories')}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recommendation.accessories}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tips Card */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-l-4 border-amber-500 dark:border-amber-400">
                      <div className="flex items-start">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm mr-4">
                          <CircleAlert size={20} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg sm:text-xl text-amber-800 dark:text-amber-300 mb-2">{t('dailyTips')}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recommendation.additionalTips}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pinterest Button */}
                  <div className="text-center pt-4">
                    <button
                      onClick={handlePinterestClick}
                      className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      <span className="text-sm font-medium">{t('seePinterestIdeas')}</span>
                    </button>
                  </div>

                  {/* Perfect Match Indicator */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm font-medium">
                      <Check size={14} className="mr-2" />
                      <span>{t('optimalRecommendation')} {weather.temperature}°C</span>
                    </div>
                  </div>

                  {/* Section Like/Dislike */}
                  <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center px-4 py-2 rounded-full transition-all ${
                        likeStatus === 'liked'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-800/30'
                      }`}
                    >
                      {likeStatus === 'liked' ? (
                        <>
                          <Check size={20} className="mr-2" />
                          <span className="text-sm font-medium">{t('liked')}</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp size={20} className="mr-2" />
                          <span className="text-sm font-medium">{t('like')}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDislike}
                      className={`flex items-center px-4 py-2 rounded-full transition-all ${
                        dislikeStatus === 'disliked'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-shake'
                          : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30'
                      }`}
                    >
                      <ThumbsDown size={20} className="mr-2" />
                      <span className="text-sm font-medium">{t('dislike')}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && <FeedbackModal onClose={closeFeedbackModal} />}
    </div>
  );
};

export default WeatherRecommendation;
