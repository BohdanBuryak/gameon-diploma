"use client";
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === НОВІ СТАНИ ДЛЯ ФІЛЬТРІВ ===
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    // 1. Завантажуємо категорії
    fetch('http://127.0.0.1:8000/api/v1/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Помилка категорій:", err));

    // 2. Завантажуємо всі товари
    fetch('http://127.0.0.1:8000/api/v1/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Помилка товарів:", err));
  }, []);

  // === ЛОГІКА ФІЛЬТРАЦІЇ ===
  const filteredProducts = products.filter(product => {
    // Чи збігається пошуковий запит із назвою товару (ігноруємо регістр)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Чи збігається категорія (якщо selectedCategory === null, показуємо всі)
    const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;

    // Товар має відповідати обом умовам
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-10">Каталог комплектуючих</h1>

      {/* === ПАНЕЛЬ ФІЛЬТРІВ === */}
      <div className="flex flex-col gap-6 mb-12 bg-white/5 p-6 rounded-3xl border border-white/10">
        
        {/* Пошуковий рядок (тепер на всю ширину зверху) */}
        <div className="w-full">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Шукати процесори, відеокарти..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
            />
          </div>
        </div>

        {/* Кнопки категорій (гарно переносяться на нові рядки знизу) */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            Всі товари
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-3 rounded-xl font-bold transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      
      {/* === ВІДОБРАЖЕННЯ ТОВАРІВ === */}
      {isLoading ? (
        <div className="text-center text-xl text-gray-400 py-20 animate-pulse">Завантаження каталогу...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Екран "Нічого не знайдено" (дуже важливий для UX!) */
        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
          <div className="text-6xl mb-6">🤷‍♂️</div>
          <h3 className="text-2xl font-bold text-white mb-3">За вашим запитом нічого не знайдено</h3>
          <p className="text-gray-400 mb-8">Спробуйте змінити слово для пошуку або обрати іншу категорію.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            Скинути всі фільтри
          </button>
        </div>
      )}
    </main>
  );
}