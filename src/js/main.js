import { createIcon } from './icons.js';
import { products, categories } from './products.js';
import cart from './cart.js';

// Product data structure
const products = [
    {
        id: 1,
        name: "Платье кружевное",
        category: "Платья",
        price: 5990,
        sizes: ["S", "M", "L"],
        colors: ["белый", "черный"],
        image: "assets/images/products/dress1.jpg",
        description: "Элегантное кружевное платье для особых случаев"
    },
    // Add more products here
];

// DOM Elements
const burgerButton = document.getElementById('burgerButton');
const nav = document.querySelector('.header__nav');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const modalClose = document.querySelector('.modal__close');
const productsGrid = document.querySelector('.products__grid');

// Mobile Menu Toggle
burgerButton.addEventListener('click', () => {
    nav.classList.toggle('active');
    burgerButton.classList.toggle('active');
});

// Cart Modal Toggle
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

modalClose.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Banner Slider
class Slider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.banner__slide');
        this.prevBtn = document.querySelector('.banner__prev');
        this.nextBtn = document.querySelector('.banner__next');
        
        this.init();
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.showSlide(this.currentSlide);
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[index].classList.add('active');
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
}

// Product Grid
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-card__image">
                <img src="${product.image}" alt="${product.name}">
                <button class="product-card__favorite">
                    <i class="icon-heart"></i>
                </button>
            </div>
            <div class="product-card__content">
                <h3>${product.name}</h3>
                <p class="product-card__price">${product.price} ₽</p>
                <div class="product-card__colors">
                    ${product.colors.map(color => `
                        <span class="color-dot" style="background-color: ${color.toLowerCase()}"></span>
                    `).join('')}
                </div>
                <button class="button add-to-cart" data-id="${product.id}">
                    <i class="icon-cart"></i>
                    В корзину
                </button>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики событий для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.addItem(product);
            }
        });
    });

    // Инициализируем иконки в карточках товаров
    document.querySelectorAll('.product-card__favorite i').forEach(icon => {
        icon.replaceWith(createIcon('heart'));
    });

    document.querySelectorAll('.add-to-cart i').forEach(icon => {
        icon.replaceWith(createIcon('cart'));
    });
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// Инициализация иконок
function initializeIcons() {
    // Иконки в шапке
    document.querySelector('.search-btn i').replaceWith(createIcon('search'));
    document.querySelector('.cart-btn i').replaceWith(createIcon('cart'));
    document.querySelector('.user-btn i').replaceWith(createIcon('user'));

    // Иконки в баннере
    document.querySelector('.banner__prev i').replaceWith(createIcon('arrowBack'));
    document.querySelector('.banner__next i').replaceWith(createIcon('arrowForward'));

    // Иконки в корзине
    document.querySelector('.modal__close i').replaceWith(createIcon('close'));

    // Иконки в футере
    document.querySelectorAll('.footer__column i').forEach(icon => {
        const iconName = icon.className.split('-')[1];
        icon.replaceWith(createIcon(iconName));
    });

    // Иконки социальных сетей
    document.querySelectorAll('.social-link i').forEach(icon => {
        const iconName = icon.className.split('-')[1];
        icon.replaceWith(createIcon(iconName));
    });
}

// Рендеринг категорий
function renderCategories() {
    const categoriesGrid = document.querySelector('.categories__grid');
    categoriesGrid.innerHTML = categories.map(category => `
        <a href="/catalog?category=${category.name.toLowerCase()}" class="category-card">
            <img src="${category.image}" alt="${category.name}">
            <h3>${category.name}</h3>
        </a>
    `).join('');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeIcons();
    renderCategories();
    renderProducts();
    new Slider();
}); 