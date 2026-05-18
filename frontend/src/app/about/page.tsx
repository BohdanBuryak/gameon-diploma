import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
        Про компанію <span className="text-blue-500">GameOn</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Блок: Хто ми */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-blue-500/30 transition-all duration-300">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Хто ми такі?</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            GameOn — це спеціалізований інтернет-магазин комп'ютерної техніки та ентузіастського "заліза". Ми не просто продаємо коробки з деталями, ми допомагаємо геймерам, дизайнерам та професіоналам збирати безкомпромісні системи їхньої мрії.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Наша філософія — зробити вибір комплектуючих прозорим та зручним. Ми ретельно перевіряємо асортимент, щоб ви отримували лише топову продукцію від надійних світових брендів.
          </p>
        </div>

        {/* Блок: Гарантія */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-green-500/30 transition-all duration-300">
          <div className="text-5xl mb-6">🛡️</div>
          <h2 className="text-2xl font-bold mb-4">Гарантія та повернення</h2>
          <ul className="space-y-4 text-gray-400">
            <li className="flex gap-3 items-start">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Офіційна гарантія від виробника (від 12 до 36 місяців) на всі процесори, відеокарти та інші компоненти.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Безпроблемний обмін та повернення товару протягом 14 днів згідно із Законом України "Про захист прав споживачів".</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span>Кожна деталь перед відправкою проходить базовий візуальний контроль на відсутність пошкоджень.</span>
            </li>
          </ul>
        </div>

        {/* Блок: Доставка і оплата (на всю ширину) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10 md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Доставка і оплата</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">📦</span> Доставка
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ми відправляємо замовлення щодня о 16:00. Співпрацюємо з <strong>"Новою Поштою"</strong>. Можлива доставка у відділення, поштомат або кур'єром до ваших дверей. Зазвичай замовлення приїжджає на наступний день.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">💳</span> Оплата
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ви можете оплатити замовлення безпечно <strong>карткою онлайн</strong> на сайті під час оформлення, або обрати варіант <strong>"післяплата"</strong> і розрахуватися готівкою/карткою вже при отриманні та огляді товару на пошті.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12 text-center">
        <Link href="/catalog" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          Перейти до каталогу
        </Link>
      </div>

    </main>
  );
}