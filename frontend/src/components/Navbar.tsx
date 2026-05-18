"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Додали імпорт кошика

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { cart } = useCart(); // Витягуємо стан кошика

  // Рахуємо загальну кількість товарів (не унікальних, а всіх штук)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.sub); 
        setUserRole(payload.role);
      } catch (error) {
        console.error("Помилка читання токена", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-lg border-b border-white/5 transition-all">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
          GAMEON
        </Link>
        
        <div className="hidden md:flex space-x-10 text-sm font-semibold tracking-wide text-gray-300">
          <Link href="/catalog" className="hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">КАТАЛОГ</Link>
          <Link href="/configurator" className="hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">КОНФІГУРАТОР</Link>
          {/* ЗАМІНИЛИ ПІДТРИМКУ НА ПРО НАС */}
          <Link href="/about" className="hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">ПРО НАС</Link>
        </div>
        
        <div className="flex items-center gap-6">

          {/* ДОДАНО: Іконка кошика */}
          <Link href="/cart" className="relative group flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {/* Кружечок з цифрою, якщо товарів > 0 */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.8)] group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {userEmail ? (
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              {userRole === 'admin' && (
                <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-bold transition bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hover:border-purple-500/50">
                  <span>⚙️</span> Адмінка
                </a>
              )}
              <span className="text-gray-300 text-sm hidden sm:inline border-l border-white/10 pl-4">{userEmail}</span>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-bold transition ml-2">Вийти</button>
            </div>
          ) : (
            <Link href="/login" className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              Увійти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}