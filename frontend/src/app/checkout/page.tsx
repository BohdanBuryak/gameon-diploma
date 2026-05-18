"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Стан для форми
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    department: '',
    payment: 'card'
  });

  // Якщо кошик порожній і ми не на сторінці успіху, повертаємо в каталог
  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      router.push('/catalog');
    }
  }, [cart, isSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Формуємо об'єкт так, як очікує наш бекенд (схема OrderCreate)
    const orderPayload = {
      customer_name: formData.fullName,
      phone: formData.phone,
      address: `${formData.city}, ${formData.department}`, // Склеюємо адресу
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      // Відправляємо реальний запит на бекенд
      const res = await fetch('http://127.0.0.1:8000/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Не вдалося створити замовлення");
      
      const data = await res.json();
      console.log("Успіх! Номер замовлення:", data.order_id);

      setIsSuccess(true);
      clearCart(); // Очищаємо кошик тільки після успішного збереження в базі
    } catch (error: any) {
      console.error("Помилка:", error);
      setErrorMsg("Сталася помилка при оформленні замовлення. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ЕКРАН УСПІХУ
  if (isSuccess) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-500/20 blur-[100px] pointer-events-none"></div>
          <div className="text-7xl mb-6">✅</div>
          <h1 className="text-3xl font-extrabold mb-4 text-white">Замовлення прийнято!</h1>
          <p className="text-gray-400 mb-8">
            Дякуємо за покупку. Наш менеджер скоро зв'яжеться з вами для підтвердження деталей доставки.
          </p>
          <Link href="/catalog" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-block relative z-10">
            Повернутися до покупок
          </Link>
        </div>
      </main>
    );
  }

  // ЕКРАН ФОРМИ
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-white">Оформлення замовлення</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ЛІВА ЧАСТИНА: Форма */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Контактні дані</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ім'я та прізвище</label>
                <input type="text" required placeholder="Богдан Буряк" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Телефон</label>
                <input type="tel" required placeholder="+38 (099) 000-00-00" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <h2 className="text-xl font-bold border-b border-white/10 pb-4 pt-4">Доставка (Нова Пошта)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Місто</label>
                <input type="text" required placeholder="Київ" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600" onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Відділення</label>
                <input type="text" required placeholder="Відділення №1" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600" onChange={(e) => setFormData({...formData, department: e.target.value})} />
              </div>
            </div>

            <h2 className="text-xl font-bold border-b border-white/10 pb-4 pt-4">Оплата</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="card" defaultChecked className="w-5 h-5 accent-blue-500" onChange={(e) => setFormData({...formData, payment: e.target.value})} />
                <span className="text-white">Карткою онлайн</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer ml-6">
                <input type="radio" name="payment" value="cash" className="w-5 h-5 accent-blue-500" onChange={(e) => setFormData({...formData, payment: e.target.value})} />
                <span className="text-white">При отриманні</span>
              </label>
            </div>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mt-4">
                {errorMsg}
              </div>
            )}

          </form>
        </div>

        {/* ПРАВА ЧАСТИНА: Ваш чек */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Ваше замовлення</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4 text-sm">
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <img src={item.image_url || "https://placehold.co/100"} alt="" className="w-10 h-10 object-contain bg-black/50 rounded-md" />
                    <span className="text-gray-300 truncate">{item.name} <span className="text-gray-500 text-xs">x{item.quantity}</span></span>
                  </div>
                  <span className="font-bold text-white">{(item.price * item.quantity).toLocaleString('uk-UA')} ₴</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-8 text-xl font-black text-white border-t border-white/10 pt-4">
              <span>До сплати:</span>
              <span className="text-blue-400">{cartTotal.toLocaleString('uk-UA')} ₴</span>
            </div>

            {/* Кнопка з анімацією завантаження */}
            <button 
              onClick={(e) => {
                // Тригеримо сабміт форми
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex justify-center items-center gap-2 disabled:bg-gray-600 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Обробка...
                </>
              ) : (
                "Підтвердити замовлення"
              )}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}