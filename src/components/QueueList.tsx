import { db } from '../services/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import QueueElement from './QueueElement';
import type { Order } from "../types/order";



export default function QueueList() {
    const [recentTenOrders, setRecentTenOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

        let unsubscribe: () => void | undefined;

        const subscribeToOrders = () => {
        if (unsubscribe) unsubscribe();

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const orderRef = collection(db, 'orders');
        const q = query(orderRef, where('createdAt', '>=', tenMinutesAgo), orderBy('createdAt', 'desc'), limit(10));

        unsubscribe = onSnapshot(q, (snapshot) => {
            const orders : Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Order })).reverse();
            setRecentTenOrders(orders);
            setLoading(false);
        });
    };
        subscribeToOrders();

        const timer = setInterval(subscribeToOrders, 6*60 * 1000); // Refresh every minute
        return () => {
            if(unsubscribe) unsubscribe();
            clearInterval(timer);
        };
    },[])

    return (
        <div className="queue">
            <p style={{borderBottom: "1px solid black", paddingBottom: "5px", textAlign: "center", fontWeight: "bold"}}>Recent Orders</p>
            <div style={ {display: 'flex', justifyContent: 'space-between'}}>
                <p style={{ borderBottom: "3px solid grey", width: "30%"}}>Name</p>
                <p style={{ borderBottom: "3px solid grey", width:"30"}}>Status</p>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                recentTenOrders.length === 0 ? (
                    <p style={{ textAlign: "left", marginTop: "20px", color: "grey" }}>😺 No one ahead of you — you're first in line!
</p>
                ) : (       
                recentTenOrders.map((order) => (
                    <div key={order.id}>
                        <QueueElement order={order} />
                    </div>
                ))
            )
            )}
        </div>
    );
}
