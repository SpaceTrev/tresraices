'use client';

import { useEffect, useState, useRef } from 'react';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, type FirebaseStorage } from 'firebase/storage';

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

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [initialized, setInitialized] = useState(false);
  
  const authRef = useRef<Auth | null>(null);
  const storageRef = useRef<FirebaseStorage | null>(null);

  useEffect(() => {
    // Initialize Firebase only on client-side
    if (typeof window === 'undefined') return;
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    authRef.current = getAuth(app);
    storageRef.current = getStorage(app);
    
    setInitialized(true);
    
    return onAuthStateChanged(authRef.current, (u) => setUser(u));
  }, []);

  const login = async () => {
    if (!authRef.current) return;
    await signInWithEmailAndPassword(authRef.current, email, password);
  };

  const logout = async () => {
    if (!authRef.current) return;
    await signOut(authRef.current);
  };

  const upload = async () => {
    if (!user) { setMessage('Inicia sesión.'); return; }
    if (!file) { setMessage('Carga un PDF primero.'); return; }
    if (!storageRef.current) return;
    
    const stamp = new Date().toISOString().replace(/[:.]/g,'-');
    const r = ref(storageRef.current, `menus/${stamp}.pdf`);
    const task = uploadBytesResumable(r, file);
    task.on('state_changed', (snap) => {
      setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
    }, (err) => setMessage(String(err)), async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      setMessage('PDF subido. Pide a /api/parse-menu que regenere los JSON.');
      try {
        const res = await fetch('/api/parse-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey ?? '' },
          body: JSON.stringify({ storageUrl: url })
        });
        const data = await res.json();
        setMessage(`Parse resultado: ${data.status}`);
      } catch (e:any) {
        setMessage('Subido. Error llamando al parser (configurar env y funciones).');
      }
    });
  };

  if (!initialized) {
    return <div className="max-w-xl card p-6">Cargando...</div>;
  }

  return (
    <div className="max-w-xl card p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      {!user ? (
        <div className="space-y-2">
          <input className="w-full border p-2 rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary" onClick={login}>Iniciar sesión</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm">Sesión: {user.email}</div>
          <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
          <button className="btn btn-primary" onClick={upload}>Subir PDF y Parsear</button>
          <div className="text-sm">Progreso: {progress}%</div>
          <div className="text-sm">{message}</div>
          <button className="text-sm underline opacity-70" onClick={logout}>Cerrar sesión</button>
        </div>
      )}
      <p className="text-xs opacity-60">Para activar el parser, configura variables de entorno y permisos. Este MVP cae en local JSON si no hay backend.</p>
    </div>
  );
}
