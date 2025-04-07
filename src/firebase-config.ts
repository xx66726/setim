// firebase-config.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBS4VWUpDV714E_rco8v1WfXkvDAfB11v0",
  authDomain: "weather-34597.firebaseapp.com",
  projectId: "weather-34597",
  storageBucket: "weather-34597.firebasestorage.app",
  messagingSenderId: "239592343951",
  appId: "1:239592343951:web:6b615fd7eae8f8a0cfa3fa",
};

const app = initializeApp(firebaseConfig);

export default app;
