"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { TelegramWebApp, TelegramUser } from "@/types/telegram";

interface TelegramContextType {
  isTelegram: boolean;
  tgUser: TelegramUser | null;
  webApp: TelegramWebApp | null;
  expand: () => void;
  close: () => void;
  haptic: (type?: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegram: false,
  tgUser: null,
  webApp: null,
  expand: () => {},
  close: () => {},
  haptic: () => {},
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe) {
      setIsTelegram(true);
      setWebApp(tg);
      tg.ready();
      tg.expand();

      // Set user from initDataUnsafe if available
      if (tg.initDataUnsafe.user) {
        setTgUser(tg.initDataUnsafe.user);
      }

      // Auto-authenticate via our API if initData exists
      if (tg.initData) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        }).catch((err) => {
          console.error("Auto Telegram auth failed:", err);
        });
      }
    }
  }, []);

  const expand = () => {
    webApp?.expand();
  };

  const close = () => {
    webApp?.close();
  };

  const haptic = (type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") => {
    try {
      if (!webApp?.HapticFeedback) return;
      if (type === "success" || type === "warning" || type === "error") {
        webApp.HapticFeedback.notificationOccurred(type);
      } else {
        webApp.HapticFeedback.impactOccurred(type);
      }
    } catch {
      // ignore
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        isTelegram,
        tgUser,
        webApp,
        expand,
        close,
        haptic,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
