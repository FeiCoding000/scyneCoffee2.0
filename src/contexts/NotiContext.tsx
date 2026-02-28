import { createContext, useContext } from "react";
import type { Notification } from "../types/notification";

export interface NotiContextType {
    notification?: Notification | null;
    isNotiOpen?: boolean;
    toggleNoti?: () => void;
}

export const NotiContext = createContext<NotiContextType | undefined>(undefined);

export const useNoti = () => {
    const context = useContext(NotiContext);
    if (!context) {
        throw new Error("useNoti must be used within a NotiProvider");
    }
    return context;
}