"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ConfiguratorPage() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse(''); // Очищаємо попередню відповідь

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Помилка мережі');
      
      const data = await res.json();
      setAiResponse(data.recommendation);
    } catch (error) {
      console.error("Помилка:", error);
      setAiResponse("Вибачте, виникла помилка при зв'язку з базою даних. Перевірте, чи працює бекенд.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ШІ-Конфігуратор
        </h1>
        <p className="text-gray-400 text-lg">
          Опишіть, для чого вам потрібен ПК та який у вас бюджет, а наш штучний інтелект підбере найкращі існуючі комплектуючі на ринку.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Декоративне світіння на фоні */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4 mb-10">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Наприклад: Збери мені комп'ютер для гри в Cyberpunk 2077 на високих налаштуваннях. Бюджет 40 000 грн..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600 min-h-[150px] resize-y custom-scrollbar"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Аналізую базу товарів...
              </>
            ) : (
              <>
                <span>✨</span> Підібрати збірку
              </>
            )}
          </button>
        </form>

        {/* БЛОК З ВІДПОВІДДЮ ШІ */}
        {aiResponse && (
          <div className="relative z-10 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <span>🤖</span> Відповідь асистента:
            </h3>
            
            <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-6 md:p-8 whitespace-pre-wrap text-gray-300 leading-relaxed font-medium">
              {aiResponse}
            </div>

            <div className="mt-8 text-center">
              <Link href="/catalog" className="inline-block border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider">
                Перейти в каталог для покупки
              </Link>
            </div>
          </div>
        )}
      </div>
      
    </main>
  );
}