import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { User } from "firebase/auth";
import { googleLogin, logout, loginWithEmail } from "../services/authService";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const login = async () => {
        setLoading(true);
        try {
            const loggedInUser = await googleLogin();
            setUser(loggedInUser);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const emailLogin = async (email: string, password: string) => {
        setLoading(true);
        try {
            const loggedInUser = await loginWithEmail(email, password);
            setUser(loggedInUser);
        } catch (error) {
            console.error("Email login error:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        emailLogin,
        logout: handleLogout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
