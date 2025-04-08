import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import Home from './components/Home';
import WeatherRecommendation from './components/WeatherRecommendation';
import Onboarding from './components/Onboarding';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';
import FeedbackModal from './components/FeedbackModal';
import ShareButton from './components/ShareButton';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { requestNotificationPermission, listenForMessages, registerFirebaseServiceWorker } from './firebase-messaging';
import MilestonePopup from './components/MilestonePopup';

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    // Charger les polices Google
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Mettre à jour le titre de la page
    document.title = 'WeatherWear - Assistant vestimentaire';

    // Initialiser les notifications Firebase
    requestNotificationPermission();
    listenForMessages();

    // Enregistrer le service worker Firebase
    registerFirebaseServiceWorker();

    // Vérifier si le feedback modal doit être affiché
    const userData = localStorage.getItem('timeClothesUserData');
    if (userData) {
      try {
        const { visitCount } = JSON.parse(userData);
        if (visitCount === 3) {
          // Afficher le feedback modal après la 3e visite
          setTimeout(() => setIsFeedbackOpen(true), 60000); // Afficher après 1 minute
        }
      } catch (error) {
        console.error('Erreur lors de l\'analyse des données utilisateur pour le feedback :', error);
      }
    }
  }, []);

  const openFeedbackModal = () => setIsFeedbackOpen(true);
  const closeFeedbackModal = () => setIsFeedbackOpen(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 font-['Poppins'] text-gray-800 dark:text-gray-100 transition-colors duration-200">
              <div className="fixed top-4 right-4 flex items-center space-x-2 z-10">
                <button 
                  onClick={openFeedbackModal} 
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Give Feedback"
                  aria-label="Open feedback form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <ThemeToggle />
                <LanguageSelector />
              </div>
              <div className="flex-grow">
                <MilestonePopup /> {/* Afficher les pop-ups globalement */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/recommendation" element={<WeatherRecommendation />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
              <FeedbackModal isOpen={isFeedbackOpen} onClose={closeFeedbackModal} />
              <ShareButton />
              <PWAInstallPrompt />
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
