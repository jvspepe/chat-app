import { type FirebaseOptions, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { env } from '@/lib/utils';

const config: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  appId: env.VITE_FIREBASE_APP_ID,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(config);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

if (env.MODE === 'development') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(database, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { auth, database, storage };
