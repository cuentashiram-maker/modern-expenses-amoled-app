'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AuthButtons from '@/components/AuthButtons';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseTable from '@/components/ExpenseTable';
import Charts from '@/components/Charts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => { sub.subscription.unsubscribe(); }
  },[]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return (
    <div className="card">
      <p>Necesitas iniciar sesión.</p>
      <AuthButtons />
    </div>
  );

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="h2">Agregar movimiento</div>
        <ExpenseForm onSaved={()=>{}} />
      </div>
      <div className="card chart-card">
        <Charts />
      </div>
      <div className="card" style={{gridColumn:'1 / -1'}}>
        <ExpenseTable />
      </div>
    </div>
  );
}
