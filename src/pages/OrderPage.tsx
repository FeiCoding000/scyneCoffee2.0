import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { Order } from "../types/order"; 
import OrderCard from "../components/OrderCard";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. get reference and query
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("isCompleted", "==", false));

    // 2. real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));

      setOrders(fetchedOrders);
      setLoading(false);
      console.log("Realtime orders updated:", fetchedOrders);
    });

    // 3. cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      {orders.length === 0 ? (
        <p>No active orders.</p>
      ) : (
        <div style={ {display: "flex", flexDirection: "column", maxWidth: "600px", margin:"0 auto"} }>
          {orders.map((order) => (
            <div key={order.id} >
            <OrderCard order = {order} >
            </OrderCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
