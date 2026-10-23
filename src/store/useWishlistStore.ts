import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItemType {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  imageUrl?: string | null;
  categoryName?: string;
}

interface WishlistStore {
  items: WishlistItemType[];
  addItem: (item: WishlistItemType) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItemType) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (!items.some((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      toggleItem: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      totalItems: () => get().items.length,
    }),
    {
      name: "deeta-fashion-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
