import { WeatherData } from '../types';

// Check if browser supports notifications
const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Request permission for notifications
export const initializeNotifications = () => {
  if (!isNotificationSupported()) {
    console.log('This browser does not support notifications');
    return;
  }

  // Check if we already have permission
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    // Request permission from the user
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
          registerServiceWorker();
          scheduleNotification(); // Schedule notification immediately after permission is granted
        }
      })
      .catch(error => {
        console.error('Error requesting notification permission:', error);
      });
  } else if (Notification.permission === 'granted') {
    registerServiceWorker();
    
    // Check if notification was already scheduled
    const lastScheduled = localStorage.getItem('lastNotificationScheduled');
    if (!lastScheduled || isSchedulingNeeded()) {
      scheduleNotification();
    }
  }
};

// Register the service worker for push notifications
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        console.log('Service worker ready for notifications');
      })
      .catch(error => {
        console.error('Error with service worker registration:', error);
      });
  }
};

// Check if notification scheduling is needed
const isSchedulingNeeded = () => {
  const lastScheduled = localStorage.getItem('lastNotificationScheduled');
  if (!lastScheduled) return true;
  
  const lastScheduledDate = new Date(lastScheduled);
  const now = new Date();
  
  // If last scheduled was more than 24 hours ago, schedule again
  return (now.getTime() - lastScheduledDate.getTime()) > 24 * 60 * 60 * 1000;
};

// Schedule a notification for 8:00 AM daily
export const scheduleNotification = () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  // Mark that we've scheduled a notification
  localStorage.setItem('lastNotificationScheduled', new Date().toString());

  // Get the current time
  const now = new Date();
  
  // Set target time to 8:00 AM
  const targetHour = 8;
  const targetMinute = 0;
  
  // Create a Date object for today at 8:00 AM
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour,
    targetMinute,
    0
  );
  
  // If it's already past 8:00 AM, schedule for tomorrow
  if (now.getHours() >= targetHour && now.getMinutes() >= targetMinute) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  // Calculate delay in milliseconds
  const delay = scheduledTime.getTime() - now.getTime();
  
  // Ensure the delay is positive (future time)
  if (delay <= 0) {
    console.error('Invalid notification delay calculated:', delay);
    // Fallback: schedule for tomorrow at 8:00 AM
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  // Use setTimeout to schedule the notification
  const timerId = setTimeout(() => {
    sendDailyNotification();
    // Re-schedule for the next day
    scheduleNotification();
  }, delay);
  
  // Store the timer ID in localStorage for potential future use
  localStorage.setItem('notificationTimerId', timerId.toString());

  // Store the next notification time in localStorage
  localStorage.setItem('nextNotificationTime', scheduledTime.toString());
  
  console.log(`Notification scheduled for ${scheduledTime.toLocaleString()}`);
  
  // Set up a listener for visibility changes to ensure scheduling persists
  setupVisibilityListener();
};

// Set up a visibility listener to check scheduling when page becomes visible
const setupVisibilityListener = () => {
  if (typeof document.hidden !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
};

// Handle visibility changes
const handleVisibilityChange = () => {
  if (!document.hidden) {
    // Page is now visible, check if notification scheduling is still valid
    const nextTime = localStorage.getItem('nextNotificationTime');
    if (nextTime) {
      const scheduledTime = new Date(nextTime);
      const now = new Date();
      
      // If scheduled time has passed but notification wasn't sent (browser was closed)
      // or if it's more than 24 hours in the future (clock adjustment), reschedule
      if (scheduledTime < now || (scheduledTime.getTime() - now.getTime()) > 24 * 60 * 60 * 1000) {
        scheduleNotification();
      }
    } else {
      // No scheduled time found, schedule a new notification
      scheduleNotification();
    }
  }
};

// Send the daily notification
const sendDailyNotification = () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  // Get user name if available
  const userData = localStorage.getItem('timeClothesUserData');
  let userName = '';
  
  if (userData) {
    const parsedData = JSON.parse(userData);
    userName = parsedData.name || '';
  }

  // Get saved location if available
  const location = localStorage.getItem('weatherWearLocation') || '';

  // Get the user's language preference
  const language = localStorage.getItem('timeClothesLanguage') || 'fr';
  
  // Generate a personalized message based on user data
  const messages = {
    fr: [
      `Bonjour ${userName}! C'est l'heure de consulter la météo du jour${location ? ` à ${location}` : ''}.`,
      `${userName ? userName + ", c" : "C"}ommencez votre journée du bon pied avec une tenue adaptée à la météo!`,
      `Bonjour! Découvrez quelle tenue porter aujourd'hui${location ? ` à ${location}` : ''}.`,
      `${userName ? userName + ", W" : "W"}eatherWear est prêt à vous aider avec vos choix vestimentaires aujourd'hui!`,
      `Comment s'habiller aujourd'hui${location ? ` à ${location}` : ''}? WeatherWear a la réponse!`,
      `${userName ? userName + ", n" : "N"}e quittez pas la maison sans consulter votre assistant météo personnel!`,
      `Un nouveau jour, une nouvelle météo. Découvrez la tenue idéale avec WeatherWear!`,
      `La météo peut changer, mais votre style reste impeccable avec WeatherWear!`
    ],
    en: [
      `Good morning ${userName}! Time to check today's weather${location ? ` in ${location}` : ''}.`,
      `${userName ? userName + ", s" : "S"}tart your day right with weather-appropriate clothing!`,
      `Hello! Discover what to wear today${location ? ` in ${location}` : ''}.`,
      `${userName ? userName + ", W" : "W"}eatherWear is ready to help with your outfit choices today!`,
      `Wondering what to wear today${location ? ` in ${location}` : ''}? WeatherWear has the answer!`,
      `${userName ? userName + ", d" : "D"}on't leave home without checking your personal weather assistant!`,
      `New day, new weather. Discover the perfect outfit with WeatherWear!`,
      `Weather may change, but your style stays impeccable with WeatherWear!`
    ]
  };
  
  const messageArray = language === 'en' ? messages.en : messages.fr;
  
  // Select a random message
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  const message = messageArray[randomIndex];

  // Try to use the service worker for notification if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('WeatherWear', {
        body: message,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        timestamp: Date.now(),
        vibrate: [100, 50, 100],
        tag: 'weather-wear-daily',
        actions: [
          {
            action: 'open-app',
            title: language === 'fr' ? 'Ouvrir' : 'Open'
          }
        ]
      }).catch(error => {
        // Fallback to standard notification if service worker notification fails
        console.error('Service worker notification failed:', error);
        sendFallbackNotification(message);
      });
    }).catch(error => {
      // Fallback to standard notification if service worker is not ready
      console.error('Service worker not ready:', error);
      sendFallbackNotification(message);
    });
  } else {
    // Use standard Notification API as fallback
    sendFallbackNotification(message);
  }
  
  // Record that notification was sent
  localStorage.setItem('lastNotificationSent', new Date().toString());
};

// Send a fallback notification without service worker
const sendFallbackNotification = (message: string) => {
  try {
    const notification = new Notification('WeatherWear', {
      body: message,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png'
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Failed to send fallback notification:', error);
  }
};

// Function to send a notification with weather information
export const sendWeatherNotification = (weather: WeatherData) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  // Get user language
  const language = localStorage.getItem('timeClothesLanguage') || 'fr';
  
  // Prepare notification message
  const message = language === 'en'
    ? `Current weather in ${weather.location}: ${weather.temperature}°C, ${weather.description}`
    : `Météo actuelle à ${weather.location}: ${weather.temperature}°C, ${weather.description}`;

  // Try to use service worker for notification if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('WeatherWear', {
        body: message,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        vibrate: [100, 50, 100],
        tag: 'weather-wear-update',
        data: { url: '/recommendation' },
        actions: [
          {
            action: 'view-weather',
            title: language === 'fr' ? 'Voir détails' : 'View details'
          }
        ]
      }).catch(error => {
        // Fallback to standard notification
        console.error('Service worker notification failed:', error);
        sendFallbackWeatherNotification(message);
      });
    }).catch(error => {
      console.error('Service worker not ready:', error);
      sendFallbackWeatherNotification(message);
    });
  } else {
    // Use standard Notification API as fallback
    sendFallbackWeatherNotification(message);
  }
};

// Send a fallback weather notification without service worker
const sendFallbackWeatherNotification = (message: string) => {
  try {
    const notification = new Notification('WeatherWear', {
      body: message,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png'
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      window.location.href = '/recommendation';
      notification.close();
    };
  } catch (error) {
    console.error('Failed to send fallback weather notification:', error);
  }
};

// Clean up resources when component unmounts
export const cleanupNotifications = () => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  // Clear any scheduled notifications
  const timerId = localStorage.getItem('notificationTimerId');
  if (timerId) {
    clearTimeout(parseInt(timerId));
  }
};
