import { NotiContext, type NotiContextType } from "../contexts/NotiContext";
import { useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { Notification } from "../types/notification";
import { useEffect } from "react";

export const NotiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [activeNotification, setActiveNotification] =
    useState<NotiContextType["notification"]>(null);
  const value: NotiContextType = {
    notification: activeNotification,
    isNotiOpen,
    toggleNoti: () => setIsNotiOpen(!isNotiOpen),
  };

  useEffect(() => {
    const notiRef = collection(db, "notifications");
    const q = query(notiRef, where("isActive", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeNoti = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Notification),
      }));

      console.log("Active notifications: ", activeNoti);
      setActiveNotification(activeNoti[0] || null);
      setIsNotiOpen(activeNoti.length > 0);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <NotiContext.Provider value={value}>{children}</NotiContext.Provider>;
};
