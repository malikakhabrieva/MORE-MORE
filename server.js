import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/public', express.static('public'));

// Serve static files from the dist directory
app.use(express.static('dist'));

// Catch-all route handler for client-side routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/more-and-more', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
  console.log('Database: more-and-more');
  console.log('Host: localhost');
  console.log('Port: 27017');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Добавляем обработчик ошибок подключения
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/products')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], // Теперь храним пути к файлам
  colors: [{
    name: String,
    code: String,
    sizes: [{
      size: String,
      quantity: Number
    }]
  }],
  sizes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
});

const Message = mongoose.model('Message', messageSchema);

// Routes
// Products
app.get('/api/products', async (req, res) => {
  console.log('GET /api/products - Request received');
  try {
    const { category, search, page = 1, limit = 12, sort } = req.query;
    console.log('Query parameters:', { category, search, page, limit, sort });
    
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const sortOptions = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 }
    };
    
    const products = await Product.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    console.log('Products found:', products.length);
    res.json({
      products,
      totalPages: Math.ceil(await Product.countDocuments(query) / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', upload.array('images'), async (req, res) => {
  try {
    const { name, description, price, category, colors, sizes } = req.body;
    
    // Обработка загруженных файлов
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    // Парсим размеры и цвета
    const parsedSizes = JSON.parse(sizes);
    const parsedColors = JSON.parse(colors);

    // Создаем массив цветов с доступными размерами для каждого цвета
    const colorsWithSizes = parsedColors.map(color => ({
      name: color.name,
      code: color.code,
      sizes: color.sizes.map(size => ({
        size: size.size,
        quantity: parseInt(size.quantity) || 0
      }))
    }));

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      colors: colorsWithSizes,
      sizes: parsedSizes,
      images
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', upload.array('images'), async (req, res) => {
  try {
    const { name, description, price, category, colors, sizes, existingImages } = req.body;
    
    // Получаем текущий товар
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    // Обработка загруженных файлов
    const newImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    
    // Объединяем существующие и новые изображения
    const existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
    const images = [...existingImagesArray, ...newImages];

    // Парсим размеры и цвета
    const parsedSizes = sizes ? JSON.parse(sizes) : currentProduct.sizes;
    const parsedColors = colors ? JSON.parse(colors) : currentProduct.colors;

    // Создаем массив цветов с доступными размерами для каждого цвета
    const colorsWithSizes = parsedColors.map(color => ({
      name: color.name,
      code: color.code,
      sizes: color.sizes.map(size => ({
        size: size.size,
        quantity: parseInt(size.quantity) || 0
      }))
    }));

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        category,
        colors: colorsWithSizes,
        sizes: parsedSizes,
        images,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновление количества товара
app.put('/api/products/:id/quantity', async (req, res) => {
  try {
    const { color, size, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const colorIndex = product.colors.findIndex(c => c.name === color);
    if (colorIndex === -1) {
      return res.status(404).json({ message: 'Цвет не найден' });
    }

    const sizeIndex = product.colors[colorIndex].sizes.findIndex(s => s.size === size);
    if (sizeIndex === -1) {
      return res.status(404).json({ message: 'Размер не найден' });
    }

    const currentQuantity = product.colors[colorIndex].sizes[sizeIndex].quantity;
    if (currentQuantity < quantity) {
      return res.status(400).json({ message: 'Недостаточное количество товара' });
    }

    product.colors[colorIndex].sizes[sizeIndex].quantity -= quantity;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Categories
app.get('/api/categories', async (req, res) => {
  console.log('GET /api/categories - Request received');
  try {
    const categories = await Category.find();
    console.log('Categories found:', categories);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product image
app.get('/api/products/:id/image/:imageIndex', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.images[req.params.imageIndex]) {
      return res.status(404).json({ message: 'Изображение не найдено' });
    }

    const image = product.images[req.params.imageIndex];
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newMessage = new Message({
      name,
      email,
      message
    });

    await newMessage.save();
    console.log('New contact message received:', { name, email });
    
    res.status(201).json({ 
      success: true, 
      message: 'Сообщение успешно отправлено' 
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке сообщения' 
    });
  }
});

// Initialize test data
async function initializeTestData() {
  try {
    // Проверяем, есть ли уже категории в базе
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      // Создаем тестовые категории
      const categories = [
        {
          name: 'Платья',
          slug: 'dresses',
          image: '/assets/images/categories/dresses.jpg',
          description: 'Красивые платья для любого случая'
        },
        {
          name: 'Топы и блузки',
          slug: 'tops',
          image: '/assets/images/categories/tops.jpg',
          description: 'Стильные топы и блузки'
        },
        {
          name: 'Костюмы',
          slug: 'costumes',
          image: '/assets/images/categories/costumes.jpg',
          description: 'Элегантные костюмы'
        },
        {
          name: 'Брюки, юбки, шорты',
          slug: 'bottoms',
          image: '/assets/images/categories/bottoms.jpg',
          description: 'Брюки, юбки и шорты на любой вкус'
        },
        {
          name: 'Обувь',
          slug: 'shoes',
          image: '/assets/images/categories/shoes.jpg',
          description: 'Стильная обувь для любого сезона'
        },
        {
          name: 'Аксессуары',
          slug: 'accessories',
          image: '/assets/images/categories/accessories.jpg',
          description: 'Модные аксессуары для завершения образа'
        }
      ];

      await Category.insertMany(categories);
      console.log('Test categories created');
    }

    // Проверяем, есть ли уже товары в базе
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      // Создаем тестовые товары
      const products = [
        {
          name: 'Платье "Лето"',
          description: 'Легкое летнее платье',
          price: 2999,
          category: 'dresses',
          images: ['/assets/images/products/dress1.jpg'],
          colors: [
            {
              name: 'Белый',
              code: '#FFFFFF',
              sizes: [
                { size: 'S', quantity: 5 },
                { size: 'M', quantity: 3 },
                { size: 'L', quantity: 2 }
              ]
            }
          ]
        },
        {
          name: 'Брюки "Классика"',
          description: 'Классические брюки',
          price: 3999,
          category: 'bottoms',
          images: ['/assets/images/products/pants1.jpg'],
          colors: [
            {
              name: 'Черный',
              code: '#000000',
              sizes: [
                { size: 'M', quantity: 4 },
                { size: 'L', quantity: 3 }
              ]
            }
          ]
        },
        {
          name: 'Туфли "Элегант"',
          description: 'Элегантные туфли на каблуке',
          price: 4999,
          category: 'shoes',
          images: ['/assets/images/products/shoes1.jpg'],
          colors: [
            {
              name: 'Черный',
              code: '#000000',
              sizes: [
                { size: '36', quantity: 3 },
                { size: '37', quantity: 4 },
                { size: '38', quantity: 2 }
              ]
            }
          ]
        },
        {
          name: 'Сумка "Мода"',
          description: 'Стильная сумка через плечо',
          price: 3499,
          category: 'accessories',
          images: ['/assets/images/products/bag1.jpg'],
          colors: [
            {
              name: 'Коричневый',
              code: '#A52A2A',
              sizes: [
                { size: 'ONE', quantity: 5 }
              ]
            }
          ]
        }
      ];

      await Product.insertMany(products);
      console.log('Test products created');
    }
  } catch (error) {
    console.error('Error initializing test data:', error);
  }
}

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await initializeTestData();
});

// Catch-all route handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
}); 