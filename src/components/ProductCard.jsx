import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

function ProductCard({ product, onAddToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

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
    <>
      <div className="product-card" onClick={() => setShowModal(true)}>
        <div className="product-image-container">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="product-image"
          />
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="image-nav-button prev"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={handleNextImage}
                className="image-nav-button next"
                aria-label="Next image"
              >
                →
              </button>
              <div className="image-dots">
                {product.images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price} ₽</p>
        </div>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{product.name}</h2>
            <div className="modal-grid">
              <div className="modal-images">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="modal-main-image"
                />
                <div className="modal-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-details">
                <p className="modal-price">{product.price} ₽</p>
                <p className="modal-description">{product.description}</p>
                
                <div className="modal-section">
                  <h3>Цвет</h3>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Размер</h3>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedColor || !selectedSize}
                  className="modal-add-to-cart"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgb(173, 194, 217)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <FaShoppingCart /> Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard; 