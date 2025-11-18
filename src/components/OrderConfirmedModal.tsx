import { getDocs, collection, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

interface OrderConfirmedModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderConfirmedModal({
  open,
  onClose,
}: OrderConfirmedModalProps) {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchPendingOrders = async () => {
      setIsLoading(true);
      try {
        const orderRef = collection(db, "orders");
        const q = query(orderRef, where("isCompleted", "==", false));
        const snapshot = await getDocs(q);
        setPendingOrders(snapshot.size);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        setPendingOrders(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOrders();
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          minWidth: 500,
          maxWidth: 400,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ border: "grey solid 1px", padding: "5px" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", m: 2 }}
          >
            Order Confirmed
          </Typography>
        </div>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <Typography variant="h6" sx={{ m: 3 }}>
              There {pendingOrders > 2 ? "are" : "is"}{" "}
              {pendingOrders - 1 === 0 ? "no" : `${pendingOrders - 1}`}{" "}
              {pendingOrders > 2 ? "orders" : "order"} in the queue.
            </Typography>
              <Typography variant="h6" sx={{ m: 3 }}>
              🕑Estimate wait time: {(pendingOrders) * 2} minutes.
            </Typography>
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          disabled={isClosing || isLoading}
          sx={{ m: 3 }}
        >
          {isClosing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Closing...
            </>
          ) : (
            "Close"
          )}
        </Button>
      </Box>
    </Modal>
  );
}
