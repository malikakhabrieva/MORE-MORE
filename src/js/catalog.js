class Catalog {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.productsPerPage = 12;
        
        // DOM Elements
        this.productsGrid = document.getElementById('productsGrid');
        this.productsCount = document.getElementById('productsCount');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.colorCheckboxes = document.querySelectorAll('.color-checkbox input');
        this.priceRange = document.getElementById('priceRange');
        this.minPrice = document.getElementById('minPrice');
        this.maxPrice = document.getElementById('maxPrice');
        this.sortSelect = document.getElementById('sortSelect');
        this.applyFiltersBtn = document.getElementById('applyFilters');
        this.resetFiltersBtn = document.getElementById('resetFilters');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.paginationNumbers = document.getElementById('paginationNumbers');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProducts();
        this.updatePagination();
    }

    bindEvents() {
        // Filter events
        this.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        
        // Sort event
        this.sortSelect.addEventListener('change', () => {
            this.sortProducts();
            this.renderProducts();
        });
        
        // Pagination events
        this.prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        
        // Price range events
        this.priceRange.addEventListener('input', (e) => {
            this.maxPrice.value = e.target.value;
        });
        
        this.minPrice.addEventListener('change', () => {
            if (parseInt(this.minPrice.value) > parseInt(this.maxPrice.value)) {
                this.minPrice.value = this.maxPrice.value;
            }
        });
        
        this.maxPrice.addEventListener('change', () => {
            if (parseInt(this.maxPrice.value) < parseInt(this.minPrice.value)) {
                this.maxPrice.value = this.minPrice.value;
            }
            this.priceRange.value = this.maxPrice.value;
        });
    }

    applyFilters() {
        const category = this.categoryFilter.value;
        const selectedColors = Array.from(this.colorCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const minPrice = parseInt(this.minPrice.value) || 0;
        const maxPrice = parseInt(this.maxPrice.value) || 20000;

        this.filteredProducts = this.products.filter(product => {
            const categoryMatch = !category || product.category === category;
            const colorMatch = selectedColors.length === 0 || 
                product.colors.some(color => selectedColors.includes(color));
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;

            return categoryMatch && colorMatch && priceMatch;
        });

        this.currentPage = 1;
        this.sortProducts();
        this.renderProducts();
        this.updatePagination();
    }

    resetFilters() {
        this.categoryFilter.value = '';
        this.colorCheckboxes.forEach(checkbox => checkbox.checked = false);
        this.minPrice.value = '';
        this.maxPrice.value = '';
        this.priceRange.value = 20000;
        this.sortSelect.value = 'default';
        
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();
        this.updatePagination();
    }

    sortProducts() {
        const sortValue = this.sortSelect.value;
        
        switch (sortValue) {
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                this.filteredProducts.sort((a, b) => a.id - b.id);
        }
    }

    renderProducts() {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        this.productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card__content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} ₽</p>
                    <button class="button add-to-cart" data-id="${product.id}">В корзину</button>
                </div>
            </div>
        `).join('');

        this.productsCount.textContent = this.filteredProducts.length;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        // Update pagination buttons
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
        
        // Generate page numbers
        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)
            ) {
                paginationHTML += `
                    <button class="${i === this.currentPage ? 'active' : ''}" 
                            onclick="catalog.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (
                i === this.currentPage - 3 || 
                i === this.currentPage + 3
            ) {
                paginationHTML += '<span>...</span>';
            }
        }
        
        this.paginationNumbers.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            this.updatePagination();
            
            // Scroll to top of products grid
            this.productsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize catalog
const catalog = new Catalog(); 