// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js');

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBS4VWUpDV714E_rco8v1WfXkvDAfB11v0",
  authDomain: "weather-34597.firebaseapp.com",
  projectId: "weather-34597",
  storageBucket: "weather-34597.firebasestorage.com",
  messagingSenderId: "239592343951",
  appId: "1:239592343951:web:6b615fd7eae8f8a0cfa3fa",
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Messaging
const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan :', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/web-app-manifest-192x192.png', // Utilisation de l'icône correcte
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
