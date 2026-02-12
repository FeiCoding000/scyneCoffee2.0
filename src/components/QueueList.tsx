import { db } from '../services/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import QueueElement from './QueueElement';
import type { Order } from "../types/order";

export default function QueueList() {
    const [recentTenOrders, setRecentTenOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const orderRef = collection(db, 'orders');
        const q = query(orderRef, where('createdAt', '>=', thirtyMinutesAgo), orderBy('createdAt', 'asc'), limit(10));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const orders : Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Order }));
            setRecentTenOrders(orders);
            setLoading(false);
        });

        return () => unsubscribe();
    },[]);

    return (
        <div className="queue">
            <p style={{borderBottom: "1px solid black", paddingBottom: "5px", textAlign: "center", fontWeight: "bold"}}>Recent Orders</p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                recentTenOrders.map((order, index) => (
                    <div key={order.id}>
                        <QueueElement index={index} order={order} />
                    </div>
                ))
            )}
        </div>
    );
}