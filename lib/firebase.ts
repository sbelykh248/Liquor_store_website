import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

/**
 * Firebase wiring for live inventory (price + stock), mirroring the REST
 * approach the iOS app uses against the same Firestore project — see
 * `ios-juniors-liquor/FIREBASE_SETUP.md` for the console setup steps and
 * the `products/{productId}` document shape both clients share.
 *
 * Nothing here is required to run the site: every value falls back to
 * `undefined`, `isFirebaseConfigured` becomes `false`, and the inventory
 * provider serves the bundled catalog instead. Fill in the
 * `NEXT_PUBLIC_FIREBASE_*` variables (see `.env.example`) whenever you're
 * ready to go live.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let auth: Auth | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { app, firestore, auth };
