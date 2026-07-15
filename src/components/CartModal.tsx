import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import type { Order } from "../types/order";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Timestamp } from "firebase/firestore";

export default function CartModal({
  isOpen,
  onClose,
  handleConfirmedModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmedModal: ()=> void;
}) {
  const { cartItems, removeFromCart, clearCart, submitOrder } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [warning, setWarning] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");
  const [rightOffset, setRightOffset] = useState(0);

  const now = Timestamp.now()
  const order: Order = {
    items: cartItems,
    customerName: customerName,
    isCompleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const updateOffset = () => {
    const vw = window.innerWidth;
    if(vw <= 1600) {
      setRightOffset(0);
    } else {
      setRightOffset((vw-1600)/2);
    }
  };

  useEffect(() => {
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const handlePlaceOrder = async () => {
    if (customerName.trim() === "") {
      setSubmitWarning("Please enter your name before placing the order.");
      return;
    } else if (cartItems.length === 0) {
      setSubmitWarning("Your cart is empty.");
      return;
    }
    setSubmitWarning("");
    await submitOrder(order);
    setCustomerName("");
    onClose();
    handleConfirmedModal();
  };

  return (
    <Modal open={isOpen} onClose={onClose} >
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: rightOffset,
          width: "300px",
          bgcolor: "white",
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6"  sx={{color: "black"}}>
          Total items: {cartItems.length}
        </Typography>

        {/* Customer Name */}
        <TextField
          label="Your Name"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            if (e.target.value.trim() === "") {
              setWarning("Name cannot be empty");
            } else {
              setWarning("");
            }
          }}
          fullWidth
          margin="dense"
          error={!!warning}
          helperText={warning}
        />

        {/* Cart Items List */}
        <List
          sx={{
            color:"black",
            bgcolor: "background.paper",
            borderRadius: 1,
            mt: 2,
          }}
        >
          {cartItems.map((item, index) => (
            <div key={index}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeFromCart(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.title} - Qty: ${item.quantity}`}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
          {cartItems.length === 0 && (
            <Typography sx={{ p: 2 }}>Your cart is empty.</Typography>
          )}
        </List>

        {/* Warning / Submit Errors */}
        {submitWarning && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitWarning}
          </Alert>
        )}

        {/* Buttons */}
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            fullWidth
            sx={{
              height: 46,
              borderRadius: "12px",
              backgroundColor: "#F2C078",
              color: "#2E244D",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#FFD49A" },
            }}
          >
            Place Order
          </Button>

          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth
            sx={{
              height: 46,
              borderRadius: "12px",
              borderColor: "#2E244D",
              color: "#2E244D",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#F2C078",
                backgroundColor: "rgba(242, 192, 120, 0.12)",
              },
            }}
          >
            Add Another
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={clearCart}
            fullWidth
          >
            Clear Cart
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
