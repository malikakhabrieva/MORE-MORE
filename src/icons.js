import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiChevronLeft, 
  FiChevronRight,
  FiX,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
  FiPlus,
  FiMinus
} from 'react-icons/fi';

const iconMap = {
  'search-icon': FiSearch,
  'cart-icon': FiShoppingCart,
  'user-icon': FiUser,
  'prev-icon': FiChevronLeft,
  'next-icon': FiChevronRight,
  'close-icon': FiX,
  'instagram-icon': FiInstagram,
  'facebook-icon': FiFacebook,
  'vk-icon': FiTwitter,
  'telegram-icon': FiMail,
  'phone-icon': FiPhone,
  'location-icon': FiMapPin,
  'heart-icon': FiHeart,
  'plus-icon': FiPlus,
  'minus-icon': FiMinus
};

export const createIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }
  
  const icon = document.createElement('span');
  icon.className = `icon ${iconName}`;
  const root = document.createElement('div');
  icon.appendChild(root);
  
  // Используем React для рендеринга иконки
  const ReactDOM = require('react-dom/client');
  const rootElement = ReactDOM.createRoot(root);
  rootElement.render(React.createElement(IconComponent));
  
  return icon;
}; 