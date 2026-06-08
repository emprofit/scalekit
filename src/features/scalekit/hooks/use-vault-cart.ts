"use client";

import { useEffect, useMemo, useState } from "react";

import { getVaultProductById } from "../data/vault-products";
import {
  addVaultCartItem,
  clearVaultCart,
  readVaultCart,
  removeVaultCartItem,
  subscribeVaultCart,
} from "../lib/vault-cart";

export function useVaultCart() {
  const [cart, setCart] = useState(() => readVaultCart());

  useEffect(() => {
    queueMicrotask(() => {
      setCart(readVaultCart());
    });

    const unsubscribe = subscribeVaultCart(() => {
      setCart(readVaultCart());
    });

    return unsubscribe;
  }, []);

  const items = useMemo(() => {
    return cart
      .map((item) => {
        const product = getVaultProductById(item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [cart]);

  const itemCount = items.length;

  const subtotal = items.reduce((total, item) => {
    return total + item.product.price;
  }, 0);

  const hasItem = (productId: string) =>
    items.some((item) => item.productId === productId);

  return {
    items,
    itemCount,
    subtotal,
    isEmpty: items.length === 0,
    hasItem,
    addItem: addVaultCartItem,
    removeItem: removeVaultCartItem,
    clearCart: clearVaultCart,
  };
}
