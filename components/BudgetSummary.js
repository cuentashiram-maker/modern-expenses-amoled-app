'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function getQuincenaRange(y,m,q){
  const start = new Date(y, m-1, q===1?1:16);
  const end = new Date(y, m-1, q===1?15:0); // we'll fix end for q=2
  if(q===2){
    const nextMonth = new Date(y, m, 1);
    const lastDay = new Date(nextMonth - 1).getDate();
    return {start, end:new Date(y, m-1, lastDay)};
  }
  return {start, end};
}

export default function BudgetSummary(){
  const now = new Date();
  const [y,setY] = useState(now.getFullYear());
  const [m,setM] = useState(now.getMonth()+1);
  const [q,setQ] = useState(now.getDate()<=15?1:2);
  const [budget,setBudget] = useState(null);
  const [spent,setSpent] = useState(0);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;
    const { data: b } = await supabase.from('budgets').select('*').eq('user_id', user.id).eq('year', y).eq('month', m).eq('quincena', q).maybeSingle();
    setBudget(b);
    const {start,end} = getQuincenaRange(y,m,q);
    const { data: ex } = await supabase.from('expenses')
      .select('amount, when_date')
      .gte('when_date', start.toISOString().slice(0,10))
      .lte('when_date', end.toISOString().slice(0,10));
    const total = (ex||[]).reduce((acc,x)=> acc + Number(x.amount||0), 0);
    setSpent(total);
  };

  useEffect(()=>{ load(); },[y,m,q]);

  const remaining = (budget?.amount || 0) - spent;

  return (
    <div className="card">
      <div className="h2">Resumen quincena</div>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <div className="small">Periodo</div>
          <div>{y}-{String(m).padStart(2,'0')} / Q{q}</div>
        </div>
        <div>
          <div className="small">Presupuesto</div>
          <div>${(budget?.amount||0).toFixed(2)}</div>
        </div>
        <div>
          <div className="small">Gastado</div>
          <div>${spent.toFixed(2)}</div>
        </div>
        <div>
          <div className="small">Restante</div>
          <div className={`badge ${remaining>=0?'badge-paid':'badge-pending'}`}>${remaining.toFixed(2)}</div>
        </div>
      </div>
      <div style={{marginTop:12}} className="grid" >
        <div>
          <label>Año</label>
          <input className="input" type="number" value={y} onChange={e=>setY(parseInt(e.target.value||'0'))}/>
        </div>
        <div>
          <label>Mes</label>
          <input className="input" type="number" min="1" max="12" value={m} onChange={e=>setM(parseInt(e.target.value||'1'))}/>
        </div>
        <div>
          <label>Quincena</label>
          <select className="input" value={q} onChange={e=>setQ(parseInt(e.target.value))}>
            <option value={1}>1 (1–15)</option>
            <option value={2}>2 (16–fin)</option>
          </select>
        </div>
      </div>
      {budget?.note && <div className="small" style={{marginTop:8}}>Nota: {budget.note}</div>}
    </div>
  );
}
