import { CartContext } from "./CartContext";
import type { CartContextType } from "./CartContext";
import React, { useState } from "react";
import type { OrderItem, Order} from "../types/order";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  //add item to cart
  const addToCart = (newItem: OrderItem) => {
    setCartItems((prevItems) => [...prevItems, newItem]);
  };

  //remove item from cart by index
  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  //clear cart

  const clearCart = () => {
    setCartItems([]);
  };

  //toggle cart visibility (optional)
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  //submit order (optional)
  const submitOrder = async (order: Order) => {
    if (cartItems.length === 0) {
      return;
    }
    try {
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, order);
      clearCart();
    } catch (error) {
      //alert user of error
      alert("Sorry, only admin can submit order.");
      console.error("Error submitting order: ", error);
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    toggleCart,
    submitOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
