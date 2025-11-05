'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const isLogged = !!user;

  return (
    <>
      {/* TOP: solo logo, centrado */}
      <header className="top-logo-bar">
        <Link href={isLogged ? '/dashboard' : '/'} className="top-logo-link">
          <Image
            src="/icons/image-512-maskable.png"
            alt="Pi Expenses"
            width={32}
            height={32}
            priority
          />
        </Link>
      </header>

      {/* BOTTOM NAV: solo cuando hay sesión */}
      {isLogged && (
        <nav className="bottom-nav">
          <Link
            href="/dashboard"
            className={
              'bottom-nav-item' + (pathname.startsWith('/dashboard') ? ' active' : '')
            }
          >
            <Image
              src="/icons/dashboard.png"
              alt="Dashboard"
              width={26}
              height={26}
            />
          </Link>

          <Link
            href="/budgets"
            className={
              'bottom-nav-item' + (pathname.startsWith('/budgets') ? ' active' : '')
            }
          >
            <Image
              src="/icons/presupuestos.png"
              alt="Presupuestos"
              width={26}
              height={26}
            />
          </Link>

          <button
            type="button"
            className="bottom-nav-item"
            onClick={handleLogout}
            aria-label="Salir"
          >
            <Image
              src="/icons/salir.png"
              alt="Salir"
              width={26}
              height={26}
            />
          </button>
        </nav>
      )}
    </>
  );
}
