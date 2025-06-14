import React, { useState } from 'react';
import { useCartStore } from '../../store/cart';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = async (change) => {
    try {
      setIsUpdating(true);
      setError('');
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        await updateQuantity(item._id, item.selectedColor, item.selectedSize, newQuantity);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsUpdating(true);
      setError('');
      await removeItem(item._id, item.selectedColor, item.selectedSize);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-6 p-6 border-b border-gray-200 last:border-b-0">
      <img 
        src={item.images[0]} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-lg text-gray-900 mb-1">{item.name}</h3>
        <p className="text-gray-500 mb-2">
          Размер: {item.selectedSize}, Цвет: {item.selectedColor}
        </p>
        <p className="text-gray-900 font-medium mb-2">
          {item.price.toLocaleString('ru-RU')} ₽
        </p>
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleQuantityChange(-1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
          >
            <FaMinus size={14} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(1)}
            disabled={isUpdating}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100"
          >
            <FaPlus size={14} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-lg text-gray-900 mb-2">
          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
        </p>
        <button 
          onClick={handleRemove}
          disabled={isUpdating}
          className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItem; 