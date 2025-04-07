// Service Worker for WeatherWear PWA
const CACHE_NAME = 'weatherwear-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/offline.html', // Page de fallback hors ligne
];

// Install service worker and cache app shell
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached content when offline with network-first strategy
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'WeatherWear';
  const options = {
    body: data.body || 'Nouvelle mise à jour disponible',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

// Handle notification close event
self.addEventListener('notificationclose', event => {
  console.log('Service Worker: Notification closed', event.notification.tag);
  // You could track metrics here if needed
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'feedback-sync') {
    console.log('Service Worker: Attempting to sync feedback data');
    event.waitUntil(syncFeedbackData());
  }
});

// Function to sync feedback data once connection is restored
async function syncFeedbackData() {
  try {
    // Get stored feedback data from IndexedDB or localStorage
    const feedbackData = await getStoredFeedbackData();
    
    if (feedbackData && feedbackData.length > 0) {
      // For each stored feedback item, try to send it
      const sendPromises = feedbackData.map(async (data) => {
        try {
          // This is a placeholder - actual implementation would send to a server
          console.log('Would send feedback:', data);
          // If successful, remove from storage
          await removeFeedbackData(data.id);
          return true;
        } catch (error) {
          console.error('Failed to sync feedback item:', error);
          return false;
        }
      });
      
      await Promise.all(sendPromises);
    }
  } catch (error) {
    console.error('Error in syncFeedbackData:', error);
    throw error; // Rethrow to trigger sync retry
  }
}

// These functions would be implemented with IndexedDB in a real app
async function getStoredFeedbackData() {
  // Placeholder - would actually use IndexedDB
  const storedData = localStorage.getItem('pendingFeedback');
  return storedData ? JSON.parse(storedData) : [];
}

async function removeFeedbackData(id) {
  // Placeholder - would actually use IndexedDB
  const storedData = localStorage.getItem('pendingFeedback');
  if (storedData) {
    const feedbackArray = JSON.parse(storedData);
    const updatedArray = feedbackArray.filter(item => item.id !== id);
    localStorage.setItem('pendingFeedback', JSON.stringify(updatedArray));
  }
}

// Periodic background sync (if supported by browser)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'daily-weather-update') {
    console.log('Service Worker: Performing daily weather update');
    event.waitUntil(checkWeatherUpdate());
  }
});

async function checkWeatherUpdate() {
  try {
    // Get user's saved location
    const location = localStorage.getItem('weatherWearLocation');
    if (!location) return;
    
    // This would be a real API call in production
    console.log('Would check weather for location:', location);
    
    // If we got new weather data, could show a notification
    // self.registration.showNotification(...);
  } catch (error) {
    console.error('Error in checkWeatherUpdate:', error);
  }
}
