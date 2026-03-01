import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@mui/material";

export default function CreateNotification() {
  const handleCreate = async () => {
    try {
      const notificationsCol = collection(db, "notifications");

      const snapshot = await getDocs(notificationsCol);
      snapshot.docs.forEach(async (d) => {
        await deleteDoc(doc(db, "notifications", d.id));
      });

      const docRef = await addDoc(notificationsCol, {
        type: "info",
        isActive: true,
        title: "Barista Away",
        description: "You can still place an order.",
        message: "Be back in",
        timer: 300,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <Button variant= "contained" onClick={handleCreate}>Barista Away</Button>
    </div>
  );
}