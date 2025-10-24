import type { Coffee } from "../../types/coffee";
import type { OrderItem } from "../../types/order";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "../../contexts/CartContext";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";

type CoffeeModalProps = {
  coffee: Coffee | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CoffeeModal({ coffee, isOpen, onClose }: CoffeeModalProps) {
  const { register, handleSubmit, reset } = useForm<OrderItem>();
  const { addToCart } = useCart();
  const [isIced, setIsIced] = useState(false);
  const defaultMilk = coffee?.defaultMilk || "none";

  const onSubmit = (data: OrderItem) => {
    const order: OrderItem = {
      coffeeId: coffee?.id,
      title: coffee?.name || "",
      isIced: data.isIced || false,
      strength: data.strength || 1,
      quantity: data.quantity || 1,
      milk: data.milk || "none",
      isXHot: data.isXHot ? true : false,
      teaBags: data.teaBags || 0,
      sugar: data.sugar || 0,
      sweetner: data.sweetner || 0,
      extraWater:
        coffee?.category?.includes("tea") || coffee?.name === "long black" ? 500 : 0,
      isHot: data.isIced ? false : true,
      isCompleted: false,
    };
    addToCart(order);
    reset();
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500, md: 600 },
          maxHeight: "90vh",
          bgcolor: isIced ? "#a0e7e5" : "#f8f1f1",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Selected: {coffee?.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Category: {coffee?.category}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* Quantity */}
            <TextField
              label="Quantity"
              type="number"
              defaultValue={1}
              {...register("quantity", { required: true, valueAsNumber: true })}
              fullWidth
            />

            {/* Milk */}
            <FormControl fullWidth>
              <InputLabel>Milk</InputLabel>
              <Select defaultValue={defaultMilk} {...register("milk", { required: true })}>
                <MuiMenuItem value="full cream">Full Cream</MuiMenuItem>
                <MuiMenuItem value="lite">Lite</MuiMenuItem>
                <MuiMenuItem value="almond">Almond</MuiMenuItem>
                <MuiMenuItem value="soy">Soy</MuiMenuItem>
                <MuiMenuItem value="oat">Oat</MuiMenuItem>
                <MuiMenuItem value="skim">Skim</MuiMenuItem>
                <MuiMenuItem value="none">None</MuiMenuItem>
              </Select>
            </FormControl>

            {/* Strength or Tea Bags */}
            {coffee?.category === "tea" ? (
              <FormControl fullWidth>
                <InputLabel>Tea Bags</InputLabel>
                <Select defaultValue={1} {...register("teaBags", { required: true })}>
                  <MuiMenuItem value={1}>1</MuiMenuItem>
                  <MuiMenuItem value={2}>2</MuiMenuItem>
                  <MuiMenuItem value={3}>3</MuiMenuItem>
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <InputLabel>Strength</InputLabel>
                <Select defaultValue={1} {...register("strength", { valueAsNumber: true })}>
                  <MuiMenuItem value={0.5}>Weak</MuiMenuItem>
                  <MuiMenuItem value={1}>Regular</MuiMenuItem>
                  <MuiMenuItem value={2}>Strong</MuiMenuItem>
                  <MuiMenuItem value={3}>Very Strong</MuiMenuItem>
                </Select>
              </FormControl>
            )}

            {/* Iced */}
            {!coffee?.hotOnly && (
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("isIced")}
                    onChange={(e) => setIsIced(e.target.checked)}
                  />
                }
                label="Iced Version"
              />
            )}

            {/* Extra Hot */}
            {(coffee?.tags?.includes("hot") || coffee?.hotOnly) && (
              <FormControlLabel
                control={<Checkbox {...register("isXHot")} />}
                label="Extra Hot"
              />
            )}

            {/* Sugar */}
            <TextField
              label="Sugar"
              type="number"
              defaultValue={0}
              {...register("sugar", { valueAsNumber: true })}
              fullWidth
            />

            {/* Sweetener */}
            <TextField
              label="Sweetener"
              type="number"
              defaultValue={0}
              {...register("sweetner", { valueAsNumber: true })}
              fullWidth
            />

            {/* Buttons */}
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                Add to Cart
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
