import { createContext, useContext} from "react";
import type { Order, OrderItem } from "../types/order";

export interface CartContextType { 
    cartItems: OrderItem[];
    addToCart: (item: OrderItem) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    toggleCart: () => void;
    submitOrder: (order: Order) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}