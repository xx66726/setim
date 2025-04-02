// Service Worker for WeatherWear PWA
const CACHE_NAME = 'weatherwear-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-152x152.png',
  '/apple-touch-icon-167x167.png',
  '/apple-touch-icon-180x180.png'
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
      .then(() => {
        console.log('Service Worker: App shell cached successfully');
        return self.skipWaiting(); // Force new service worker to become active immediately
      })
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
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim(); // Take control of all open clients
    })
  );
});

// Serve cached content when offline with network-first strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Network-first strategy for HTML pages (routes)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version of the page
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, fallback to index.html for SPA routing
            return caches.match('/index.html');
          });
        })
    );
    return;
  }
  
  // Cache-first strategy for assets
  if (event.request.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Return cached version and update cache in background
            const fetchPromise = fetch(event.request).then(networkResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
              return networkResponse;
            }).catch(() => {
              // Silently fail if background update fails
            });
            return cachedResponse;
          }
          
          // Not in cache, get from network
          return fetch(event.request)
            .then(response => {
              // Cache the new asset
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
              return response;
            });
        })
    );
    return;
  }
  
  // Network-first strategy for all other requests
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Don't cache API responses
        if (!event.request.url.includes('/api/')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push event received');
  
  let notificationData = {
    title: 'WeatherWear',
    options: {
      body: 'Nouvelle mise à jour disponible',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: { url: '/' }
    }
  };
  
  // Try to parse the data from the push event
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      // If JSON parsing fails, use the text as the notification body
      notificationData.options.body = event.data.text();
    }
  }

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event.notification.tag);
  event.notification.close();
  
  // Handle notification action buttons
  if (event.action === 'open-app') {
    event.waitUntil(
      clients.openWindow('/')
    );
    return;
  }
  
  if (event.action === 'view-weather') {
    event.waitUntil(
      clients.openWindow('/recommendation')
    );
    return;
  }
  
  // Default action (clicking the notification itself)
  let url = '/';
  
  // Try to get the stored URL from the notification data
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }
  
  // See if we already have a window open, focus it instead of opening a new one
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus it
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
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
