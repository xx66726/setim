// Vérifie si le navigateur supporte les notifications
const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Initialise les notifications et demande la permission
export const initializeNotifications = () => {
  if (!isNotificationSupported()) {
    console.log('Ce navigateur ne supporte pas les notifications.');
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          console.log('Permission de notification accordée.');
          registerServiceWorker();
          scheduleNotification(); // Planifie immédiatement une notification
        } else {
          console.warn('Permission de notification refusée.');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la demande de permission de notification :', error);
      });
  } else if (Notification.permission === 'granted') {
    registerServiceWorker();
    scheduleNotification();
  }
};

// Enregistre le service worker pour les notifications
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service worker enregistré pour les notifications.');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du service worker :', error);
      });
  }
};

// Planifie une notification quotidienne à 8h00
export const scheduleNotification = () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const targetHour = 8;
  const targetMinute = 0;

  // Définit l'heure cible pour aujourd'hui à 8h00
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour,
    targetMinute,
    0
  );

  // Si l'heure actuelle est déjà passée, planifie pour demain
  if (now.getTime() >= scheduledTime.getTime()) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendDailyNotification();
    scheduleNotification(); // Replanifie pour le lendemain
  }, delay);

  console.log(`Notification planifiée pour ${scheduledTime.toLocaleString()}`);
};

// Envoie une notification quotidienne
const sendDailyNotification = () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const userData = localStorage.getItem('timeClothesUserData');
  const userName = userData ? JSON.parse(userData).name || '' : '';
  const location = localStorage.getItem('weatherWearLocation') || '';
  const language = localStorage.getItem('timeClothesLanguage') || 'fr';

  const message = getRandomMessage(language, userName, location);

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification('WeatherWear', {
          body: message,
          icon: '/web-app-manifest-192x192.png',
          badge: '/favicon-32x32.png',
          vibrate: [100, 50, 100],
          tag: 'weather-wear-daily',
          actions: [
            {
              action: 'open-app',
              title: language === 'fr' ? 'Ouvrir' : 'Open',
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de la notification via le service worker :', error);
        sendFallbackNotification(message);
      });
  } else {
    sendFallbackNotification(message);
  }
};

// Envoie une notification de secours sans service worker
const sendFallbackNotification = (message: string) => {
  try {
    const notification = new Notification('WeatherWear', {
      body: message,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de secours :', error);
  }
};

// Nettoie les ressources liées aux notifications
export const cleanupNotifications = () => {
  const timerId = localStorage.getItem('notificationTimerId');
  if (timerId) {
    clearTimeout(parseInt(timerId, 10));
  }
};

// Génère un message aléatoire pour la notification
export const getRandomMessage = (language: string, userName: string, location: string): string => {
  const messages = {
    fr: [
      `Bonjour ${userName}! Consultez la météo du jour${location ? ` à ${location}` : ''}.`,
      `Commencez votre journée avec une tenue adaptée à la météo!`,
      `Découvrez quelle tenue porter aujourd'hui${location ? ` à ${location}` : ''}.`,
    ],
    en: [
      `Good morning ${userName}! Check today's weather${location ? ` in ${location}` : ''}.`,
      `Start your day with weather-appropriate clothing!`,
      `Discover what to wear today${location ? ` in ${location}` : ''}.`,
    ],
  };

  const messageArray = language === 'en' ? messages.en : messages.fr;
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  return messageArray[randomIndex];
};
