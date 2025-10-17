'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, variant = 'success', ttl = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, variant }]);
    if (ttl > 0) setTimeout(() => dismiss(id), ttl);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <div className="toast-container" role="region" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.variant}`}>
            <span>{t.msg}</span>
            <button className="toast-x" onClick={() => dismiss(t.id)} aria-label="Cerrar">×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
