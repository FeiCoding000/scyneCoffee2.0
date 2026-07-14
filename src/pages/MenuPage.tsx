import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import type { Coffee } from "../types/coffee";
import MenuItemCard from "../components/MenuItemCard";
import CoffeeModal from "../components/forms/CoffeeModal";
import CartModal from "../components/CartModal";
import { useCart } from "../contexts/CartContext";
import OrderConfirmedModal from "../components/OrderConfirmedModal";
import MenuSearchbar from "../components/MenuSearchbar";
import { useMenuItems } from "../hooks/useMenuItems";

export default function MenuPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: menuItems = [], error, isLoading } = useMenuItems();
  const [selectedItem, setSelectedItem] = useState<Coffee>();
  const { isCartOpen, toggleCart } = useCart();
  const [isOrderConfirmed, setIsOrderCnfirmed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const maxPopularity = useMemo(
    () =>
      menuItems.reduce(
        (max, item) => (item.popularity > max ? item.popularity : max),
        0,
      ),
    [menuItems],
  );

  const filteredItems = useMemo(() => {
    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (!trimmedTerm) return menuItems;

    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedTerm) ||
        item.description.toLowerCase().includes(trimmedTerm) ||
        item.category.toLowerCase().includes(trimmedTerm) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(trimmedTerm)),
    );
  }, [menuItems, searchTerm]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    if (isCartOpen) {
      setIsModalOpen(false);
    }
  }, [isCartOpen]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1, sm: 2 },
        pb: 4,
      }}
    >
      <OrderConfirmedModal
        open={isOrderConfirmed}
        onClose={() => setIsOrderCnfirmed(false)}
      />

      {isCartOpen && (
        <CartModal
          isOpen={isCartOpen}
          onClose={toggleCart}
          handleConfirmedModal={() => {
            setIsOrderCnfirmed(true);
            navigate("/");
          }}
        />
      )}

      {isModalOpen && (
        <CoffeeModal
          coffee={selectedItem || null}
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Box
        sx={{
          width: "min(1180px, 100%)",
          color: "white",
          display: "flex",
          gap: 3,
          flexDirection: "column",
          p: { xs: 2, sm: 4 },
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: "#F2C078",
              border: "1px solid rgba(242, 192, 120, 0.75)",
              borderRadius: "12px",
              textTransform: "none",
              px: 2,
              py: 1.2,
              alignSelf: { xs: "flex-start", sm: "center" },
              "&:hover": {
                backgroundColor: "rgba(242, 192, 120, 0.12)",
                borderColor: "#F2C078",
              },
            }}
          >
            Back Home
          </Button>
          <MenuSearchbar onSearch={onSearch} />
        </Box>

        {isLoading && menuItems.length === 0 && (
          <Typography sx={{ color: "rgba(255, 255, 255, 0.82)" }}>
            Loading menu...
          </Typography>
        )}

        {error && menuItems.length === 0 && (
          <Typography sx={{ color: "#ffb4ab" }}>
            Failed to load menu. Please try again later.
          </Typography>
        )}

        <Box className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              coffee={item}
              maxPopularity={maxPopularity}
              onSelect={() => {
                setIsModalOpen(true);
                setSelectedItem(item);
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
