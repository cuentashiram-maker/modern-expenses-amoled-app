'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ExpenseForm({ onSaved }) {
  const [whenDate, setWhenDate] = useState(()=> new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const uploadReceipt = async (userId) => {
    if (!file) return null;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'receipts';
    const filename = `${userId}/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: false });
    if (error) { alert('Error subiendo comprobante: ' + error.message); return null; }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(filename);
    return pub?.publicUrl || null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Inicia sesión primero'); setBusy(false); return; }

    let receipt_url = await uploadReceipt(user.id);

    const { error } = await supabase.from('expenses').insert({
      user_id: user.id,
      when_date: whenDate,
      description,
      category: category || null,
      amount: parseFloat(amount || '0'),
      paid,
      receipt_url
    });
    setBusy(false);
    if (error) alert(error.message);
    else {
      setDescription(''); setCategory(''); setAmount(''); setPaid(false); setFile(null);
      onSaved && onSaved();
    }
  };

  return (
    <form onSubmit={submit} className="grid" style={{gap:12}}>
      <div><label>Fecha</label><input className="input" type="date" value={whenDate} onChange={e=>setWhenDate(e.target.value)} required/></div>
      <div><label>Descripción</label><input className="input" value={description} onChange={e=>setDescription(e.target.value)} required placeholder="Renta, tarjeta, etc."/></div>
      <div><label>Monto</label><input className="input" type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} required/></div>
      <div><label>Categoría (opcional)</label><input className="input" value={category} onChange={e=>setCategory(e.target.value)} placeholder="Vivienda, comida, etc."/></div>
      <label style={{display:'flex', gap:8, alignItems:'center'}}>
        <input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)} />
        Pagado
      </label>
      <div>
        <label>Comprobante (foto)</label>
        <input className="input" type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files?.[0] || null)}/>
        <div className="small">Se sube a Supabase Storage. Más adelante conectamos AI para leer monto/categoría automáticamente.</div>
      </div>
      <button disabled={busy} className="btn btn-success">{busy?'Guardando...':'Guardar'}</button>
    </form>
  );
}
