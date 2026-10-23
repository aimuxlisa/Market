"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  stock?: number;
}

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  favoritesCount: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "nexora_favorites_v1";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load favorites from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage:", e);
    }
  }, [favorites, isInitialized]);

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
