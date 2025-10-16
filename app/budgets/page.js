'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AuthButtons from '@/components/AuthButtons';
import BudgetForm from '@/components/BudgetForm';
import BudgetSummary from '@/components/BudgetSummary';

export default function BudgetsPage(){
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (!user) return;
    const { data } = await supabase.from('budgets').select('*').order('year').order('month').order('quincena');
    setItems(data||[]);
  };
  useEffect(()=>{ load(); },[]);

  if(!user){
    return (
      <div className="card">
        <p>Inicia sesión para gestionar presupuestos.</p>
        <AuthButtons/>
      </div>
    );
  }

  return (
    <div className="grid">
      <BudgetSummary />
      <div className="card">
        <div className="h2">Nuevo/Actualizar presupuesto</div>
        <BudgetForm onSaved={()=>load()} />
      </div>
      <div className="card">
        <div className="h2">Mis presupuestos</div>
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead><tr><th>Año</th><th>Mes</th><th>Q</th><th>Presupuesto</th><th>Nota</th></tr></thead>
            <tbody>
              {items.length===0 && <tr><td colSpan="5" className="small">Sin presupuestos.</td></tr>}
              {items.map(b=>(
                <tr key={b.id}><td>{b.year}</td><td>{b.month}</td><td>{b.quincena}</td><td>${Number(b.amount).toFixed(2)}</td><td>{b.note||'-'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
