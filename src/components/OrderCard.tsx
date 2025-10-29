import { useState } from "react";
import type { Order } from "../types/order";
import { db } from "../services/firebase";
import { updateDoc, doc } from "firebase/firestore";
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
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Customer: {customerName}
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold">
          Ordered Drink(s)
        </Typography>

        <Stack spacing={1} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Paper
              key={`${item.title}-${index}`}
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2">
                Item {index + 1}: {item.title}
              </Typography>

              <Box sx={{ pl: 1 }}>
                {item.strength ? (
                  <Typography variant="body2">
                    Strength: {item.strength}
                  </Typography>
                ) : item.teaBags ? (
                  <Typography variant="body2">
                    Tea Bags: {item.teaBags}
                  </Typography>
                ) : null}

                <Typography variant="body2">
                  Milk: {item.milk || "none"}
                </Typography>

                {item.sugar > 0 && (
                  <Typography variant="body2">Sugar: {item.sugar}</Typography>
                )}
                {item.sweetner > 0 && (
                  <Typography variant="body2">
                    Sweetener: {item.sweetner}
                  </Typography>
                )}

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

                <Typography fontWeight="bold" variant="body2">
                  Quantity: {item.quantity}
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
