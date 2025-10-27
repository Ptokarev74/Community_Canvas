import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase/config';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start as loading

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
        
    }, []);

    const contextValue: AuthContextType = {
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        // This runs if a component tries to call useAuth() 
        // without being wrapped by the <AuthProvider> in the component tree.
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}