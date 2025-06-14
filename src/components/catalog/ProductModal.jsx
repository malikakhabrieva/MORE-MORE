import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';

function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Пожалуйста, выберите цвет и размер');
      return;
    }

    const selectedColorData = product.colors.find(c => c.name === selectedColor);
    const selectedSizeData = selectedColorData.sizes.find(s => s.size === selectedSize);

    if (selectedSizeData.quantity < quantity) {
      alert('К сожалению, доступно меньшее количество товара');
      return;
    }

    onAddToCart(product, selectedColor, selectedSize, quantity);
    setShowNotification(true);
    
    // Закрываем модальное окно через 1.5 секунды
    setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 1500);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Получаем доступные размеры для выбранного цвета
  const availableSizes = selectedColor
    ? product.colors.find(c => c.name === selectedColor)?.sizes || []
    : [];

  // Проверяем, есть ли доступные размеры с ненулевым количеством
  const hasAvailableSizes = availableSizes.some(size => size.quantity > 0);

  // Получаем максимальное доступное количество для выбранного размера
  const maxQuantity = selectedSize
    ? availableSizes.find(s => s.size === selectedSize)?.quantity || 0
    : 0;

  // Обновляем количество при изменении размера
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const sizeData = availableSizes.find(s => s.size === size);
    if (sizeData && quantity > sizeData.quantity) {
      setQuantity(sizeData.quantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Уведомление об успешном добавлении */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <FaCheck />
          <span>Товар добавлен в корзину</span>
        </div>
      )}

      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Галерея изображений */}
            <div className="space-y-4">
              <div 
                className="aspect-square relative cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-custom-blue' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - изображение ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="space-y-6">
              <p className="text-gray-600">{product.description}</p>
              <p className="text-2xl font-bold text-custom-blue">{product.price} ₽</p>

              {/* Выбор цвета */}
              <div>
                <h3 className="font-semibold mb-2">Цвет</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const hasAvailableSizesForColor = color.sizes.some(size => size.quantity > 0);
                    return (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color.name);
                          setSelectedSize('');
                          setQuantity(1);
                        }}
                        disabled={!hasAvailableSizesForColor}
                        className={`p-2 rounded-lg border ${
                          selectedColor === color.name
                            ? 'border-custom-blue'
                            : 'border-gray-300'
                        } ${
                          !hasAvailableSizesForColor
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:border-custom-blue'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Выбор размера */}
              <div>
                <h3 className="font-semibold mb-2">Размер</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => handleSizeSelect(size.size)}
                      disabled={size.quantity === 0}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedSize === size.size
                          ? 'border-custom-blue bg-custom-blue text-white'
                          : 'border-gray-300'
                      } ${
                        size.quantity === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-custom-blue'
                      }`}
                    >
                      {size.size}
                      {size.quantity > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({size.quantity} шт.)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Выбор количества */}
              {selectedSize && (
                <div>
                  <h3 className="font-semibold mb-2">Количество</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1 border rounded-lg hover:border-custom-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-3 py-1 border rounded-lg hover:border-custom-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500">
                      Доступно: {maxQuantity} шт.
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full"
                disabled={!selectedColor || !selectedSize || !hasAvailableSizes}
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для просмотра изображений в полном размере */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={handlePrevImage}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <FaChevronLeft size={32} />
            </button>
            
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            <button
              onClick={handleNextImage}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <FaChevronRight size={32} />
            </button>

            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductModal; 