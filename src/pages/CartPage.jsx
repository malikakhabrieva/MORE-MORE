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
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <FaShoppingBag className="empty-cart-icon" />
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <Link to="/catalog" className="btn btn-primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Корзина</h1>
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
            ))}
          </div>
          <div className="cart-summary">
            <h2>Итого</h2>
            <div className="summary-row">
              <span>Товары ({items.length})</span>
              <span>{total} ₽</span>
            </div>
            <button className="btn btn-primary" onClick={handleCheckout}>
              Оформить заказ
            </button>
            <button className="btn btn-secondary" onClick={clearCart}>
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage; 