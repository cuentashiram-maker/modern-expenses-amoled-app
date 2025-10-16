'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NavBar(){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  },[]);

  return (
    <nav className="nav">
      <div className="logo">
        <img src="/icons/icon-192.png" alt="logo" />
        <a href="/">Pi Expenses</a>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {user && <a href="/dashboard">Dashboard</a>}
        {user && <a href="/budgets">Presupuestos</a>}
      </div>
    </nav>
  );
}
