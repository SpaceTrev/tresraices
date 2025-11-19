'use client';

import { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, type Auth } from 'firebase/auth';
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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const authRef = useRef<Auth | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    authRef.current = getAuth(app);
    setInitialized(true);
  }, []);

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (!authRef.current) {
      setError('Error de inicialización');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(authRef.current, email, password);
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al crear cuenta: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="card p-8 max-w-md w-full text-center space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-darkPurple mb-2">¡Cuenta Creada!</h2>
            <p className="text-slate-600">
              Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.
            </p>
          </div>
          <Link href="/admin" className="btn btn-primary inline-block w-full justify-center">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="card p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-darkPurple mb-2">Crear Cuenta</h1>
          <p className="text-sm text-slate-600">Tres Raíces Carnicería - Admin</p>
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
              disabled={loading}
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
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
            <input 
              type="password"
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-federalBlue focus:border-federalBlue" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSignup()}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            className="btn btn-primary w-full justify-center py-3" 
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <Link href="/admin" className="text-sm text-federalBlue hover:underline block">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:underline block">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
