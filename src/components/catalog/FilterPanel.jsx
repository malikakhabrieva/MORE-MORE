import React from 'react';

function FilterPanel({ categories, selectedCategory, onCategoryChange, onSortChange, currentSort }) {
  return (
    <div className="filter-panel">
      {/* Категории */}
      <div className="filter-group">
        <h3>Категории</h3>
        <div className="space-y-2">
          <button
            className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            Все товары
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              className={`filter-option ${selectedCategory === category.slug ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Сортировка */}
      <div className="filter-group">
        <h3>Сортировка</h3>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-custom-blue rounded-lg focus:outline-none focus:border-custom-gray"
        >
          <option value="default">По умолчанию</option>
          <option value="price-asc">По возрастанию цены</option>
          <option value="price-desc">По убыванию цены</option>
          <option value="name-asc">По названию (А-Я)</option>
          <option value="name-desc">По названию (Я-А)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterPanel; 