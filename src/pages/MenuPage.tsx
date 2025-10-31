import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import type { Coffee } from "../types/coffee";
import MenuItemCard from "../components/MenuItemCard";
import CoffeeModal from "../components/forms/CoffeeModal";
import CartModal from "../components/CartModal";
import { useCart } from "../contexts/CartContext";
import OrderConfirmedModal from "../components/OrderConfirmedModal";
import MenuSearchbar from "../components/MenuSearchbar";

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<Coffee[]>([]);
  const [selectedItem, setSelectedItem] = useState<Coffee>();
  const { isCartOpen, toggleCart } = useCart();
  const [maxPupularity, setMaxPopularity] = useState(0);
  const [isOrderConfirmed, setIsOrderCnfirmed] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Coffee[]>([]);

  const onSearch = (term: string) => {
      term= term.trim();
      if(!term){
        return;
      } 
      const lower = term.toLowerCase();
      const result = menuItems.filter(
        item => item.name.toLowerCase().includes(lower) || 
                item.description.toLowerCase().includes(lower) ||
                item.category.toLowerCase().includes(lower) ||
                item.tags?.forEach(
                  (tag) => {
                    tag.includes(lower)
                  }
                )
      )
      setFilteredItems(result);
  }


  const fetchMenuItems = async () => {
    try {
      const menuCollection = collection(db, "coffee");
      const menuSnapshot = await getDocs(menuCollection);
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
      //get max popularity
      const maxPop = menuList.reduce(
        (max, item) => (item.popularity > max ? item.popularity : max),
        0
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
    <div>
    <OrderConfirmedModal open={isOrderConfirmed} onClose={() => setIsOrderCnfirmed(false)}></OrderConfirmedModal>
    {isCartOpen && <CartModal isOpen={isCartOpen} onClose={toggleCart} handleConfirmedModal={() => {setIsOrderCnfirmed(true)}}/>}
      {isModalOpen && (
        <CoffeeModal
          coffee={selectedItem || null}
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    <div>
      <div><MenuSearchbar onSearch={onSearch} ></MenuSearchbar></div>
      <div className="menu-grid">
        {filteredItems.map((item) => (
        <MenuItemCard
          key={item.id}
          coffee={item}
          maxPopularity={maxPupularity}
          onSelect={() => {
            setIsModalOpen(true);
            setSelectedItem(item);
          }}
        />
      ))}</div>

      
    </div>
    </div>
  );
}
