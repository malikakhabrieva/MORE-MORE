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
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <img 
        src={item.images[0]} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-500">
          Размер: {item.selectedSize}, Цвет: {item.selectedColor}
        </p>
        <p className="text-gray-500">{item.price.toLocaleString('ru-RU')} ₽</p>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button 
            onClick={() => handleQuantityChange(-1)}
            disabled={isUpdating || item.quantity <= 1}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMinus size={14} />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(1)}
            disabled={isUpdating}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus size={14} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">
          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
        </p>
        <button 
          onClick={handleRemove}
          disabled={isUpdating}
          className="mt-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItem; 