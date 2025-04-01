'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setMessage(data.message);
      setEmail('');
      
      // Attendre un moment avant de rediriger
      setTimeout(() => {
        router.push('/admin');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configuration Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Promouvoir un utilisateur en administrateur
          </p>
        </div>
        
        {message && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {message}
                </p>
                <p className="text-sm text-green-700 mt-2">
                  Redirection vers la page admin dans 3 secondes...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email de l'utilisateur
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="utilisateur@exemple.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Traitement en cours...' : 'Promouvoir en administrateur'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-red-600">
            Attention: Cette page est à usage unique et devrait être supprimée après la configuration initiale.
          </p>
        </div>
      </div>
    </div>
  );
} 