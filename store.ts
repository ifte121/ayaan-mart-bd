"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name_bn: string;
  name_en: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.stock) }] };
        });
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "ayaan-mart-cart" }
  )
);

interface WishlistStore {
  items: number[];
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  isWishlisted: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) =>
        set((state) => {
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      isWishlisted: (id) => get().items.includes(id),
    }),
    { name: "ayaan-mart-wishlist" }
  )
);
