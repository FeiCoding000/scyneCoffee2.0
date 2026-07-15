import { getDocs, collection, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { useNoti } from "../contexts/NotiContext";
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
  autoClose?: boolean;
  countdownSeconds?: number;
}

export default function OrderConfirmedModal({
  open,
  onClose,
  autoClose = false,
  countdownSeconds = 5,
}: OrderConfirmedModalProps) {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds);
  const { isNotiOpen, notification, toggleNoti } = useNoti();

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

  useEffect(() => {
    if (!open || !autoClose) return;

    setCountdown(countdownSeconds);

    const intervalTimer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    const closeTimer = window.setTimeout(() => {
      onClose();
      if (notification?.isActive && isNotiOpen === false && toggleNoti) {
        toggleNoti();
      }
    }, countdownSeconds * 1000);

    return () => {
      window.clearInterval(intervalTimer);
      window.clearTimeout(closeTimer);
    };
  }, [autoClose, countdownSeconds, isNotiOpen, notification?.isActive, onClose, open, toggleNoti]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      if (notification?.isActive && isNotiOpen === false && toggleNoti) {
        toggleNoti();
      }
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
          bgcolor: "rgba(255, 255, 255, 0.96)",
          borderRadius: "24px",
          boxShadow: 24,
          width: "min(420px, calc(100% - 32px))",
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

        {autoClose ? (
          <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / countdownSeconds) * 100}
              size={96}
              thickness={4}
              sx={{ color: "#F2C078" }}
            />
            <Box
              sx={{
                inset: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#2E244D" }}>
                {countdown}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={isClosing || isLoading}
            sx={{
              m: 3,
              borderRadius: "12px",
              backgroundColor: "#F2C078",
              color: "#2E244D",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#FFD49A" },
            }}
          >
            {isClosing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Closing...
              </>
            ) : (
              "Close"
            )}
          </Button>
        )}
      </Box>
    </Modal>
  );
}
