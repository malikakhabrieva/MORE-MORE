import React from 'react';
import { FaInstagram, FaVk, FaTelegram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Контакты</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Контактная информация */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Наши магазины</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Центральный магазин</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-600 text-xl" />
                  <span>г. Казань, ул. Баумана, 82</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-600 text-xl" />
                  <span>+7 (999) 123-45-67</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Магазин на Зорге</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-600 text-xl" />
                  <span>г. Казань, ул. Зорге, 57/29</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-600 text-xl" />
                  <span>+7 (999) 123-45-68</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Магазин на Чистопольской</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-600 text-xl" />
                  <span>г. Казань, ул. Чистопольская, 61д</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-600 text-xl" />
                  <span>+7 (999) 123-45-69</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-600 text-xl" />
                <span>info@more-and-more.ru</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaClock className="text-gray-600 text-xl" />
                <span>Ежедневно: 10:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Социальные сети */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Мы в социальных сетях</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://vk.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaVk className="text-2xl" />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaTelegram className="text-2xl" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer"
                 className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[450px]">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A166d54737670fd369150747afdd191aff1bce72f464011ac49218840fb7b7feb&amp;source=constructor&amp;width=100%25&amp;height=450&amp;lang=ru_RU&amp;scroll=true"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Карта"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactsPage; 