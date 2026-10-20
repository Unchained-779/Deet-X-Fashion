import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItemType {
  variantId: string;
  productId: string;
  title: string;
  size: string;
  colorName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  maxStock: number;
}

interface CartStore {
  items: CartItemType[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (item: Omit<CartItemType, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (newItem) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.variantId === newItem.variantId);
        const addQty = newItem.quantity || 1;

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const currentItem = updatedItems[existingIndex];
          const newQuantity = Math.min(currentItem.quantity + addQty, currentItem.maxStock);
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: newQuantity,
          };
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          set({
            items: [
              ...items,
              {
                ...newItem,
                quantity: Math.min(addQty, newItem.maxStock),
              },
            ],
            isDrawerOpen: true,
          });
        }
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "deetx-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
