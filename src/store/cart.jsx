import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const itemId = `${item.id}-${item.size}-${item.color}`
          const existingItem = state.items.find(
            (i) => `${i.id}-${i.size}-${i.color}` === itemId
          )
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                `${i.id}-${i.size}-${i.color}` === itemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => `${i.id}-${i.size}-${i.color}` !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            `${i.id}-${i.size}-${i.color}` === id ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
) 