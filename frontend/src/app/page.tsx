"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [builds, setBuilds] = useState([]);
  const [components, setComponents] = useState([]);

 useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/products/')
      .then((res) => res.json())
      .then((data) => {
        // ID категорії "Готові збірки" (зміни цифру 1 на свою, якщо треба)
        const buildsId = 6; 

        const foundBuilds = data.filter((p: any) => p.category_id === buildsId);
        const foundComponents = data.filter((p: any) => p.category_id !== buildsId);

        setBuilds(foundBuilds.slice(0, 3));      // Беремо перші 3 збірки
        setComponents(foundComponents.slice(0, 3)); // Беремо перші 3 комплектуючі
      })
      .catch((err) => console.error("Помилка завантаження товарів", err));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500">
      
      {/* --- HERO БЛОК --- */}
      <section className="flex flex-col items-center justify-center text-center pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-black">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(29,78,216,0.15)] opacity-50 blur-[80px]"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Твій ідеальний ПК <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            за 5 хвилин
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          Використовуй розумний конфігуратор для підбору комплектуючих або обирай серед наших професійних готових збірок.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/configurator" 
            className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Зібрати комп'ютер
          </Link>
          <Link href="/catalog" 
            className="bg-black/50 backdrop-blur-md border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
            Дивитись каталог
          </Link>
        </div>
      </section>

      {/* --- СЕКЦІЯ ГОТОВИХ ЗБІРОК --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Готові ігрові збірки</h2>
            <p className="text-gray-400">Професійно зібрані та протестовані системи</p>
          </div>
          <Link href="/catalog" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Всі збірки ➔</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {builds.length > 0 ? (
            builds.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <p className="text-gray-500 italic">Наразі немає готових збірок у наявності</p>
            </div>
          )}
        </div>
      </section>

      {/* --- СЕКЦІЯ КОМПЛЕКТУЮЧИХ --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Популярні комплектуючі</h2>
            <p className="text-gray-400">Найкращі пропозиції для вашої власної збірки</p>
          </div>
          <Link href="/catalog" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Весь каталог ➔</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {components.length > 0 ? (
            components.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 italic animate-pulse">Завантаження товарів...</p>
            </div>
          )}
        </div>
      </section>
      
    </main>
  );
}