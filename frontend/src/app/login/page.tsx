"use line";
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // FastAPI вимагає формат form-data для логіну, а не JSON
    const details = new URLSearchParams();
    details.append('username', formData.username); // username тут дорівнює email
    details.append('password', formData.password);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: details,
      });

      if (res.ok) {
        const data = await res.json();
        // Зберігаємо токен у пам'ять браузера (Local Storage)
        localStorage.setItem('token', data.access_token);
        router.push('/'); // Повертаємось на головну сторінку
      } else {
        setError('Невірний email або пароль');
      }
    } catch (err) {
      setError('Помилка з\'єднання з сервером');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Вхід у систему
        </h1>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
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
            Увійти
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Ще немає акаунта? <Link href="/register" className="text-blue-400 hover:underline">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}