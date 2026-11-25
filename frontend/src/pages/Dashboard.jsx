import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock,
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Database,
  Inbox,
} from 'lucide-react';
import {
  fetchFeedbackList,
  updateFeedback,
  deleteFeedback,
  seedSampleFeedback,
} from '../services/api';
import { StarDisplay } from '../components/StarRating';
import UpdateModal from '../components/UpdateModal';
import DeleteModal from '../components/DeleteModal';

export default function Dashboard({ onNotify, onHealthCheck }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    averageRating: 0,
    topRatedCount: 0,
    needsAttentionCount: 0,
  });
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (ratingFilter !== 'all') params.rating = ratingFilter;

      const res = await fetchFeedbackList(params);
      setFeedbackList(res.data || []);
      if (res.stats) setStats(res.stats);
      onHealthCheck?.();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Unable to reach the backend API. Ensure the Node.js server is running and MongoDB Atlas URI is configured in backend/.env.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, ratingFilter, onHealthCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFeedback();
    }, 180);
    return () => clearTimeout(timer);
  }, [loadFeedback]);

  const handleUpdateSave = async (id, payload) => {
    try {
      setIsSaving(true);
      await updateFeedback(id, payload);
      setEditingItem(null);
      onNotify('Feedback updated successfully', 'success');
      await loadFeedback();
    } catch (err) {
      onNotify(err.response?.data?.message || 'Failed to update feedback', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true);
      await deleteFeedback(id);
      setDeletingItem(null);
      onNotify('Feedback deleted successfully', 'success');
      await loadFeedback();
    } catch (err) {
      onNotify(err.response?.data?.message || 'Failed to delete feedback', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedSamples = async () => {
    try {
      setIsSeeding(true);
      const res = await seedSampleFeedback();
      onNotify(res.message || 'Sample feedback loaded', 'success');
      await loadFeedback();
    } catch (err) {
      onNotify(err.response?.data?.message || 'Failed to load sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Feedback Dashboard</h1>
          <p className="page-description">
            Review submitted course evaluations, ratings, and manage admin updates in real time.
          </p>
        </div>

        <Link to="/add-feedback" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Feedback</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <section className="kpi-grid" aria-label="Feedback summary metrics">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Total Feedback</div>
            <div className="kpi-value">{stats.totalCount}</div>
            <div className="kpi-sub">Course submissions</div>
          </div>
          <div className="kpi-icon indigo">
            <MessageSquare size={21} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Average Rating</div>
            <div className="kpi-value">
              {stats.totalCount > 0 ? stats.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="kpi-sub">Out of 5.0 stars</div>
          </div>
          <div className="kpi-icon amber">
            <Star size={21} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Top Rated (4–5★)</div>
            <div className="kpi-value">{stats.topRatedCount}</div>
            <div className="kpi-sub">Positive course scores</div>
          </div>
          <div className="kpi-icon emerald">
            <TrendingUp size={21} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Needs Attention</div>
            <div className="kpi-value">{stats.needsAttentionCount}</div>
            <div className="kpi-sub">Rated 2★ or below</div>
          </div>
          <div className="kpi-icon rose">
            <AlertCircle size={21} />
          </div>
        </div>
      </section>

      {error && (
        <div className="alert-banner error" role="alert">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Connection Issue:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Feedback Panel */}
      <section className="panel" aria-label="Course feedback list">
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} className="search-icon" />
            <input
              type="search"
              className="input"
              placeholder="Search by Course ID, Course Name, or comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search feedback"
            />
          </div>

          <div className="toolbar-controls">
            <select
              className="select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              aria-label="Filter by rating"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadFeedback}
              disabled={loading}
              title="Refresh list"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading course feedback from MongoDB Atlas...</span>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={26} />
            </div>
            <h3>
              {stats.totalCount === 0
                ? 'No course feedback submitted yet'
                : 'No feedback matches your filter'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 440, fontSize: '0.92rem' }}>
              {stats.totalCount === 0
                ? 'Start by adding a new course feedback entry or load sample courses to explore the dashboard.'
                : 'Try clearing your search query or selecting All Ratings.'}
            </p>
            <div className="empty-actions">
              <Link to="/add-feedback" className="btn btn-primary">
                <Plus size={16} />
                <span>Add Feedback</span>
              </Link>
              {stats.totalCount === 0 && !error && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSeedSamples}
                  disabled={isSeeding}
                >
                  <Database size={16} />
                  <span>{isSeeding ? 'Loading...' : 'Load Sample Courses'}</span>
                </button>
              )}
              {(search || ratingFilter !== 'all') && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearch('');
                    setRatingFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-wrapper">
              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name & Comments</th>
                    <th>Course Duration</th>
                    <th>Overall Feedback Rating</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span className="course-id-badge">{item.courseId}</span>
                      </td>
                      <td className="course-cell">
                        <div className="course-name">{item.courseName}</div>
                        <p className="course-comment" title={item.feedbackComments}>
                          {item.feedbackComments}
                        </p>
                      </td>
                      <td>
                        <span className="duration-pill">
                          <Clock size={14} />
                          <span>{item.courseDuration}</span>
                        </span>
                      </td>
                      <td>
                        <StarDisplay rating={item.feedbackRating} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-group">
                          <button
                            type="button"
                            className="btn btn-edit"
                            onClick={() => setEditingItem(item)}
                          >
                            <Pencil size={14} />
                            <span>Update</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-delete"
                            onClick={() => setDeletingItem(item)}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="mobile-card-list">
              {feedbackList.map((item) => (
                <article key={item._id} className="mobile-feedback-card">
                  <div className="mobile-card-top">
                    <span className="course-id-badge">{item.courseId}</span>
                    <span className="duration-pill">
                      <Clock size={13} />
                      <span>{item.courseDuration}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="course-name">{item.courseName}</h3>
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.feedbackComments}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginBottom: 4,
                      }}
                    >
                      Overall Feedback Rating
                    </div>
                    <StarDisplay rating={item.feedbackRating} />
                  </div>

                  <div className="mobile-card-actions">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil size={15} />
                      <span>Update</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => setDeletingItem(item)}
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <UpdateModal
        feedback={editingItem}
        isSaving={isSaving}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdateSave}
      />

      <DeleteModal
        feedback={deletingItem}
        isDeleting={isDeleting}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
