import { createContext, useContext } from "react";
import type { User} from "firebase/auth";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    emailLogin: (email: string, password: string) => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined> (undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}






