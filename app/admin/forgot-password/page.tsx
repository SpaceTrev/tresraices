'use client';

import { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, type Auth } from 'firebase/auth';
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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

  const handleResetPassword = async () => {
    setError('');
    setLoading(true);

    if (!email) {
      setError('Ingresa tu email');
      setLoading(false);
      return;
    }

    if (!authRef.current) {
      setError('Error de inicialización');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(authRef.current, email);
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else {
        setError('Error al enviar email: ' + err.message);
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
            <h2 className="text-2xl font-bold text-darkPurple mb-2">Email Enviado</h2>
            <p className="text-slate-600 mb-4">
              Hemos enviado un enlace para restablecer tu contraseña a:
            </p>
            <p className="font-semibold text-darkPurple">{email}</p>
            <p className="text-sm text-slate-500 mt-4">
              Revisa tu bandeja de entrada (y spam) y sigue las instrucciones del email.
            </p>
          </div>
          <Link href="/admin" className="btn btn-primary inline-block w-full justify-center">
            Volver a Inicio de Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="card p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-darkPurple mb-2">Recuperar Contraseña</h1>
          <p className="text-sm text-slate-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
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
              onKeyPress={e => e.key === 'Enter' && handleResetPassword()}
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            className="btn btn-primary w-full justify-center py-3" 
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <Link href="/admin" className="text-sm text-federalBlue hover:underline block">
            ← Volver a Inicio de Sesión
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:underline block">
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
