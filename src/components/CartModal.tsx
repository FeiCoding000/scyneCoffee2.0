import { useState } from "react";
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

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart, submitOrder } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [warning, setWarning] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");

  const order: Order = {
    items: cartItems,
    customerName: customerName,
    isCompleted: false,
  };

  const handlePlaceOrder = () => {
    if (customerName.trim() === "") {
      setSubmitWarning("Please enter your name before placing the order.");
      return;
    } else if (cartItems.length === 0) {
      setSubmitWarning("Your cart is empty.");
      return;
    }
    setSubmitWarning("");
    submitOrder(order);
    setCustomerName("");
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400, md: 500 },
          bgcolor: "burlywood",
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          🛒 Total items: {cartItems.length}
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
        <List sx={{ bgcolor: "background.paper", border: "1px solid gray", borderRadius: 1, mt: 2 }}>
          {cartItems.map((item, index) => (
            <div key={index}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={`${item.title} - Qty: ${item.quantity}`} />
              </ListItem>
              <Divider />
            </div>
          ))}
          {cartItems.length === 0 && <Typography sx={{ p: 2 }}>Your cart is empty.</Typography>}
        </List>

        {/* Warning / Submit Errors */}
        {submitWarning && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitWarning}
          </Alert>
        )}

        {/* Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handlePlaceOrder} fullWidth>
            Place Order
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearCart} fullWidth>
            Clear Cart
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
