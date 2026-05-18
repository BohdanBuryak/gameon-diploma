"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const defaultImage = "https://placehold.co/600x400/1a1a1a/ffffff?text=Немає+фото";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Зупиняємо перехід по посиланню при кліку на кнопку
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full shadow-lg relative">
      
      {/* КЛІКАБЕЛЬНА ЧАСТИНА (ВЕДЕ НА СТОРІНКУ ТОВАРУ) */}
      <Link href={`/product/${product.id}`} className="flex flex-col flex-1 cursor-pointer">
        <div className="h-48 overflow-hidden relative bg-black/50">
          <img 
            src={product.image_url || defaultImage} 
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6 pb-2 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2 text-white line-clamp-2 group-hover:text-blue-400 transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {product.stock > 0 ? (
              <span className="text-green-400">В наявності: {product.stock} шт.</span>
            ) : (
              <span className="text-red-400">Немає в наявності</span>
            )}
          </p>
        </div>
      </Link>

      {/* НИЖНЯ ЧАСТИНА З ЦІНОЮ ТА КНОПКОЮ (НЕ ПЕРЕКИДАЄ) */}
      <div className="px-6 pb-6 pt-4 mt-auto flex justify-between items-center border-t border-white/10">
        <span className="text-2xl font-black text-blue-400">{product.price.toLocaleString('uk-UA')} ₴</span>
        
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`p-3 rounded-xl transition-all shadow-lg flex items-center justify-center min-w-[48px] relative z-10
            ${isAdded 
              ? 'bg-green-500 hover:bg-green-400 shadow-green-500/50' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'} 
            disabled:bg-gray-600 disabled:shadow-none`}
        >
          {isAdded ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}