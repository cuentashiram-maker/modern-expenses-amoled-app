'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BudgetForm({ onSaved }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()+1);
  const [quincena, setQuincena] = useState(now.getDate()<=15?1:2);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Inicia sesión'); setBusy(false); return; }
    const { error } = await supabase.from('budgets').upsert({
      user_id: user.id, year, month, quincena, amount: parseFloat(amount||'0'), note
    }, { onConflict: 'user_id,year,month,quincena' });
    setBusy(false);
    if (error) alert(error.message);
    else { setNote(''); onSaved && onSaved(); }
  };

  return (
    <form onSubmit={submit} className="grid" style={{gap:12}}>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div><label>Año</label><input className="input" type="number" value={year} onChange={e=>setYear(parseInt(e.target.value||'0'))}/></div>
        <div><label>Mes</label><input className="input" type="number" min="1" max="12" value={month} onChange={e=>setMonth(parseInt(e.target.value||'1'))}/></div>
      </div>
      <div>
        <label>Quincena</label>
        <select className="input" value={quincena} onChange={e=>setQuincena(parseInt(e.target.value))}>
          <option value={1}>1 (1–15)</option>
          <option value={2}>2 (16–fin)</option>
        </select>
      </div>
      <div><label>Presupuesto</label><input className="input" type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} required/></div>
      <div><label>Nota</label><input className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Opcional"/></div>
      <button disabled={busy} className="btn btn-primary">{busy?'Guardando...':'Guardar presupuesto'}</button>
    </form>
  );
}
