'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // obtener usuario actual
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // escuchar cambios de sesión
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // si ya hay usuario, mandamos directo al dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return (
    <main className="home-minimal">
      <div className="home-logo">
        <Image
          src="/icons/image-512-maskable.png"
          alt="Pi Expenses logo"
          width={160}
          height={160}
          priority
        />
      </div>

      <h1 className="home-title">Bienvenido</h1>

      {/* Solo mostramos el botón mientras no sabemos, o si no hay usuario */}
      {(!loading && !user) && (
        <button className="btn-google" onClick={handleLogin}>
          Entrar con Google
        </button>
      )}

      {loading && (
        <p style={{ marginTop: 16, color: '#9ca3af', fontSize: 14 }}>
          Cargando…
        </p>
      )}
    </main>
  );
}
