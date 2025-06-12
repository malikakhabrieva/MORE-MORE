import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaInstagram, FaVk, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { createIcon } from './js/icons';
import { products, categories } from './js/products';
import { useCartStore } from './store/cart';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import ContactsPage from './pages/ContactsPage';
import AdminPage from './pages/AdminPage';

// Секретная комбинация клавиш для доступа к админке
const ADMIN_KEY_COMBO = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function App() {
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = React.useState([]);

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = [...keySequence, e.key];
      if (newSequence.length > ADMIN_KEY_COMBO.length) {
        newSequence.shift();
      }
      setKeySequence(newSequence);

      // Проверяем, совпадает ли последовательность с секретной комбинацией
      if (newSequence.join(',') === ADMIN_KEY_COMBO.join(',')) {
        sessionStorage.setItem('adminAccess', 'true');
        navigate('/admin');
        setKeySequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence, navigate]);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <nav className="header-content">
            <Link to="/" className="logo">
              MORE&MORE
            </Link>
            <div className="flex items-center gap-8">
              <div className="nav">
                <Link to="/" className="nav-link">
                  Главная
                </Link>
                <Link to="/catalog" className="nav-link">
                  Каталог
                </Link>
                <Link to="/contacts" className="nav-link">
                  Контакты
                </Link>
              </div>
              <div className="header-actions">
                <Link
                  to="/cart"
                  className="relative text-custom-gray hover:text-custom-blue transition-colors"
                >
                  <FaShoppingCart className="text-xl" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-custom-blue text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {items.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content flex flex-col items-center justify-center py-12">
          <div className="footer-info mb-4">
            <p className="font-bold text-center">г.Казань, Баумана, 82 (Свита Холл, 2 этаж)</p>
            <p className="text-center">ежедневно с 10:00-22:00</p>
            <p className="font-bold text-center">г.Казань, Зорге, 57/29</p>
            <p className="text-center">ежедневно с 10:00-21:00</p>
            <p className="font-bold text-center">г.Казань, Чистопольская, 61Д</p>
            <p className="text-center">ежедневно с 10:00-21:00</p>
          </div>
          <div className="footer-social mt-6">
            <div className="social-icons flex gap-6 justify-center">
              <a href="https://www.instagram.com/more_more.kazan?igsh=N2h4aHM4cXJ5djUw" className="social-icon text-custom-white hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
              <a href="https://t.me/more_more_kazan" className="social-icon text-custom-white hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <FaTelegram size={24} />
              </a>
              <a href="https://wa.me/+79968274271" className="social-icon text-custom-white hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Оборачиваем App в Router и useNavigate
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter; 