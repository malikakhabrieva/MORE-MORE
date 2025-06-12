import db from './database.js';

class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.adminPanel = document.getElementById('adminPanel');
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkAuth();
        this.renderAdminPanel();
    }

    setupEventListeners() {
        // Обработчики для формы входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Обработчики для управления товарами
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', this.handleAddProduct.bind(this));
        }

        // Обработчики для кнопок действий
        document.addEventListener('click', (e) => {
            if (e.target.matches('.edit-product')) {
                this.handleEditProduct(e);
            } else if (e.target.matches('.delete-product')) {
                this.handleDeleteProduct(e);
            } else if (e.target.matches('.logout-btn')) {
                this.handleLogout();
            }
        });
    }

    async checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            try {
                // В реальном приложении здесь должна быть проверка токена на сервере
                this.isAuthenticated = true;
                this.currentUser = JSON.parse(localStorage.getItem('adminUser'));
                this.showAdminPanel();
            } catch (error) {
                console.error('Ошибка аутентификации:', error);
                this.handleLogout();
            }
        } else {
            this.showLoginForm();
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const user = await db.getUser(username);
            if (user && user.password === password) { // В реальном приложении пароль должен быть хэширован
                this.isAuthenticated = true;
                this.currentUser = user;
                localStorage.setItem('adminToken', 'dummy-token'); // В реальном приложении должен быть JWT
                localStorage.setItem('adminUser', JSON.stringify(user));
                this.showAdminPanel();
            } else {
                alert('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Произошла ошибка при входе');
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        this.showLoginForm();
    }

    showLoginForm() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const products = await db.getAllProducts();
            this.renderProducts(products);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            alert('Ошибка загрузки товаров');
        }
    }

    async handleAddProduct(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const product = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            sizes: formData.get('sizes').split(',').map(size => size.trim()),
            colors: formData.get('colors').split(',').map(color => color.trim()),
            image: formData.get('image'),
            inStock: formData.get('inStock') === 'true'
        };

        try {
            await db.addProduct(product);
            event.target.reset();
            this.loadProducts();
            alert('Товар успешно добавлен');
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            alert('Ошибка добавления товара');
        }
    }

    async handleEditProduct(event) {
        const productId = event.target.dataset.id;
        try {
            const product = await db.getProduct(parseInt(productId));
            if (product) {
                this.showEditForm(product);
            }
        } catch (error) {
            console.error('Ошибка получения товара:', error);
            alert('Ошибка получения товара');
        }
    }

    async handleDeleteProduct(event) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            const productId = event.target.dataset.id;
            try {
                await db.deleteProduct(parseInt(productId));
                this.loadProducts();
                alert('Товар успешно удален');
            } catch (error) {
                console.error('Ошибка удаления товара:', error);
                alert('Ошибка удаления товара');
            }
        }
    }

    showEditForm(product) {
        const form = document.getElementById('editProductForm');
        form.style.display = 'block';
        
        // Заполняем форму данными товара
        form.querySelector('[name="name"]').value = product.name;
        form.querySelector('[name="category"]').value = product.category;
        form.querySelector('[name="price"]').value = product.price;
        form.querySelector('[name="description"]').value = product.description;
        form.querySelector('[name="sizes"]').value = product.sizes.join(', ');
        form.querySelector('[name="colors"]').value = product.colors.join(', ');
        form.querySelector('[name="inStock"]').value = product.inStock;
        
        // Сохраняем ID товара для обновления
        form.dataset.productId = product.id;
    }

    renderProducts(products) {
        const container = document.getElementById('productsList');
        container.innerHTML = products.map(product => `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Цена: ${product.price} ₽</p>
                <p>Категория: ${product.category}</p>
                <p>Размеры: ${product.sizes.join(', ')}</p>
                <p>Цвета: ${product.colors.join(', ')}</p>
                <p>В наличии: ${product.inStock ? 'Да' : 'Нет'}</p>
                <div class="product-actions">
                    <button class="edit-product" data-id="${product.id}">Редактировать</button>
                    <button class="delete-product" data-id="${product.id}">Удалить</button>
                </div>
            </div>
        `).join('');
    }

    renderAdminPanel() {
        this.adminPanel.innerHTML = `
            <div class="admin-panel__container">
                ${!this.isAuthenticated ? this.renderLoginForm() : this.renderAdminContent()}
            </div>
        `;
    }

    renderLoginForm() {
        return `
            <div class="admin-login">
                <h2>Вход в админ-панель</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Логин</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="button">Войти</button>
                </form>
            </div>
        `;
    }

    renderAdminContent() {
        return `
            <div class="admin-content">
                <div class="admin-header">
                    <h2>Управление товарами</h2>
                    <button class="button" id="addProductBtn">Добавить товар</button>
                    <button class="button" id="logoutBtn">Выйти</button>
                </div>
                <div class="admin-products">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Изображение</th>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            ${this.renderProductsTable()}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal" id="productModal">
                <div class="modal__content">
                    <div class="modal__header">
                        <h3 id="modalTitle">Добавить товар</h3>
                        <button class="modal__close">&times;</button>
                    </div>
                    <form id="productForm">
                        <div class="form-group">
                            <label for="productName">Название</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label for="productCategory">Категория</label>
                            <input type="text" id="productCategory" required>
                        </div>
                        <div class="form-group">
                            <label for="productPrice">Цена</label>
                            <input type="number" id="productPrice" required>
                        </div>
                        <div class="form-group">
                            <label for="productSizes">Размеры (через запятую)</label>
                            <input type="text" id="productSizes" required>
                        </div>
                        <div class="form-group">
                            <label for="productColors">Цвета (через запятую)</label>
                            <input type="text" id="productColors" required>
                        </div>
                        <div class="form-group">
                            <label for="productImage">Изображение</label>
                            <input type="file" id="productImage" accept="image/*" required>
                        </div>
                        <div class="form-group">
                            <label for="productDescription">Описание</label>
                            <textarea id="productDescription" required></textarea>
                        </div>
                        <button type="submit" class="button">Сохранить</button>
                    </form>
                </div>
            </div>
        `;
    }

    renderProductsTable() {
        return this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price} ₽</td>
                <td>
                    <button class="button edit-product" data-id="${product.id}">Редактировать</button>
                    <button class="button delete-product" data-id="${product.id}">Удалить</button>
                </td>
            </tr>
        `).join('');
    }
}

// Инициализация админ-панели при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
}); 