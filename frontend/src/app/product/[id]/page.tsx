"use client";
import { useEffect, useState, use } from 'react'; // Додали use
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Розпаковуємо параметри (це новий стандарт Next.js)
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultImage = "https://placehold.co/800x600/1a1a1a/ffffff?text=Немає+фото";

  useEffect(() => {
    if (!productId) return;

    console.log(`Завантаження товару з ID: ${productId}`);

    async function fetchData() {
      try {
        // 1. Отримуємо дані конкретного товару
        const res = await fetch(`http://127.0.0.1:8000/api/v1/products/${productId}`);
        
        if (!res.ok) {
          throw new Error(`Бекенд повернув помилку: ${res.status}`);
        }

        const data = await res.json();
        console.log("Дані товару отримано:", data);
        setProduct(data);

        // 2. Отримуємо схожі товари
        const allRes = await fetch('http://127.0.0.1:8000/api/v1/products/');
        if (allRes.ok) {
          const allProducts = await allRes.json();
          const similar = allProducts.filter(
            (p: any) => p.category_id === data.category_id && p.id !== data.id
          );
          setSimilarProducts(similar.slice(0, 4));
        }
      } catch (err: any) {
        console.error("Помилка завантаження:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  if (isLoading) {
    return <main className="min-h-screen pt-40 pb-20 px-6 text-center text-xl text-gray-400">Завантаження товару...</main>;
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-40 pb-20 px-6 text-center">
        <h1 className="text-2xl text-red-400 mb-4">Сталася помилка</h1>
        <p className="text-gray-500">{error || "Товар не знайдено в базі даних"}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 mb-20 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 flex items-center justify-center bg-black/50 rounded-2xl p-8 border border-white/5">
          <img 
            src={product.image_url || defaultImage} 
            alt={product.name} 
            className="w-full max-h-[500px] object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 w-max">
            Артикул: {product.id}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {product.name}
          </h1>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-300 mb-2 border-b border-white/10 pb-2">Опис:</h3>
            <p className="text-gray-400 whitespace-pre-wrap">{product.description || "Опис відсутній"}</p>
          </div>
          <div className="flex items-end gap-6 mb-8">
            <span className="text-5xl font-black text-blue-400">{(product.price || 0).toLocaleString('uk-UA')} ₴</span>
            <span className={`text-sm font-bold mb-2 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `В наявності (${product.stock} шт)` : 'Немає в наявності'}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isAdded ? 'bg-green-500' : 'bg-blue-600'}`}
          >
            {isAdded ? "✅ Додано" : "🛒 Додати в кошик"}
          </button>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Схожі товари</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}