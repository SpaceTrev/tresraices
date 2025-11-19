'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  const authRef = useRef<Auth | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    authRef.current = getAuth(app);
    
    setInitialized(true);
    
    return onAuthStateChanged(authRef.current, (u) => setUser(u));
  }, []);

  const login = async () => {
    setError('');
    if (!authRef.current) return;
    try {
      await signInWithEmailAndPassword(authRef.current, email, password);
    } catch (err: any) {
      setError('Error de autenticación. Verifica email y contraseña.');
    }
  };

  const logout = async () => {
    if (!authRef.current) return;
    await signOut(authRef.current);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="card p-8 max-w-md w-full">
          <p className="text-center text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="card p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-darkPurple mb-2">Admin</h1>
            <p className="text-sm text-slate-600">Tres Raíces Carnicería</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-federalBlue focus:border-federalBlue" 
                placeholder="admin@tresraices.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && login()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input 
                type="password"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-federalBlue focus:border-federalBlue" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && login()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              className="btn btn-primary w-full justify-center py-3" 
              onClick={login}
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-federalBlue hover:underline">
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-darkPurple">Panel de Administración</h1>
              <p className="text-sm text-slate-600 mt-1">Sesión: {user.email}</p>
            </div>
            <button 
              onClick={logout}
              className="text-sm text-slate-600 hover:text-red-600 underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recalculate Order Tool */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/recalculate" className="flex items-start gap-4">
              <div className="bg-federalBlue text-white rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Recalcular Pedidos</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Calcula precios finales basados en pesos reales del distribuidor
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Abrir herramienta →
                </div>
              </div>
            </Link>
          </div>

          {/* Upload PDF Tool */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/upload" className="flex items-start gap-4">
              <div className="bg-mintGreen text-darkPurple rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Subir PDF de Precios</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Actualiza el menú desde el PDF LISTA2 del proveedor
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Abrir herramienta →
                </div>
              </div>
            </Link>
          </div>

        </div>

        {/* Info Card */}
        <div className="card p-6 bg-slate-50">
          <h3 className="font-semibold text-darkPurple mb-2">Información</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• <strong>Recalcular Pedidos:</strong> Usa cuando recibes los pesos finales del distribuidor</li>
            <li>• <strong>Subir PDF:</strong> Actualiza precios base cuando El Barranqueño envía nueva LISTA2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
