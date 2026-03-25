import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    signInWithPopup, 
    signOut, 
    User 
} from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    credits: number;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeCredits: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Initial sync/check for new user
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        createdAt: serverTimestamp(),
                        credits: 100
                    });
                }

                // Set up real-time listener for credits
                unsubscribeCredits = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setCredits(snapshot.data().credits || 0);
                        console.log("Real-time credits update:", snapshot.data().credits);
                    }
                });
            } else {
                setCredits(0);
                if (unsubscribeCredits) unsubscribeCredits();
            }
            
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeCredits) unsubscribeCredits();
        };
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, credits, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
