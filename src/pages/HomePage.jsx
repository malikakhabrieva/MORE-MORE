import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sliderImages } from '../data/sliderImages';
import ImageSlider from '../components/ImageSlider';

const API_URL = 'http://localhost:3002/api';

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

function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keySequence, setKeySequence] = useState([]);

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
        navigate('/admin');
        setKeySequence([]); // Сбрасываем последовательность
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
            <div className="relative overflow-hidden">
              <img 
                src="/assets/images/hero-banner-1.jpg" 
                alt="Banner 1" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold">Новая коллекция</h2>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img 
                src="/assets/images/hero-banner-2.jpg" 
                alt="Banner 2" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold">Скидки</h2>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img 
                src="/assets/images/hero-banner-3.jpg" 
                alt="Banner 3" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold">Акции</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marquee-section bg-[#ADC2D9] py-4 overflow-hidden whitespace-nowrap">
        <div className="marquee-content inline-block text-white font-semibold text-2xl animate-marquee">
          <span className="mx-8">♡НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ♡</span>
          <span className="mx-8">♡НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ♡</span>
          <span className="mx-8">♡НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ♡</span>
          <span className="mx-8">♡НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ♡</span>
          <span className="mx-8">♡НОВАЯ КОЛЛЕКЦИЯ УЖЕ В ПРОДАЖЕ♡</span>
        </div>
      </section>

      <section className="mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/catalog?category=${category.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  src={category.image || '/assets/images/category-placeholder.jpg'}
                  alt={category.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12 py-8 bg-custom-cream text-center">
        <h2 className="text-3xl font-bold mb-8">ВЫ О НАС #MOREMOREGIRLS</h2>
        <div className="container mx-auto px-4">
          <ImageSlider images={sliderImages} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Качество</h3>
            <p className="text-gray-600">
              Мы тщательно отбираем материалы и производителей, чтобы гарантировать
              высочайшее качество нашей продукции.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Стиль</h3>
            <p className="text-gray-600">
              Наши коллекции создаются с учетом последних тенденций моды и
              потребностей наших клиентов.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Сервис</h3>
            <p className="text-gray-600">
              Мы стремимся обеспечить лучший опыт покупок для наших клиентов,
              предлагая профессиональные консультации и поддержку.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 