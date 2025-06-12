import { createIcon } from './icons.js';

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.modal = document.getElementById('cartModal');
        this.itemsContainer = this.modal.querySelector('.cart-items');
        this.totalElement = this.modal.querySelector('.cart-total span');
        this.countElement = document.querySelector('.cart-count');
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Закрытие корзины
        this.modal.querySelector('.modal__close').addEventListener('click', () => {
            this.modal.classList.remove('active');
        });

        // Закрытие по клику вне корзины
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove('active');
            }
        });

        // Оформление заказа
        this.modal.querySelector('.checkout-btn').addEventListener('click', () => {
            this.checkout();
        });

        // Открытие корзины
        document.querySelector('.cart-btn').addEventListener('click', () => {
            this.modal.classList.add('active');
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.save();
        this.render();
        this.showNotification('Товар добавлен в корзину');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.render();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.save();
                this.render();
            }
        }
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCount();
    }

    updateCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.countElement.textContent = count;
    }

    render() {
        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
            this.totalElement.textContent = '0 ₽';
            return;
        }

        this.itemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                <div class="cart-item__content">
                    <h3>${item.name}</h3>
                    <p class="cart-item__price">${item.price} ₽</p>
                    <div class="cart-item__quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">
                            <i class="icon-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">
                            <i class="icon-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item__remove" data-id="${item.id}">
                    <i class="icon-close"></i>
                </button>
            </div>
        `).join('');

        // Добавляем обработчики событий для кнопок
        this.itemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.quantity-btn').dataset.id);
                const isPlus = e.target.closest('.quantity-btn').classList.contains('plus');
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + (isPlus ? 1 : -1));
                }
            });
        });

        this.itemsContainer.querySelectorAll('.cart-item__remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.cart-item__remove').dataset.id);
                this.removeItem(id);
            });
        });

        // Обновляем общую сумму
        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.totalElement.textContent = `${total} ₽`;

        // Инициализируем иконки
        this.initializeIcons();
    }

    initializeIcons() {
        this.itemsContainer.querySelectorAll('.cart-item__remove i').forEach(icon => {
            icon.replaceWith(createIcon('close'));
        });

        this.itemsContainer.querySelectorAll('.quantity-btn i').forEach(icon => {
            const isPlus = icon.closest('.quantity-btn').classList.contains('plus');
            icon.replaceWith(createIcon(isPlus ? 'plus' : 'minus'));
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Корзина пуста');
            return;
        }

        // Здесь будет логика оформления заказа
        this.showNotification('Заказ оформлен');
        this.items = [];
        this.save();
        this.render();
        this.modal.classList.remove('active');
    }
}

export default new Cart(); 