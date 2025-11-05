'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

      {/* Si NO hay sesión → botón verde grande */}
      {!loading && !user && (
        <button className="btn-google" onClick={handleLogin}>
          Entrar con Google
        </button>
      )}

      {/* Si ya hay sesión → pequeño mensaje + link al dashboard */}
      {!loading && user && (
        <div className="home-logged">
          <p>Ya iniciaste sesión como <strong>{user.email}</strong></p>
          <div className="home-logged-actions">
            <Link href="/dashboard" className="link-dashboard">
              Ir al dashboard
            </Link>
            <button className="link-logout" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
