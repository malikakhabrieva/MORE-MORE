import React from 'react';
import { createIcon } from '../../js/icons';

function Cart({ isOpen, onClose, items, onUpdateItems }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id, delta) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    onUpdateItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const handleRemove = (id) => {
    const newItems = items.filter(item => item.id !== id);
    onUpdateItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const handleCheckout = () => {
    // Здесь будет логика оформления заказа
    alert('Заказ оформлен!');
    onUpdateItems([]);
    localStorage.removeItem('cart');
    onClose();
  };

  return (
    <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="cart-content">
        <div className="cart-header">
          <h2>Корзина</h2>
          <button className="btn-icon close-icon" onClick={onClose} aria-label="Закрыть"></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Корзина пуста</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">{item.price} ₽</p>
                  <div className="quantity-controls">
                    <button 
                      className="btn-icon minus-icon" 
                      onClick={() => handleQuantityChange(item.id, -1)}
                      aria-label="Уменьшить количество"
                    ></button>
                    <span>{item.quantity}</span>
                    <button 
                      className="btn-icon plus-icon" 
                      onClick={() => handleQuantityChange(item.id, 1)}
                      aria-label="Увеличить количество"
                    ></button>
                  </div>
                </div>
                <button 
                  className="btn-icon remove-icon" 
                  onClick={() => handleRemove(item.id)}
                  aria-label="Удалить товар"
                ></button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Итого:</span>
            <span>{total} ₽</span>
          </div>
          <button 
            className="btn btn-primary checkout-btn" 
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart; 