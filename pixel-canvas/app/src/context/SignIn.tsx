// src/components/SignIn.tsx

'use client';


import React, { useState } from 'react';
// Import the Firebase Auth service initialized in your config file
import { auth } from '../firebase/config'; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

// Create a persistent instance of the Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export function SignIn() {
    // 1. State for User Input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // 2. Auth Handlers (Function Signatures)

    // Handler for creating a new account (Sign Up)
    const handleSignUp = async () => {
        setError(null); // Clear previous errors
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Authentication Context (AuthProvider) automatically detects the login
            // and updates the global user state.
        } catch (e: any) {
            // Handle and display the Firebase error (e.g., 'auth/email-already-in-use')
            setError(e.message); 
        }
    };

    // Handler for logging in an existing user (Sign In)
    const handleSignIn = async () => {
        setError(null); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Authentication Context (AuthProvider) automatically detects the login
        } catch (e: any) {
            // Handle and display the Firebase error (e.g., 'auth/wrong-password')
            setError(e.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            // Use signInWithPopup with the auth service and the googleProvider instance
            await signInWithPopup(auth, googleProvider);
            // AuthContext automatically picks up the logged-in user!

        } catch (error: any) {
            // Handle common errors like pop-up closed, or user denial
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled by user.');
            } else {
                setError(error.message);
            }
        }
    };

    // 3. Component UI (Return statement will go here)
    return (
        <div style={{ 
            maxWidth: 400, 
            margin: '10% auto', 
            padding: 20, 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            borderRadius: '5px', 
            backgroundColor: 'white',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.11)',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <script src="https://kit.fontawesome.com/0921fa2b1e.js" crossOrigin="anonymous"></script>
            <h1 style={{ textAlign: 'center' }}>Sign In</h1>
            <p style={{ textAlign: 'center', marginBottom: 20 }}>Please sign in to view and place pixels.</p>
            
            {/* Display any Firebase error */}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: 10 }}>Error: {error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                    width: '95%', 
                    padding: 10, 
                    margin: '10px 0', 
                }}/>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                    width: '95%', 
                    padding: 10, 
                    margin: '10px 0' 
                }}/>
            <div style = {{
                display: 'flex',
                flexDirection: 'row',
                width: '100%', 
                margin: '10px 0', 
            }}>
                <button 
                    onClick={handleSignIn}
                    style={{
                        padding: 10, 
                        marginRight: 10, 
                        cursor: 'pointer',
                        flexGrow: 1 
                    }}>
                    Sign In
                </button>
                
                <button 
                    onClick={handleSignUp}
                    style={{ 
                        padding: 10, 
                        cursor: 'pointer',
                        flexGrow: 1 
                    }}>
                    Sign Up
                </button>
            </div>
            <button 
                onClick={handleGoogleSignIn}
                style={{ 
                    padding: 10, 
                    marginTop: 10, // Add some space above the button
                    width: '100%', 
                    backgroundColor: '#4285F4', // Google blue
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                Continue with Google 
            </button>
        </div>
    );
}