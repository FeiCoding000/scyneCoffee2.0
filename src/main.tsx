import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { CartProvider } from "./contexts/CartProvider.tsx";
import { NotiProvider } from "./contexts/NotiProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <NotiProvider>
          <App />
        </NotiProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
