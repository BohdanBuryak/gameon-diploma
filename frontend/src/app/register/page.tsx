"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login'); // Якщо все ок, кидаємо на сторінку входу
      } else {
        const data = await res.json();
        setError(data.detail || 'Помилка реєстрації');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Створити акаунт
        </h1>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ім'я та прізвище</label>
            <input 
              type="text" 
              required
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Пароль</label>
            <input 
              type="password" 
              required
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-6">
            Зареєструватися
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Вже є акаунт? <Link href="/login" className="text-blue-400 hover:underline">Увійти</Link>
        </p>
      </div>
    </div>
  );
}