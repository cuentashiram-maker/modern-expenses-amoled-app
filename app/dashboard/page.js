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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => { sub.subscription.unsubscribe(); };
  },[]);

  const handleSaved = () => setRefreshKey(k => k + 1);

  if (loading) return <div>Cargando…</div>;
  if (!user) return (
    <div className="card" style={{textAlign:'center'}}>
      <p>Necesitas iniciar sesión.</p>
      <AuthButtons />
    </div>
  );

  return (
    <div className="dashboard-grid">
      <section className="card">
        <div className="h2">Agregar movimiento</div>
        <ExpenseForm onSaved={handleSaved} />
      </section>

      <section className="chart-block full">
        <Charts refreshKey={refreshKey} />
      </section>

      <section className="card full">
        <div className="h2" style={{marginBottom:8}}>Transacciones</div>
        <div className="table-wrap">
          <ExpenseTable refreshKey={refreshKey} />
        </div>
      </section>
    </div>
  );
}
