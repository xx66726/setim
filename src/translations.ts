export type AvailableLanguages = 'fr' | 'en';

export type TranslationKey =
  | 'welcomeMessage'
  | 'enterLocation'
  | 'getRecommendations'
  | 'alreadyViewed'
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
  | 'lightMode'
  | 'footerQuote'
  | 'onboardingwelcome'
  | 'onboardingStep1'
  | 'onboardingStep2'
  | 'onboardingStep3'
  | 'onboardingNamePlaceholder'
  | 'onboardingEmailPlaceholder'
  | 'onboardingNext'
  | 'onboardingStart'
  | 'onboardingErrorName'
  | 'onboardingErrorEmail'
  | 'styleMessage'
  | 'lastVisitMessage'
  | 'shareApp'
  | 'scanQRCode'
  | 'copyLink'
  | 'linkCopied'
  | 'copyFailed'
  | 'shareOnWhatsApp'
  | 'shareOnInstagram'
  | 'shareOnFacebook'
  | 'shareOnTwitter';

type TranslationsType = {
  [key in AvailableLanguages]: {
    [key in TranslationKey]: string;
  };
};

export const translations: TranslationsType = {
  fr: {
    welcomeMessage: 'Votre assistant vestimentaire personnel',
    personalAssistant: 'Votre assistant vestimentaire personnel', // Ajouté ici
    enterLocation: 'Entrez une ville ou un pays',
    getRecommendations: 'Obtenir les recommandations',
    loading: 'Chargement...',
    alreadyViewed: 'Déjà consulté',
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
    lightMode: 'Mode clair',
    footerQuote: "Il n'y a pas de mauvais temps, juste des vêtements inadaptés.",
    onboardingwelcome: "Bienvenue sur WeatherWear !",
    onboardingStep1: "Comment dois-je vous appeler ?",
    onboardingStep2: "Quel est votre style vestimentaire préféré ?",
    onboardingStep3: "Sois toujours à la pointe ! Entre ton email pour rester exclusif et montrer ton style unique.",
    onboardingNamePlaceholder: "Votre nom",
    onboardingEmailPlaceholder: "Votre email",
    onboardingNext: "Suivant",
    onboardingStart: "Commencer",
    onboardingErrorName: "Veuillez entrer votre nom",
    onboardingErrorEmail: "Veuillez entrer un email valide",
    styleMessage: "Votre style préféré est {style}. Je vais m'assurer que mes recommandations respectent votre goût !",
    lastVisitMessage: "La dernière fois que nous nous sommes vus, c'était le {date} à {time}. Heureux de vous retrouver !",
    shareApp: "Partager l'application",
    scanQRCode: "Scannez ce QR code pour accéder directement à l'application",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié !",
    copyFailed: "Échec de la copie",
    shareOnWhatsApp: "Partager sur WhatsApp",
    shareOnInstagram: "Partager sur Instagram",
    shareOnFacebook: "Partager sur Facebook",
    shareOnTwitter: "Partager sur Twitter",
  },
  en: {
    welcomeMessage: 'Your smart weather-based clothing assistant',
    personalAssistant: 'Your smart weather-based clothing assistant', // Ajouté ici
    enterLocation: 'Enter your city or country',
    getRecommendations: 'Get recommendations',
    alreadyViewed: 'Already viewed',
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
    lightMode: 'Light mode',
    footerQuote: "There is no such thing as bad weather, only inappropriate clothing.",
    onboardingwelcome: "Welcome to WeatherWear!",
    onboardingStep1: "What should I call you?",
    onboardingStep2: "What is your favorite clothing style?",
    onboardingStep3: "Stay ahead of the curve! Enter your email to stay exclusive and show your unique style.",
    onboardingNamePlaceholder: "Your name",
    onboardingEmailPlaceholder: "Your email",
    onboardingNext: "Next",
    onboardingStart: "Start",
    onboardingErrorName: "Please enter your name",
    onboardingErrorEmail: "Please enter a valid email",
    styleMessage: "Your preferred style is {style}. I'll make sure my recommendations match your taste!",
    lastVisitMessage: "The last time we saw each other was on {date} at {time}. Happy to see you again!",
    shareApp: "Share the app",
    scanQRCode: "Scan this QR code to access the app directly",
    copyLink: "Copy the link",
    linkCopied: "Link copied!",
    copyFailed: "Copy failed",
    shareOnWhatsApp: "Share on WhatsApp",
    shareOnInstagram: "Share on Instagram",
    shareOnFacebook: "Share on Facebook",
    shareOnTwitter: "Share on Twitter",
  },
};
