import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase-config';

const VAPID_KEY = '2IjkZHUUErlFIbfMUZrWfrlQt5tkBqSc-cd80rC9yRI'; // Votre clé VAPID

const messaging = getMessaging(app);

// Fonction pour demander la permission de notification et obtenir le token
export const requestNotificationPermission = async () => {
  try {
    if (Notification.permission === 'granted') {
      console.log('Permission déjà accordée.');
      return;
    }

    if (Notification.permission === 'denied') {
      console.warn('Permission de notification refusée.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permission de notification accordée.');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        console.log('Token FCM généré :', token);
        // Envoyez ce token à votre backend si nécessaire
      } else {
        console.warn('Aucun token FCM disponible. Demandez la permission.');
      }
    } else {
      console.warn('Permission de notification refusée.');
    }
  } catch (error) {
    console.error('Erreur lors de la demande de permission de notification :', error);
  }
};

// Écoute les messages en premier plan
export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message reçu en premier plan :', payload);
    // Vous pouvez afficher une notification ou mettre à jour l'interface utilisateur ici
  });
};

// Enregistre le service worker pour Firebase Messaging
export const registerFirebaseServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service worker enregistré pour Firebase Messaging.');

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log('Token FCM généré :', token);
      // Vous pouvez envoyer ce token à votre backend si nécessaire
    } else {
      console.warn('Aucun token FCM disponible. Vérifiez les permissions de notification.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du service worker Firebase :', error);
  }
};