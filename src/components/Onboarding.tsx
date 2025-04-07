import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Palette, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // Importer le contexte du thème
import { translations } from '../translations';

const styleOptions = [
  { id: 'casual', name: 'Casual', colors: ['#3b82f6', '#000000', '#6b7280'] },
  { id: 'formal', name: 'Formel', colors: ['#1e3a8a', '#18181b', '#4b5563'] },
  { id: 'sportif', name: 'Sportif', colors: ['#ef4444', '#000000', '#d1d5db'] },
  { id: 'boheme', name: 'Bohème', colors: ['#a16207', '#78350f', '#d97706'] },
  { id: 'streetwear', name: 'Streetwear', colors: ['#111827', '#9333ea', '#f59e0b'] },
  { id: 'minimaliste', name: 'Minimaliste', colors: ['#525252', '#171717', '#e5e5e5'] }
];

import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// Initialisation du client Supabase
const supabaseUrl = 'https://mtfjllluaevcuickhvns.supabase.co'; // Remplacez par votre URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZmpsbGx1YWV2Y3VpY2todm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDM5OTksImV4cCI6MjA1OTI3OTk5OX0.T38_6TxMqrLDeHtZKx28dF6PYcJpyfc64lMGMMf2EEA'; // Remplacez par votre clé publique
const supabase = createClient(supabaseUrl, supabaseKey);

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [error, setError] = useState('');
  const { setUserData } = useUser();
  const navigate = useNavigate();
  const { language } = useLanguage(); // Récupérer la langue actuelle
  const { theme } = useTheme(); // Récupérer le thème actuel

  // Vérifie si un nom est déjà stocké dans le localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      // Si un nom est trouvé, redirige directement vers la page principale
      navigate('/');
    }
  }, [navigate]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!name.trim()) {
        setError(translations[language].onboardingErrorName); // Utiliser la traduction
        return;
      }
      setError('');
      // Stocke le nom dans le localStorage
      localStorage.setItem('userName', name);
      setStep(2);
    } else if (step === 2) {
      if (!selectedStyle) {
        setError(translations[language].onboardingErrorName); // Utiliser la traduction
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setError(translations[language].onboardingErrorEmail); // Utiliser la traduction
        return;
      }
      setError('');

      // Envoi des données utilisateur à Supabase
      try {
        const { data, error } = await supabase.from('users').insert([
          {
            name,
            email,
            style: selectedStyle.id, // Ajout du style vestimentaire
          },
        ]);
        if (error) {
          console.error('Erreur lors de l\'enregistrement dans Supabase:', error);
          setError('Une erreur est survenue. Veuillez réessayer.');
          return;
        }
        console.log('Utilisateur enregistré dans Supabase:', data);
      } catch (err) {
        console.error('Erreur lors de la requête Supabase:', err);
        setError('Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      // Finalisation de l'onboarding
      setUserData({
        name,
        email,
        style: {
          style: selectedStyle.id,
          colors: selectedStyle.colors,
        },
        lastVisit: null,
        visitCount: 1
      });
      navigate('/');
    }
  };

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style);
  };

  const handleFinishOnboarding = () => {
    // Rediriger vers la page Home après l'onboarding
    navigate('/home');
  };

  useEffect(() => {
    // Logique d'initialisation si nécessaire
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-5 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div
        className={`max-w-md w-full mx-auto rounded-xl shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1
              className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
              }`}
            >
              WeatherWear
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {translations[language].personalAssistant}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i <= step
                        ? theme === 'dark'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-indigo-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`h-1 w-16 mx-2 ${
                        i < step
                          ? theme === 'dark'
                            ? 'bg-indigo-500'
                            : 'bg-indigo-600'
                          : theme === 'dark'
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {translations[language].onboardingStep1}
                </h2>
                <div className="relative">
                  <User
                    className={`absolute left-3 top-3.5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition pl-10 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                    placeholder={translations[language].onboardingNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {translations[language].onboardingStep2}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {styleOptions.map((style) => (
                    <div
                      key={style.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedStyle?.id === style.id
                          ? theme === 'dark'
                            ? 'border-indigo-500 bg-indigo-900'
                            : 'border-indigo-600 bg-indigo-50'
                          : theme === 'dark'
                          ? 'border-gray-600 hover:border-indigo-500'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => handleStyleSelect(style)}
                    >
                      <div
                        className={`flex items-center ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                        }`}
                      >
                        <Palette className="mr-2" size={16} />
                        <span>{style.name}</span>
                      </div>
                      <div className="flex mt-2 space-x-1">
                        {style.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {translations[language].onboardingStep3}
                </h2>
                <div className="relative">
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500'
                        : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                    placeholder={translations[language].onboardingEmailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            )}
          </div>

          <button
            onClick={handleNextStep}
            className={`w-full font-medium py-3 rounded-lg transition flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {step === 3 ? translations[language].onboardingStart : translations[language].onboardingNext}
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
