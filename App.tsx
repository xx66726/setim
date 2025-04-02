import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import Home from './components/Home';
import WeatherRecommendation from './components/WeatherRecommendation';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';
import FeedbackModal from './components/FeedbackModal';
import { initializeNotifications, scheduleNotification, cleanupNotifications } from './utils/notificationService';

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Update page title
    document.title = 'WeatherWear - Assistant vestimentaire';

    // Initialize notifications with permission request
    initializeNotifications();

    // Check if we need to show the feedback modal (e.g. after 3 visits)
    const userData = localStorage.getItem('timeClothesUserData');
    if (userData) {
      try {
        const { visitCount } = JSON.parse(userData);
        if (visitCount === 3) {
          // Show feedback modal after the 3rd visit
          setTimeout(() => setIsFeedbackOpen(true), 60000); // Show after 1 minute
        }
      } catch (error) {
        console.error('Error parsing user data for feedback check:', error);
      }
    }

    // Cleanup function for when component unmounts
    return () => {
      cleanupNotifications();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle visibility changes to check PWA status
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // When tab becomes visible, check if notifications need to be scheduled
      const nextNotificationTime = localStorage.getItem('nextNotificationTime');
      if (!nextNotificationTime) {
        scheduleNotification();
      }
    }
  };

  // Set up visibility listener after initial render
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/recommendation" element={<WeatherRecommendation />} />
                  <Route path="/chat" element={<ChatInterface />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
              <FeedbackModal isOpen={isFeedbackOpen} onClose={closeFeedbackModal} />
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
