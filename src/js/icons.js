// Импортируем иконки из react-icons
import { 
    FaShoppingCart, 
    FaUser, 
    FaSearch, 
    FaHeart, 
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaInstagram,
    FaFacebook,
    FaVk,
    FaTelegram
} from 'react-icons/fa';

import {
    MdShoppingBag,
    MdFavorite,
    MdFavoriteBorder,
    MdPerson,
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdAccessTime,
    MdArrowBack,
    MdArrowForward,
    MdClose,
    MdMenu
} from 'react-icons/md';

// Экспортируем все иконки
export const Icons = {
    // Иконки корзины и покупок
    cart: FaShoppingCart,
    shoppingBag: MdShoppingBag,
    
    // Иконки пользователя
    user: FaUser,
    person: MdPerson,
    
    // Иконки поиска
    search: FaSearch,
    
    // Иконки избранного
    heart: FaHeart,
    favorite: MdFavorite,
    favoriteBorder: MdFavoriteBorder,
    
    // Иконки действий
    close: FaTimes,
    
    // Иконки контактов
    phone: FaPhone,
    email: FaEnvelope,
    location: FaMapMarkerAlt,
    time: MdAccessTime,
    
    // Иконки социальных сетей
    instagram: FaInstagram,
    facebook: FaFacebook,
    vk: FaVk,
    telegram: FaTelegram,
    
    // Иконки навигации
    arrowBack: FaChevronLeft,
    arrowForward: FaChevronRight,
    close: MdClose,
    menu: MdMenu
};

// Создаем функцию для создания иконок
export function createIcon(name) {
    const iconMap = {
        search: FaSearch,
        cart: FaShoppingCart,
        user: FaUser,
        heart: FaHeart,
        close: FaTimes,
        arrowBack: FaChevronLeft,
        arrowForward: FaChevronRight,
        phone: FaPhone,
        email: FaEnvelope,
        location: FaMapMarkerAlt,
        instagram: FaInstagram,
        facebook: FaFacebook,
        vk: FaVk,
        telegram: FaTelegram
    };

    const IconComponent = iconMap[name];
    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return document.createElement('span');
    }

    const icon = document.createElement('i');
    icon.className = `icon-${name}`;
    icon.innerHTML = IconComponent();
    return icon;
} 