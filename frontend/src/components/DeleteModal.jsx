import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ feedback, isDeleting, onClose, onConfirm }) {
  if (!feedback) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="modal-card compact">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: '#fef2f2',
                color: '#dc2626',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h2 id="delete-modal-title" className="modal-title">
              Delete Feedback
            </h2>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            Are you sure you want to permanently delete the submitted feedback for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{feedback.courseName}</strong> (
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.86rem' }}>
              {feedback.courseId}
            </span>
            )? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(feedback._id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Feedback'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
