import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type || 'success'}`} role="status" aria-live="polite">
      {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: 2,
          display: 'inline-flex',
          marginLeft: 6,
          opacity: 0.8,
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
