"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItemData {
  productId: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItemData[];
  totalCount: number;
  subtotal: number;
  addToCart: (product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    imageUrl?: string;
    stock: number;
  }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nexora_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [items, isInitialized]);

  const addToCart: CartContextType["addToCart"] = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + qty);
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
          quantity: Math.min(product.stock, Math.max(1, qty)),
          maxStock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const validQty = Math.min(item.maxStock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
