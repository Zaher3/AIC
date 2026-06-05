// Firebase CDN-based initialization
// Firebase is loaded via CDN in index.html

const firebaseConfig = {
  apiKey: "AIzaSyAyH17Le2akDyWG1iiZMqI2YE_YVaHETH4",
  authDomain: "sc-aic.firebaseapp.com",
  projectId: "sc-aic",
  storageBucket: "sc-aic.firebasestorage.app",
  messagingSenderId: "898259119292",
  appId: "1:898259119292:web:76342e85ac916be25b74b9",
  measurementId: "G-44YPK5G2JY"
};

// Declare global types for Firebase CDN
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    firebase: any;
  }
}

let db: any = null;
let initialized = false;

export function initFirebase(): boolean {
  if (initialized) return true;

  if (typeof window === 'undefined' || !window.firebase) {
    console.warn('Firebase SDK not loaded from CDN');
    return false;
  }

  try {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }

    db = window.firebase.firestore();
    initialized = true;
    console.log('Firebase initialized successfully');
    return true;
  } catch (e) {
    console.error('Firebase initialization error:', e);
    return false;
  }
}

export function getDb(): any {
  if (!db) initFirebase();
  return db;
}

export function isFirebaseReady(): boolean {
  return initialized && db !== null;
}

export function generateId(): string {
  if (window.firebase && window.firebase.firestore) {
    return window.firebase.firestore().collection('_').doc().id;
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
