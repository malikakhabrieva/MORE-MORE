import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { useCartStore } from '../store/cart';
import CartItem from '../components/cart/CartItem';

function CartPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Корзина пуста');
      return;
    }

    // Формируем сообщение с составом заказа
    const orderDetails = items.map(item => 
      `- ${item.name}\n  Размер: ${item.selectedSize}, Цвет: ${item.selectedColor}\n  Количество: ${item.quantity} шт.\n  Цена: ${item.price.toLocaleString('ru-RU')} ₽`
    ).join('\n\n');

    const message = `Здравствуйте! Я хочу оформить заказ:\n\n${orderDetails}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽`;

    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Открываем Telegram с предварительно заполненным сообщением
    window.open(`https://t.me/khabrieva_malika?text=${encodedMessage}`, '_blank');
    
    // Очищаем корзину
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <FaShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
          <Link to="/catalog" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Корзина</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {items.map((item) => (
              <CartItem 
                key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} 
                item={item} 
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Итого</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Товары ({items.length})</span>
                <span>{total.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Итого к оплате</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <button 
                className="w-full btn btn-primary mb-4" 
                onClick={handleCheckout}
              >
                Оформить заказ в Telegram
              </button>
              <button 
                className="w-full btn btn-secondary" 
                onClick={clearCart}
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage; 