'use client';
import { supabase } from '@/lib/supabaseClient';

export default function AuthButtons() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  return (
    <div style={{display:'flex', gap:12}}>
      <button className="btn btn-primary" onClick={signInWithGoogle}>Entrar con Google</button>
      <button className="btn btn-outline" onClick={signOut}>Salir</button>
    </div>
  );
}
