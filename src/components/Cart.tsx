import { useCart } from "../contexts/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { IconButton, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function Cart() {
  const CartBadge = styled(Badge)({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid white`,
      padding: "0 4px",
    },
  });
  const { cartItems, toggleCart } = useCart();
  return (
    <div  className= "carIcon" onClick={toggleCart} style={{ cursor: "pointer" }}>
      <IconButton>
        <CartBadge badgeContent={cartItems.length} color="primary" overlap="circular" />
        <ShoppingCartIcon fontSize="small" sx={{color:"white"}} />
      </IconButton>
    </div>
  );
}
