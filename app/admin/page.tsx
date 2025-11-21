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

          <div className="text-center space-y-2">
            <Link href="/admin/forgot-password" className="text-sm text-federalBlue hover:underline block">
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="text-sm text-slate-600">
              ¿No tienes cuenta?{' '}
              <Link href="/admin/signup" className="text-federalBlue hover:underline">
                Crear cuenta
              </Link>
            </div>
            <Link href="/" className="text-sm text-slate-500 hover:underline block">
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
          
          {/* User Management */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/users" className="flex items-start gap-4">
              <div className="bg-purple-600 text-white rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Usuarios</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Administrar usuarios y permisos del sistema
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Administrar →
                </div>
              </div>
            </Link>
          </div>

          {/* Content/Theme Editor */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/content" className="flex items-start gap-4">
              <div className="bg-indigo-600 text-white rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Contenido y Diseño</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Editar textos, temas y tipografía del sitio
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Editar →
                </div>
              </div>
            </Link>
          </div>

          {/* Supplier Management */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/suppliers" className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Proveedores</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Gestionar proveedores y márgenes de ganancia
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Gestionar →
                </div>
              </div>
            </Link>
          </div>

          {/* Manual Menu Items */}
          <div className="card p-6 hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/admin/menu" className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-lg p-3 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-darkPurple mb-2">Productos Manuales</h2>
                <p className="text-sm text-slate-600 mb-3">
                  Agregar productos personalizados al menú
                </p>
                <div className="text-sm text-federalBlue font-medium group-hover:underline">
                  Administrar →
                </div>
              </div>
            </Link>
          </div>

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
                  Calcula precios finales basados en pesos reales
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
                  Actualiza el menú desde el PDF del proveedor
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
          <h3 className="font-semibold text-darkPurple mb-2">Sistema de Administración</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• <strong>Usuarios:</strong> Gestionar accesos y permisos del equipo</li>
            <li>• <strong>Contenido y Diseño:</strong> Personalizar textos, colores y fuentes sin tocar código</li>
            <li>• <strong>Proveedores:</strong> Registrar mayoristas y configurar márgenes</li>
            <li>• <strong>Productos Manuales:</strong> Agregar items especiales con validación de ganancias</li>
            <li>• <strong>Recalcular Pedidos:</strong> Ajustar precios con pesos finales del distribuidor</li>
            <li>• <strong>Subir PDF:</strong> Actualizar precios base desde LISTA2 del proveedor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
