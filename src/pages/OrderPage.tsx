import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { Order } from "../types/order";
import OrderCard from "../components/OrderCard";
import { Box, Chip, Paper, Typography } from "@mui/material";

const sortOldestFirst = (orders: Order[]) =>
  [...orders].sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

const formatOrderTime = (order: Order) =>
  order.createdAt.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("isCompleted", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));

      setOrders(sortOldestFirst(fetchedOrders));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));

      setRecentOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <Box sx={{ minHeight: "100vh", px: { xs: 2, sm: 3 }, py: 4, pb: 22 }}>
      {orders.length === 0 ? (
        <Typography sx={{ color: "white", textAlign: "center" }}>
          No active orders.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 3,
            maxWidth: "1120px",
            mx: "auto",
            alignItems: "start",
          }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
      )}

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 24 },
          bottom: { xs: 12, sm: 24 },
          width: { xs: "calc(100% - 24px)", sm: 340 },
          overflow: "hidden",
          borderRadius: "18px",
          background: "rgba(255, 248, 220, 0.96)",
          border: "1px solid rgba(46, 36, 77, 0.16)",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: "2px dashed rgba(46, 36, 77, 0.28)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#2E244D" }}>
            Recent 10 Orders
          </Typography>

        </Box>

        <Box
          sx={{
            overflowY: "auto",
            p: 0.5,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {recentOrders.length === 0 ? (
            <Typography variant="body2" sx={{ color: "rgba(46, 36, 77, 0.72)", p: 1 }}>
              No recent orders.
            </Typography>
          ) : (
            recentOrders.map((order, index) => (
              <Box
                key={order.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 0.75,
                  py: 0.25,
                  borderBottom:
                    index === recentOrders.length - 1
                      ? "none"
                      : "1px solid rgba(46, 36, 77, 0.12)",
                  borderRadius: "6px",
                  "&:hover": { backgroundColor: "rgba(242, 192, 120, 0.22)" },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#2E244D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {order.customerName}
                  </Typography>
                  <Typography sx={{ color: "rgba(46, 36, 77, 0.62)", fontSize: "0.68rem" }}>
                    {formatOrderTime(order)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={order.isCompleted ? "Done" : "Active"}
                  color={order.isCompleted ? "success" : "warning"}
                  sx={{ flexShrink: 0, fontSize: "0.65rem", height: 20 }}
                />
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
}
