import { useState } from "react";
import type { Order } from "../types/order";
import { db } from "../services/firebase";
import { updateDoc, doc, writeBatch, increment } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";

export default function OrderCard({ order }: { order: Order }) {
  const { customerName, id, items, isCompleted } = order;
  const [updating, setUpdating] = useState(false);
  const [done, setDone] = useState(isCompleted);

  const updateOrderInfo = async (orderId: string) => {
    if (!orderId) return;

    setUpdating(true);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { isCompleted: true });
      setDone(true);

      //batch update popularity
      const batch = writeBatch(db);
      order.items.forEach((item) => {
      if (!item.coffeeId) return;
      const coffeeRef = doc(db, "coffee", item.coffeeId);
      batch.update(coffeeRef, { popularity: increment(item.quantity) });
    });
    await batch.commit();

    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: "10px 10px 18px 18px",
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.22)",
        p: 2,
        background: "linear-gradient(180deg, #FFF7C8 0%, #FFEFA3 100%)",
        color: "#2E244D",
        border: "1px solid rgba(46, 36, 77, 0.12)",
        transform: "rotate(-0.4deg)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "14%",
          width: "72%",
          height: "14px",
          borderRadius: "0 0 10px 10px",
          background: "rgba(255, 255, 255, 0.62)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.14)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {customerName}
        </Typography>

        <Box
          sx={{
            borderBottom: "2px dashed rgba(46, 36, 77, 0.35)",
            mb: 2,
          }}
        />

        <Typography variant="subtitle1">
          Ordered Drink(s)
        </Typography>

        <Stack spacing={1} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Paper
              key={`${item.title}-${index}`}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.62)",
              }}
            >
              <Typography variant="subtitle2">
                Item {index + 1}: {item.title}
              </Typography>

              <Box sx={{ pl: 1 }}>
                {item.strength ? (
                  <Typography variant="body2">
                    ☕Strength: {item.strength}
                  </Typography>
                ) : item.teaBags ? (
                  <Typography variant="body2">
                    Tea Bags: {item.teaBags}
                  </Typography>
                ) : null}

                <Typography variant="body2">
                  🥛Milk: {item.milk || "none"}
                </Typography>



                {item.sugar > 0 && (
                  <Typography variant="body2">🍭Sugar: {item.sugar} {"🍭".repeat(item.sugar)}</Typography>
                )}
                {item.sweetner > 0 && (
                  <Typography variant="body2">
                    🍬Sweetener: {item.sweetner} {"🍬".repeat(item.sweetner)}
                  </Typography>
                )}

                {item.isDecaf && <Typography color="primary" variant="body2">
                    🛑Decaf
                  </Typography>}
                {item.isIced && (
                  <Typography color="primary" variant="body2">
                    🧊 Iced
                  </Typography>
                )}
                {item.isXHot && (
                  <Typography color="error" variant="body2">
                    🔥 Extra Hot
                  </Typography>
                )}

                <Typography variant="body2">
                  📈Quantity: {item.quantity}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>

        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1, color: "text.secondary" }}
        >
          Order ID: {id}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color={done ? "success" : "primary"}
            onClick={() => updateOrderInfo(id || "")}
            disabled={updating || done}
            startIcon={updating && <CircularProgress size={16} />}
          >
            {done ? "Completed" : "Mark as Done"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
