import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@mui/material";
export default function ClearNoti() {

const clearNotifications = async () => {
    const notificationsCol = collection(db, "notifications");
    const snapshot = await getDocs(notificationsCol);
      snapshot.docs.forEach(async (d) => {
        await deleteDoc(doc(db, "notifications", d.id));
      });
}

  return (
    <Button variant="contained" onClick={clearNotifications}>Barista Back</Button>
  )
}
