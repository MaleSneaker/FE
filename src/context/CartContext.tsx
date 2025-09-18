import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyCart } from "../services/cart.service";

type ICartContext = {
 quantity: number,
 setQuantity: (value: number)=> void
};
const CartContext = createContext<ICartContext>({
 quantity: 0,
 setQuantity: ()=> {}
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyCart();
        setQuantity(data.items.length);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <CartContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
