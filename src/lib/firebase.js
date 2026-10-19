import { getApps, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(config).every(Boolean);

let db = null;
if (isConfigured) {
  const app = getApps()[0] || initializeApp(config);
  db = getFirestore(app);
}

export const hasFirebaseConfig = isConfigured;

export const subscribeToOverrides = (onChange, onError) => {
  if (!db) return () => {};

  return onSnapshot(
    collection(db, "contentOverrides"),
    (snapshot) => {
      const next = {};
      snapshot.forEach((item) => {
        next[item.id] = item.data();
      });
      onChange(next);
    },
    onError,
  );
};

export const saveOverride = async (id, data) => {
  if (!db) return;
  const reference = doc(db, "contentOverrides", id);
  if (data) {
    await setDoc(reference, data);
  } else {
    await deleteDoc(reference);
  }
};
