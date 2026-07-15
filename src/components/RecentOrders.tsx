import { Avatar, Box, Chip, CircularProgress, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import type { Order } from "../types/order";

type RecentOrdersProps = {
  variant?: "plain" | "glass";
};

const hourglassFlip = keyframes`
  0%, 42% {
    transform: rotate(0deg);
  }
  50%, 92% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AnimatedHourglassIcon = () => (
  <Box
    component="span"
    sx={{
      position: "relative",
      width: 20,
      height: 20,
      ml: 0.4,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      animation: `${hourglassFlip} 2.4s ease-in-out infinite`,
      transformOrigin: "center",
    }}
  >
    <HourglassEmptyIcon sx={{ fontSize: 20 }} />
    <Box
      component="span"
      sx={{
        position: "absolute",
        top: 4,
        width: 8,
        height: 5,
        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        backgroundColor: "currentColor",
        opacity: 0.45,
      }}
    />
    <Box
      component="span"
      sx={{
        position: "absolute",
        bottom: 4,
        width: 8,
        height: 5,
        clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
        backgroundColor: "currentColor",
        opacity: 0.25,
      }}
    />

  </Box>
);

export default function RecentOrders({ variant = "plain" }: RecentOrdersProps) {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribeToOrders = () => {
      unsubscribe?.();

      const orderRef = collection(db, "orders");
      const activeOrdersQuery = query(
        orderRef,
        where("isCompleted", "==", false),
      );

      unsubscribe = onSnapshot(activeOrdersQuery, (snapshot) => {
        const orders: Order[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as Order) }))
          .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

        setRecentOrders(orders);
        setLoading(false);
      });
    };

    subscribeToOrders();

    return () => {
      unsubscribe?.();
    };
  }, []);

  const isGlass = variant === "glass";

  return (
    <Box
      sx={{
        width: "100%",
        color: isGlass ? "white" : "inherit",
        borderRadius: isGlass ? "18px" : 0,
        backgroundColor: isGlass ? "rgba(255, 255, 255, 0.07)" : "transparent",
        border: isGlass ? "1px solid rgba(255, 255, 255, 0.14)" : "none",
        p: isGlass ? 2 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18 }}>Recent Orders</Typography>
          <Typography
            variant="caption"
            sx={{
              color: isGlass ? "rgba(255,255,255,0.62)" : "text.secondary",
            }}
          >
            Live active queue
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${recentOrders.length} waiting`}
          sx={{
            color: isGlass ? "white" : "#2E244D",
            backgroundColor: isGlass
              ? "rgba(242, 192, 120, 0.18)"
              : "rgba(242, 192, 120, 0.28)",
            border: "1px solid rgba(242, 192, 120, 0.5)",
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress
            size={22}
            sx={{ color: isGlass ? "#F2C078" : undefined }}
          />
        </Box>
      ) : recentOrders.length === 0 ? (
        <Typography
          sx={{
            textAlign: "left",
            mt: 2,
            color: isGlass ? "rgba(255,255,255,0.68)" : "grey",
          }}
        >
          No active orders
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {recentOrders.map((order, index) => {
            const firstItem = order.items?.[0];

            return (
              <Box
                key={order.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: "14px",
                  backgroundColor: isGlass
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(70, 78, 126, 0.06)",
                  border: `1px solid ${
                    isGlass
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(70, 78, 126, 0.1)"
                  }`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: order.isCompleted ? "#2e7d32" : "#F2C078",
                      color: order.isCompleted ? "white" : "#2E244D",
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ lineHeight: 1.2 }} noWrap>
                      {order.customerName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isGlass
                          ? "rgba(255,255,255,0.62)"
                          : "text.secondary",
                      }}
                      noWrap
                    >
                      {firstItem
                        ? `${firstItem.title} × ${firstItem.quantity}`
                        : "Order item"}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  size="small"
                  icon={
                    order.isCompleted ? (
                      <CheckCircleIcon />
                    ) : (
                      <AnimatedHourglassIcon />
                    )
                  }
                  label="Making"
                  sx={{
                    flexShrink: 0,
                    color: "#6A4200",
                    backgroundColor: "#FFF1C7",
                    border: "1px solid #F4C95D",
                    "& .MuiChip-icon": {
                      color: "#A66A00",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
