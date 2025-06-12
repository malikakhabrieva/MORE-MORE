import db from './database.js';

async function initializeDatabase() {
    try {
        // Создаем тестового администратора
        const admin = {
            username: 'admin',
            password: 'admin123', // В реальном приложении пароль должен быть хэширован
            role: 'admin',
            email: 'admin@example.com'
        };

        await db.addUser(admin);

        // Создаем тестовые товары
        const products = [
            {
                name: 'Платье летнее',
                category: 'Платья',
                price: 2999,
                description: 'Легкое летнее платье из хлопка',
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: ['Белый', 'Черный', 'Красный'],
                image: 'assets/images/products/dress1.jpg',
                inStock: true
            },
            {
                name: 'Джинсы классические',
                category: 'Джинсы',
                price: 3999,
                description: 'Классические джинсы прямого кроя',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Синий', 'Черный'],
                image: 'assets/images/products/jeans1.jpg',
                inStock: true
            },
            {
                name: 'Блузка шелковая',
                category: 'Блузки',
                price: 2499,
                description: 'Элегантная шелковая блузка',
                sizes: ['XS', 'S', 'M', 'L'],
                colors: ['Белый', 'Бежевый', 'Розовый'],
                image: 'assets/images/products/blouse1.jpg',
                inStock: true
            }
        ];

        for (const product of products) {
            await db.addProduct(product);
        }

        console.log('База данных успешно инициализирована');
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error);
    }
}

// Инициализируем базу данных при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeDatabase); 