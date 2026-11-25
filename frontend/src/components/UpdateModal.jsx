import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { StarInput } from './StarRating';

export default function UpdateModal({ feedback, isSaving, onClose, onSave }) {
  const [form, setForm] = useState({
    courseId: '',
    courseName: '',
    courseDuration: '',
    feedbackComments: '',
    feedbackRating: 5,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (feedback) {
      setForm({
        courseId: feedback.courseId || '',
        courseName: feedback.courseName || '',
        courseDuration: feedback.courseDuration || '',
        feedbackComments: feedback.feedbackComments || '',
        feedbackRating: feedback.feedbackRating || 5,
      });
      setError('');
    }
  }, [feedback]);

  if (!feedback) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.courseName.trim()) {
      setError('Course Name is required.');
      return;
    }
    if (!form.feedbackComments.trim() || form.feedbackComments.trim().length < 3) {
      setError('Feedback Comments must be at least 3 characters.');
      return;
    }
    if (form.feedbackRating < 1 || form.feedbackRating > 5) {
      setError('Feedback Rating must be between 1 and 5.');
      return;
    }

    setError('');
    onSave(feedback._id, {
      courseId: form.courseId.trim(),
      courseName: form.courseName.trim(),
      courseDuration: form.courseDuration.trim() || '8 Weeks',
      feedbackComments: form.feedbackComments.trim(),
      feedbackRating: Number(form.feedbackRating),
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="update-modal-title" className="modal-title">
            Update Course Feedback
          </h2>
          <button
            type="button"
            className="icon-close-btn"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-banner error" style={{ marginBottom: '16px' }}>
                <span>{error}</span>
              </div>
            )}

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-course-id">
                  Course ID
                </label>
                <input
                  id="edit-course-id"
                  type="text"
                  className="input"
                  value={form.courseId}
                  onChange={(e) => setForm((p) => ({ ...p, courseId: e.target.value }))}
                  placeholder="CRS-101"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-course-duration">
                  Course Duration
                </label>
                <input
                  id="edit-course-duration"
                  type="text"
                  className="input"
                  value={form.courseDuration}
                  onChange={(e) => setForm((p) => ({ ...p, courseDuration: e.target.value }))}
                  placeholder="8 Weeks"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-course-name">
                <span>
                  Course Name<span className="required-mark">*</span>
                </span>
              </label>
              <input
                id="edit-course-name"
                type="text"
                className="input"
                value={form.courseName}
                onChange={(e) => setForm((p) => ({ ...p, courseName: e.target.value }))}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>
                  Feedback Rating<span className="required-mark">*</span>
                </span>
              </label>
              <StarInput
                value={form.feedbackRating}
                onChange={(rating) => setForm((p) => ({ ...p, feedbackRating: rating }))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="edit-comments">
                <span>
                  Feedback Comments<span className="required-mark">*</span>
                </span>
                <span className="optional-hint">{form.feedbackComments.length}/1000</span>
              </label>
              <textarea
                id="edit-comments"
                className="textarea"
                maxLength={1000}
                value={form.feedbackComments}
                onChange={(e) => setForm((p) => ({ ...p, feedbackComments: e.target.value }))}
                placeholder="Update course feedback comments..."
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
