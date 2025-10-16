'use client';
import AuthButtons from '@/components/AuthButtons';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  },[]);

  return (
    <main className="welcome-wrap">
      {!user ? (
        <div className="welcome-card">
          <div className="welcome-hero">
            <div className="welcome-pattern" />
            <svg viewBox="0 0 1440 320" className="welcome-wave" aria-hidden="true">
              <path fill="#000000" d="M0,160L60,154.7C120,149,240,139,360,133.3C480,128,600,128,720,149.3C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>

          <div className="welcome-body">
            <h1 className="welcome-title">Welcome</h1>
            <p className="welcome-sub">Administra tus gastos.</p>
            <div className="welcome-cta">
              <span className="small" style={{color:'#94a3b8'}}>Continuar</span>
              <AuthButtons />
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{textAlign:'center'}}>
          <div className="h1" style={{marginBottom:8}}>¡Hola!</div>
          <p className="small">Tu sesión está iniciada. Entra al <a href="/dashboard">Dashboard</a> o a <a href="/budgets">Presupuestos</a>.</p>
          <AuthButtons />
        </div>
      )}
    </main>
  );
}
