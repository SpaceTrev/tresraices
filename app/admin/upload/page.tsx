'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, type Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default function UploadPage() {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [supplier, setSupplier] = useState<string>('El Barranqueño');
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const authRef = useRef<Auth | null>(null);
  const storageRef = useRef<FirebaseStorage | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    authRef.current = getAuth(app);
    storageRef.current = getStorage(app);
    
    setInitialized(true);
    
    return onAuthStateChanged(authRef.current, (u) => setUser(u));
  }, []);

  const upload = async () => {
    if (!user) { 
      setMessage('⚠️ Debes iniciar sesión primero'); 
      return; 
    }
    if (!file) { 
      setMessage('⚠️ Selecciona un archivo PDF primero'); 
      return; 
    }
    if (!storageRef.current) return;
    
    setUploading(true);
    setMessage('');
    
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    const r = ref(storageRef.current, `menus/${stamp}.pdf`);
    const task = uploadBytesResumable(r, file);
    
    task.on('state_changed', 
      (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      }, 
      (err) => {
        setMessage(`❌ Error al subir: ${err.message}`);
        setUploading(false);
      }, 
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setMessage('✅ PDF subido. Procesando...');
        
        try {
          const res = await fetch('/api/parse-menu', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'x-admin-key': adminKey ?? '' 
            },
            body: JSON.stringify({ storageUrl: url, supplier })
          });
          const data = await res.json();
          setMessage(`✅ Completado: ${data.status}`);
          setFile(null);
          setProgress(0);
        } catch (e: any) {
          setMessage('⚠️ PDF subido pero el parser no está configurado. Configura variables de entorno y Firebase Admin.');
        }
        setUploading(false);
      }
    );
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="card p-8 max-w-md w-full text-center space-y-4">
          <p className="text-slate-600">Debes iniciar sesión para acceder a esta página</p>
          <Link href="/admin" className="btn btn-primary inline-block">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-darkPurple">Subir PDF de Precios</h1>
          <Link href="/admin" className="text-sm text-federalBlue hover:underline">
            ← Volver a Admin
          </Link>
        </div>

        {/* Upload Form */}
        <div className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-darkPurple mb-2">
              Selecciona PDF LISTA2
            </label>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-federalBlue"
              disabled={uploading}
            />
            {file && (
              <p className="text-sm text-slate-600 mt-2">
                📄 Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-darkPurple mb-2">
              Proveedor
            </label>
            <select 
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-federalBlue" 
              value={supplier} 
              onChange={(e) => setSupplier(e.target.value)}
              disabled={uploading}
            >
              <option value="El Barranqueño">El Barranqueño</option>
            </select>
          </div>

          {progress > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Progreso</span>
                <span className="font-semibold text-federalBlue">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-federalBlue h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : message.startsWith('❌')
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}>
              {message}
            </div>
          )}

          <button 
            className="btn btn-primary w-full justify-center py-3 text-base"
            onClick={upload}
            disabled={!file || uploading}
          >
            {uploading ? '⏳ Procesando...' : '📤 Subir PDF y Parsear'}
          </button>
        </div>

        {/* Instructions */}
        <div className="card p-6 bg-slate-50">
          <h2 className="font-semibold text-darkPurple mb-3">Instrucciones:</h2>
          <ol className="text-sm space-y-2 list-decimal list-inside text-slate-700">
            <li>Solicita el PDF actualizado "LISTA2" a El Barranqueño</li>
            <li>Selecciona el archivo PDF usando el botón de arriba</li>
            <li>Verifica que el proveedor sea correcto</li>
            <li>Click en "Subir PDF y Parsear"</li>
            <li>El sistema procesará el PDF y actualizará los menús automáticamente</li>
          </ol>
          <p className="text-xs text-slate-500 mt-4">
            <strong>Nota:</strong> Esta función requiere configuración de Firebase Admin y variables de entorno. 
            Si el parser no está configurado, los menús seguirán usando los archivos JSON locales en <code>/data</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
