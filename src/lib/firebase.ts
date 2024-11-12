import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  User,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { useAuthStore } from '../store/auth-store';

const firebaseConfig = {
  apiKey: "AIzaSyApn6e4AxDyTRdKuWM_3FqjB6vDqZF3uGQ",
  authDomain: "botilleria-88142.firebaseapp.com",
  projectId: "botilleria-88142",
  storageBucket: "botilleria-88142.appspot.com",
  messagingSenderId: "214663424819",
  appId: "1:214663424819:web:41b5d6d9085e9788336c46",
  measurementId: "G-CTWZ0N66VE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configure auth persistence properly
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

// Configure Google Auth Provider with custom parameters
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const createOrder = async (orderData: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  userEmail: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      date: Timestamp.now(),
      status: 'completado'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
};

// Set up auth state listener
auth.onAuthStateChanged((user: User | null) => {
  if (user && user.email) {
    useAuthStore.getState().setUser({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  } else {
    useAuthStore.getState().logout();
  }
  useAuthStore.getState().setAuthInitialized();
});

// Check for redirect result on load
getRedirectResult(auth).then((result) => {
  if (result?.user) {
    const { user } = result;
    useAuthStore.getState().setUser({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  }
}).catch((error) => {
  console.error('Error getting redirect result:', error);
});

export { auth, app, analytics, db };