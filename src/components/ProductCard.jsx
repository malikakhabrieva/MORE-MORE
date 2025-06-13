import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

function ProductCard({ product, onAddToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const getImageUrl = (index) => {
    if (!product.images || !product.images[index]) return '';
    return product.images[index].startsWith('http') 
      ? product.images[index] 
      : `http://localhost:3002${product.images[index]}`;
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedColor || !selectedSize) {
      setShowModal(true);
      return;
    }
    onAddToCart(product, selectedColor, selectedSize);
    setShowModal(false);
    setSelectedColor('');
    setSelectedSize('');
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={getImageUrl(currentImageIndex)}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
            >
              ←
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
            >
              →
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.price} ₽</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-custom-blue text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <FaShoppingCart />
          В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductCard; 