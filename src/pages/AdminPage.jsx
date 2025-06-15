import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaSearch } from 'react-icons/fa';
import ProductForm from '../components/admin/ProductForm';

const API_URL = 'http://localhost:3003/api';

// Предопределенные цвета
const PREDEFINED_COLORS = [
  { name: 'Черный', code: '#000000' },
  { name: 'Белый', code: '#FFFFFF' },
  { name: 'Серый', code: '#808080' },
  { name: 'Пшеничный', code: '#F5DEB3' },
  { name: 'Коричневый', code: '#452612' },
  { name: 'Красный', code: '#FF0000' },
  { name: 'Розовый', code: '#FF00FF' },
  { name: 'Желтый', code: '#FFFF00' },
  { name: 'Зеленый', code: '#008000' },
  { name: 'Голубой', code: '#00FFFF' },
  { name: 'Синий', code: '#000080' }
];

// Предопределенные размеры
const PREDEFINED_SIZES = ['XS', 'S', 'M', 'L'];

// Konami Code последовательность
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA'
];

function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [keySequence, setKeySequence] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Проверяем, был ли доступ получен через Konami Code
    const adminAccess = sessionStorage.getItem('adminAccess');
    if (!adminAccess) {
      navigate('/');
      return;
    }

    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated, navigate]);

  // Обработчик Konami Code
  useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = [...keySequence, e.code];
      
      // Ограничиваем длину последовательности
      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift();
      }
      
      setKeySequence(newSequence);

      // Проверяем совпадение с Konami Code
      if (newSequence.join(',') === KONAMI_CODE.join(',')) {
        e.preventDefault();
        sessionStorage.setItem('adminAccess', 'true');
        setIsAuthenticated(false); // Сбрасываем состояние аутентификации
        setKeySequence([]); // Сбрасываем последовательность
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  useEffect(() => {
    if (selectedProduct) {
      // Инициализация выбранных цветов и размеров при редактировании
      const colors = selectedProduct.colors || [];
      setSelectedColors(colors.map(c => c.name));
      const sizes = selectedProduct.sizes || [];
      setSelectedSizes(sizes);
    } else {
      setSelectedColors([]);
      setSelectedSizes([]);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      setError('Неверные учетные данные');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAccess');
    navigate('/');
  };

  const handleColorChange = (colorName) => {
    setSelectedColors(prev => {
      if (prev.includes(colorName)) {
        return prev.filter(c => c !== colorName);
      } else {
        return [...prev, colorName];
      }
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setSelectedProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setSelectedProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (selectedProduct) {
        // Обновление существующего товара
        const response = await axios.put(`${API_URL}/products/${selectedProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
      } else {
        // Создание нового товара
        const response = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
      }

      setShowProductModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка при сохранении товара';
      alert(errorMessage);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Вход в админ-панель</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-custom-blue text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <button
          className="bg-custom-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 font-medium"
          onClick={handleAddProduct}
        >
          <FaPlus className="text-lg" />
          Добавить товар
        </button>
      </div>

      {/* Поиск товаров */}
      <div className="mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Поиск товаров по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 focus:outline-none"
          />
          <div className="px-4 py-2 bg-gray-100">
            <FaSearch className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.price} ₽
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedProduct ? 'Редактирование товара' : 'Новый товар'}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <ProductForm
                product={selectedProduct}
                onClose={() => setShowProductModal(false)}
                onSubmit={handleSaveProduct}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage; 