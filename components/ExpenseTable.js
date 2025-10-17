'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ExpenseTable({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('when_date', { ascending: false })
      .order('id', { ascending: false });
    if (!error && data) {
      setItems(data);
      setTotal(data.reduce((acc, x)=> acc + Number(x.amount || 0), 0));
    }
  };

  useEffect(()=>{ load(); },[refreshKey]);

  const togglePaid = async (id, current) => {
    await supabase.from('expenses').update({ paid: !current }).eq('id', id);
    load();
  };
  const del = async (id) => {
    if (!confirm('¿Eliminar movimiento?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', margin:'8px 0'}}>
        <h3 style={{margin:0}}>Transacciones</h3>
        <div>Total: ${total.toFixed(2)}</div>
      </div>
      <div >
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th style={{textAlign:'right'}}>Monto</th>
              <th>Estado</th>
              <th>Comprobante</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="7" className="small">Sin movimientos.</td></tr>}
            {items.map(e => (
              <tr key={e.id}>
                <td>{e.when_date}</td>
                <td>{e.description}</td>
                <td>{e.category || '-'}</td>
                <td style={{textAlign:'right'}}>${Number(e.amount).toFixed(2)}</td>
                <td>
                  <button onClick={()=>togglePaid(e.id, e.paid)} className={`btn ${e.paid?'btn-success':'btn-warning'}`}>
                    {e.paid ? 'Completado' : 'Pendiente'}
                  </button>
                </td>
                <td>{e.receipt_url ? <a href={e.receipt_url} target="_blank">Ver</a> : '-'}</td>
                <td>
                  <button onClick={()=>del(e.id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
