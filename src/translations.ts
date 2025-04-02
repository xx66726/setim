export type AvailableLanguages = 'fr' | 'en';

export type TranslationKey =
  | 'welcomeMessage'
  | 'enterLocation'
  | 'getRecommendations'
  | 'loading'
  | 'back'
  | 'weatherIn'
  | 'currentTemperature'
  | 'humidity'
  | 'windSpeed'
  | 'clothingRecommendations'
  | 'mainOutfit'
  | 'accessories'
  | 'dailyTips'
  | 'seePinterestIdeas'
  | 'optimalRecommendation'
  | 'style'
  | 'preferredColors'
  | 'locationError'
  | 'tryAgain'
  | 'hello'
  | 'searchingWeather'
  | 'weatherFound'
  | 'analyzingConditions'
  | 'hereIsRecommendation'
  | 'darkMode'
  | 'lightMode';

type TranslationsType = {
  [key in AvailableLanguages]: {
    [key in TranslationKey]: string;
  };
};

export const translations: TranslationsType = {
  fr: {
    welcomeMessage: 'Votre assistant vestimentaire intelligent basé sur la météo',
    enterLocation: 'Entrez votre ville ou pays',
    getRecommendations: 'Obtenir des recommandations',
    loading: 'Chargement...',
    back: 'Retour',
    weatherIn: 'Météo à',
    currentTemperature: 'Température actuelle',
    humidity: 'Humidité',
    windSpeed: 'Vitesse du vent',
    clothingRecommendations: 'Recommandations vestimentaires',
    mainOutfit: 'Tenue principale',
    accessories: 'Accessoires',
    dailyTips: 'Conseils du jour',
    seePinterestIdeas: 'Voir des idées sur Pinterest',
    optimalRecommendation: 'Recommandation optimale pour',
    style: 'Style',
    preferredColors: 'Couleurs préférées',
    locationError: 'Impossible de récupérer les données météo. Veuillez vérifier le nom de la ville et réessayer.',
    tryAgain: 'Réessayer',
    hello: 'Bonjour',
    searchingWeather: 'Je recherche la météo à',
    weatherFound: 'J\'ai trouvé les conditions météo actuelles',
    analyzingConditions: 'Analysons les conditions pour vous proposer une tenue adaptée à votre style',
    hereIsRecommendation: 'Voici ma recommandation vestimentaire pour aujourd\'hui à',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair'
  },
  en: {
    welcomeMessage: 'Your smart weather-based clothing assistant',
    enterLocation: 'Enter your city or country',
    getRecommendations: 'Get recommendations',
    loading: 'Loading...',
    back: 'Back',
    weatherIn: 'Weather in',
    currentTemperature: 'Current temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind speed',
    clothingRecommendations: 'Clothing recommendations',
    mainOutfit: 'Main outfit',
    accessories: 'Accessories',
    dailyTips: 'Daily tips',
    seePinterestIdeas: 'See ideas on Pinterest',
    optimalRecommendation: 'Optimal recommendation for',
    style: 'Style',
    preferredColors: 'Preferred colors',
    locationError: 'Unable to retrieve weather data. Please check the city name and try again.',
    tryAgain: 'Try again',
    hello: 'Hello',
    searchingWeather: 'I\'m searching for the weather in',
    weatherFound: 'I found the current weather conditions',
    analyzingConditions: 'Analyzing conditions to recommend an outfit that matches your style',
    hereIsRecommendation: 'Here is my clothing recommendation for today in',
    darkMode: 'Dark mode',
    lightMode: 'Light mode'
  }
};
