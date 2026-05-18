"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const defaultImage = "https://placehold.co/600x400/1a1a1a/ffffff?text=Немає+фото";

  // Якщо кошик порожній, показуємо заглушку
  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-lg w-full">
          <span className="text-6xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold mb-4 text-white">Кошик порожній</h1>
          <p className="text-gray-400 mb-8">Час додати кілька потужних комплектуючих для вашої збірки!</p>
          <Link href="/catalog" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-block">
            Перейти в каталог
          </Link>
        </div>
      </main>
    );
  }

  // Якщо товари є, показуємо чек
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Ваше замовлення
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Список товарів (Ліва частина) */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 relative group">
              <div className="h-24 w-24 flex-shrink-0 bg-black/50 rounded-xl overflow-hidden p-2">
                <img src={item.image_url || defaultImage} alt={item.name} className="w-full h-full object-contain" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white line-clamp-1">{item.name}</h3>
                <p className="text-blue-400 font-bold mt-1">{item.price.toLocaleString('uk-UA')} ₴ x {item.quantity}</p>
              </div>

              <div className="text-right mr-4">
                <p className="text-xl font-black text-white">{(item.price * item.quantity).toLocaleString('uk-UA')} ₴</p>
              </div>

              {/* Кнопка видалення (хрестик з'являється при наведенні) */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute -top-3 -right-3 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white h-8 w-8 rounded-full flex items-center justify-center border border-red-500/50 transition-all opacity-0 group-hover:opacity-100"
                title="Видалити з кошика"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm font-medium mt-4 transition inline-block"
          >
            Очистити кошик
          </button>
        </div>

        {/* Підсумок / Чек (Права частина) */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Підсумок</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-300">
              <span>Товарів:</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
            </div>
            
            <div className="flex justify-between items-center mb-8 text-xl font-black text-white">
              <span>До сплати:</span>
              <span className="text-blue-400">{cartTotal.toLocaleString('uk-UA')} ₴</span>
            </div>

            <Link href="/checkout" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-105 text-center block">
                Оформити замовлення
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}