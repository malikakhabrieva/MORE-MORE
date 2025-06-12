import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/cart';
import ProductGrid from '../components/catalog/ProductGrid';
import ProductModal from '../components/catalog/ProductModal';
import SearchBar from '../components/catalog/SearchBar';
import FilterPanel from '../components/catalog/FilterPanel';

const API_URL = 'http://localhost:3002/api';

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'default',
    page: parseInt(searchParams.get('page')) || 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: filters.category,
        search: filters.search,
        sort: filters.sort,
        page: filters.page,
        limit: 12
      });

      const response = await axios.get(`${API_URL}/products?${params}`);
      setProducts(response.data.products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (error) {
      setError('Ошибка при загрузке товаров');
      setLoading(false);
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    setSearchParams(prev => {
      prev.set('search', searchTerm);
      prev.set('page', '1');
      return prev;
    });
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category: category === 'all' ? '' : category, page: 1 }));
    setSearchParams(prev => {
      prev.set('category', category === 'all' ? '' : category);
      prev.set('page', '1');
      return prev;
    });
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort }));
    setSearchParams(prev => {
      prev.set('sort', sort);
      return prev;
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    setSearchParams(prev => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCart = (product, selectedColor, selectedSize) => {
    addToCart({
      ...product,
      selectedColor,
      selectedSize
    });
    setShowModal(false);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Фильтры */}
        <div className="w-full md:w-64 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="space-y-2">
            <button
              className={`category-btn ${!filters.category ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              Все категории
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                className={`category-btn ${filters.category === category.slug ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1">
          {/* Поиск */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Сортировка */}
          <div className="flex justify-end mb-6">
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="price_asc">По возрастанию цены</option>
              <option value="price_desc">По убыванию цены</option>
            </select>
          </div>

          {loading ? (
            <div className="loading text-center py-8">Загрузка...</div>
          ) : (
            <>
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
              />

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="pagination-button"
                  >
                    Назад
                  </button>
                  <span className="page-info">
                    Страница {pagination.currentPage} из {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="pagination-button"
                  >
                    Вперед
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default CatalogPage; 