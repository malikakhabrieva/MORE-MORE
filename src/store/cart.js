import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: async (product, selectedColor, selectedSize, quantity) => {
        try {
          // Обновляем количество товара на сервере
          const response = await fetch(`http://localhost:3002/api/products/${product._id}/quantity`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              color: selectedColor,
              size: selectedSize,
              quantity,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }

          const { items } = get();
          const existingItem = items.find(
            (item) =>
              item._id === product._id &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
          );

          if (existingItem) {
            set({
              items: items.map((item) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            set({
              items: [...items, { 
                ...product, 
                selectedColor,
                selectedSize,
                quantity 
              }],
            });
          }
        } catch (error) {
          console.error('Ошибка при добавлении товара в корзину:', error);
          throw error;
        }
      },
      removeFromCart: async (productId, color, size) => {
        try {
          const { items } = get();
          const item = items.find(
            (item) =>
              item._id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size
          );

          if (item) {
            // Возвращаем количество товара на сервере
            const response = await fetch(`http://localhost:3002/api/products/${productId}/quantity`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                color,
                size,
                quantity: -item.quantity, // Отрицательное значение для возврата товара
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message);
            }

            set({
              items: items.filter(
                (item) =>
                  !(
                    item._id === productId &&
                    item.selectedColor === color &&
                    item.selectedSize === size
                  )
              ),
            });
          }
        } catch (error) {
          console.error('Ошибка при удалении товара из корзины:', error);
          throw error;
        }
      },
      updateQuantity: async (productId, color, size, newQuantity) => {
        try {
          const { items } = get();
          const item = items.find(
            (item) =>
              item._id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size
          );

          if (item) {
            const quantityDiff = newQuantity - item.quantity;

            // Обновляем количество товара на сервере
            const response = await fetch(`http://localhost:3002/api/products/${productId}/quantity`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                color,
                size,
                quantity: quantityDiff,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message);
            }

            set({
              items: items.map((item) =>
                item._id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            });
          }
        } catch (error) {
          console.error('Ошибка при обновлении количества товара:', error);
          throw error;
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export { useCartStore }; 