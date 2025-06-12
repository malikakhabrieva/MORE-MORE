import React from 'react';

function ProductGrid({ products, onProductClick }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div
          key={product._id}
          className="product-card"
          onClick={() => onProductClick(product)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
          />
          <div className="product-card-content">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">{product.price} ₽</p>
            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
            >
              В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 