import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import type { User } from "firebase/auth";

export async function googleLogin() : Promise<User | null> {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Google login error:", error);
        return null;
    }
}

export async function loginWithEmail (email : string, password: string) : Promise <User | null> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        console.error("Email login error:", error);
        return null;
    }
}


export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }
}
