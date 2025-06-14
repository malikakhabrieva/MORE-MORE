import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';

const PREDEFINED_COLORS = [
  { name: 'Черный', code: '#000000' },
  { name: 'Белый', code: '#FFFFFF' },
  { name: 'Красный', code: '#FF0000' },
  { name: 'Синий', code: '#0000FF' },
  { name: 'Зеленый', code: '#008000' },
  { name: 'Желтый', code: '#FFFF00' },
  { name: 'Розовый', code: '#FFC0CB' },
  { name: 'Фиолетовый', code: '#800080' },
  { name: 'Оранжевый', code: '#FFA500' },
  { name: 'Серый', code: '#808080' },
  { name: 'Бежевый', code: '#F5F5DC' },
  { name: 'Коричневый', code: '#A52A2A' }
];

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41'];

function ProductForm({ product, onSubmit, onCancel, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    colors: [],
    sizes: [],
    images: []
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Получаем доступные размеры в зависимости от категории
  const getAvailableSizes = () => {
    return formData.category === 'shoes' ? SHOE_SIZES : CLOTHING_SIZES;
  };

  useEffect(() => {
    // Если передан существующий товар, заполняем форму его данными
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        images: product.images || []
      });
      setSelectedColors(product.colors ? product.colors.map(c => c.name) : []);
      setSelectedSizes(product.sizes || []);
    }
  }, [product]);

  // Сбрасываем выбранные размеры при изменении категории только для новых товаров
  useEffect(() => {
    if (!product) { // Только для новых товаров
      setSelectedSizes([]);
      setFormData(prev => ({
        ...prev,
        sizes: [],
        colors: prev.colors.map(color => ({
          ...color,
          sizes: []
        }))
      }));
    }
  }, [formData.category, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (colorName) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName];
      
      // Обновляем formData.colors
      const colorsData = newColors.map(name => {
        const colorInfo = PREDEFINED_COLORS.find(c => c.name === name);
        const existingColor = formData.colors.find(c => c.name === name);
        
        if (existingColor) {
          // Сохраняем существующие размеры и количества
          return {
            ...existingColor,
            sizes: existingColor.sizes || []
          };
        }
        
        // Для нового цвета создаем размеры с количеством 0
        return {
          name,
          code: colorInfo ? colorInfo.code : '#000000',
          sizes: selectedSizes.map(size => ({
            size,
            quantity: 0
          }))
        };
      });
      
      setFormData(prev => ({
        ...prev,
        colors: colorsData
      }));
      
      return newColors;
    });
  };

  const handleQuantityChange = (colorName, size, quantity) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map(color => {
        if (color.name === colorName) {
          return {
            ...color,
            sizes: color.sizes.map(s => {
              if (s.size === size) {
                return { ...s, quantity: parseInt(quantity) || 0 };
              }
              return s;
            })
          };
        }
        return color;
      })
    }));
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      // Обновляем formData.sizes и formData.colors
      setFormData(prev => ({
        ...prev,
        sizes: newSizes,
        colors: prev.colors.map(color => {
          const existingColor = prev.colors.find(c => c.name === color.name);
          if (existingColor) {
            // Сохраняем существующие размеры и количества
            const existingSizes = existingColor.sizes || [];
            const newSizesWithQuantities = newSizes.map(newSize => {
              const existingSize = existingSizes.find(s => s.size === newSize);
              return {
                size: newSize,
                quantity: existingSize ? existingSize.quantity : 0
              };
            });
            return {
              ...existingColor,
              sizes: newSizesWithQuantities
            };
          }
          // Для нового цвета создаем размеры с количеством 0
          return {
            ...color,
            sizes: newSizes.map(newSize => ({
              size: newSize,
              quantity: 0
            }))
          };
        })
      }));
      
      return newSizes;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Добавляем основные поля
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    
    // Добавляем изображения
    const existingImages = [];
    formData.images.forEach((image, index) => {
      if (image instanceof File) {
        formDataToSend.append('images', image);
      } else if (typeof image === 'string') {
        // Если это строка (путь к существующему изображению), добавляем в массив
        existingImages.push(image);
      }
    });
    
    // Добавляем существующие изображения как JSON
    if (existingImages.length > 0) {
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
    }
    
    // Добавляем цвета и размеры как объекты
    const colorsData = formData.colors.map(color => ({
      name: color.name,
      code: color.code,
      sizes: color.sizes.map(size => ({
        size: size.size,
        quantity: parseInt(size.quantity) || 0
      }))
    }));

    formDataToSend.append('colors', JSON.stringify(colorsData));
    formDataToSend.append('sizes', JSON.stringify(selectedSizes));
    
    onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Название</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цена</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map(category => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цвета</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {PREDEFINED_COLORS.map(color => (
            <label key={color.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColors.includes(color.name)}
                onChange={() => handleColorChange(color.name)}
                className="rounded border-gray-300 text-custom-blue focus:ring-custom-blue"
              />
              <span>{color.name}</span>
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.code }}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Размеры</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {getAvailableSizes().map(size => (
            <label key={size} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="rounded border-gray-300 text-custom-blue focus:ring-custom-blue"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цвета и размеры</label>
        <div className="mt-2 space-y-4">
          {selectedColors.map(colorName => (
            <div key={colorName} className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">{colorName}</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedSizes.map(size => {
                  const color = formData.colors.find(c => c.name === colorName);
                  const sizeData = color?.sizes.find(s => s.size === size);
                  return (
                    <div key={size} className="flex items-center space-x-2">
                      <label className="w-16">{size}:</label>
                      <input
                        type="number"
                        min="0"
                        value={sizeData?.quantity || 0}
                        onChange={(e) => handleQuantityChange(colorName, size, e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Изображения</label>
        <div className="mt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-custom-blue file:text-white
              hover:file:bg-blue-600"
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-600"
        >
          {product ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm; 