import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { createFeedback } from '../services/api';
import { StarDisplay, StarInput } from '../components/StarRating';

const COURSE_SUGGESTIONS = [
  'Full-Stack MERN Development',
  'UI/UX Design Fundamentals',
  'Cloud Architecture with MongoDB Atlas',
  'Modern JavaScript & TypeScript',
];

export default function AddFeedback({ onNotify }) {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const [showOptionalMeta, setShowOptionalMeta] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [courseDuration, setCourseDuration] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!courseName.trim() || courseName.trim().length < 2) {
      nextErrors.courseName = 'Please enter a valid Course Name (at least 2 characters).';
    }
    if (!feedbackComments.trim() || feedbackComments.trim().length < 3) {
      nextErrors.feedbackComments = 'Please enter Feedback Comments (at least 3 characters).';
    }
    if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
      nextErrors.feedbackRating = 'Please select a rating between 1 and 5.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await createFeedback({
        courseName: courseName.trim(),
        feedbackComments: feedbackComments.trim(),
        feedbackRating: Number(feedbackRating),
        ...(courseId.trim() ? { courseId: courseId.trim() } : {}),
        ...(courseDuration.trim() ? { courseDuration: courseDuration.trim() } : {}),
      });

      onNotify('New course feedback added successfully!', 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit feedback. Please try again.';
      setErrors({ submit: msg });
      onNotify(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Feedback</h1>
          <p className="page-description">
            Submit new course evaluation feedback directly to MongoDB Atlas.
          </p>
        </div>

        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={17} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="form-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          {errors.submit && (
            <div className="alert-banner error" role="alert">
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Course Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="course-name">
              <span>
                Course Name<span className="required-mark">*</span>
              </span>
            </label>
            <input
              id="course-name"
              type="text"
              className="input"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                if (errors.courseName) setErrors((p) => ({ ...p, courseName: '' }));
              }}
              placeholder="e.g., Full-Stack MERN Development"
              maxLength={120}
              required
            />
            <div className="quick-chips" aria-label="Course name quick suggestions">
              {COURSE_SUGGESTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setCourseName(name);
                    if (errors.courseName) setErrors((p) => ({ ...p, courseName: '' }));
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            {errors.courseName && <div className="field-error">{errors.courseName}</div>}
          </div>

          {/* Feedback Comments */}
          <div className="form-group">
            <label className="form-label" htmlFor="feedback-comments">
              <span>
                Feedback Comments<span className="required-mark">*</span>
              </span>
              <span className="optional-hint">{feedbackComments.length}/1000</span>
            </label>
            <textarea
              id="feedback-comments"
              className="textarea"
              value={feedbackComments}
              onChange={(e) => {
                setFeedbackComments(e.target.value);
                if (errors.feedbackComments) setErrors((p) => ({ ...p, feedbackComments: '' }));
              }}
              placeholder="Share detailed insights on course quality, pacing, labs, and instructor clarity..."
              maxLength={1000}
              required
            />
            {errors.feedbackComments && (
              <div className="field-error">{errors.feedbackComments}</div>
            )}
          </div>

          {/* Feedback Rating */}
          <div className="form-group">
            <label className="form-label">
              <span>
                Feedback Rating<span className="required-mark">*</span>
              </span>
            </label>
            <StarInput
              value={feedbackRating}
              onChange={(rating) => {
                setFeedbackRating(rating);
                if (errors.feedbackRating) setErrors((p) => ({ ...p, feedbackRating: '' }));
              }}
            />
            {errors.feedbackRating && (
              <div className="field-error">{errors.feedbackRating}</div>
            )}
          </div>

          {/* Optional Course ID & Duration toggle */}
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="chip-btn"
              onClick={() => setShowOptionalMeta((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
              }}
            >
              {showOptionalMeta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>Optional: Custom Course ID & Duration</span>
            </button>

            {showOptionalMeta && (
              <div className="form-row-2" style={{ marginTop: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="course-id">
                    Course ID
                    <span className="optional-hint">Auto if blank</span>
                  </label>
                  <input
                    id="course-id"
                    type="text"
                    className="input"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="e.g., CRS-201"
                    maxLength={24}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="course-duration">
                    Course Duration
                    <span className="optional-hint">Default: 8 Weeks</span>
                  </label>
                  <input
                    id="course-duration"
                    type="text"
                    className="input"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="e.g., 10 Weeks"
                    maxLength={50}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <aside className="preview-card" aria-label="Live dashboard preview">
          <div className="preview-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} />
            <span>Live Dashboard Preview</span>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Preview how this submission will appear on the Feedback Dashboard.
          </p>

          <div className="preview-box">
            <div className="mobile-card-top">
              <span className="course-id-badge">
                {courseId.trim() ? courseId.trim().toUpperCase() : 'AUTO-ID'}
              </span>
              <span className="duration-pill">
                <Clock size={13} />
                <span>{courseDuration.trim() || '8 Weeks'}</span>
              </span>
            </div>

            <div>
              <div className="course-name">
                {courseName.trim() || 'Course Name will appear here'}
              </div>
              <p
                style={{
                  marginTop: 6,
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-word',
                }}
              >
                {feedbackComments.trim() ||
                  'Your submitted feedback comments will be displayed here.'}
              </p>
            </div>

            <div style={{ paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                Overall Feedback Rating
              </div>
              <StarDisplay rating={feedbackRating} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
