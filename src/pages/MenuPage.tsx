import { db } from "../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import type { Coffee } from "../types/coffee";
import MenuItemCard from "../components/MenuItemCard";
import CoffeeModal from "../components/forms/CoffeeModal";
import CartModal from "../components/CartModal";
import { useCart } from "../contexts/CartContext";
import OrderConfirmedModal from "../components/OrderConfirmedModal";
import MenuSearchbar from "../components/MenuSearchbar";

export default function MenuPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<Coffee[]>([]);
  const [selectedItem, setSelectedItem] = useState<Coffee>();
  const { isCartOpen, toggleCart } = useCart();
  const [maxPopularity, setMaxPopularity] = useState(0);
  const [isOrderConfirmed, setIsOrderCnfirmed] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Coffee[]>([]);

  const onSearch = (term: string) => {
    const trimmedTerm = term.trim().toLowerCase();

    if (!trimmedTerm) {
      setFilteredItems(menuItems);
      return;
    }

    const result = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedTerm) ||
        item.description.toLowerCase().includes(trimmedTerm) ||
        item.category.toLowerCase().includes(trimmedTerm) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(trimmedTerm)),
    );

    setFilteredItems(result);
  };

  const fetchMenuItems = async () => {
    try {
      const menuCollection = collection(db, "coffee");
      const q = query(
        menuCollection,
        orderBy("category", "asc"),
        orderBy("popularity", "desc"),
      );
      const menuSnapshot = await getDocs(q);
      const menuList: Coffee[] = menuSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          tags: data.tags,
          popularity: data.popularity,
          hotOnly: data.hotOnly,
          defaultMilk: data.defaultMilk,
        };
      });
      setMenuItems(menuList);
      setFilteredItems(menuList);

      const maxPop = menuList.reduce(
        (max, item) => (item.popularity > max ? item.popularity : max),
        0,
      );
      setMaxPopularity(maxPop);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

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
