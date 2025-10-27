import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 2. Define the configuration object using environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    // CRITICAL for RTDB: You MUST specify the database URL
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, 
    // You must add this to your .env.local file! 
    // Example: "https://rplace-clone-app-default-rtdb.firebaseio.com"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize and EXPORT the Realtime Database service
export const db = getDatabase(app); 

// You can also export the app instance, though db is your primary focus now
export { app };
