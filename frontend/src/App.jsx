import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import AddFeedback from './pages/AddFeedback';
import { fetchHealth } from './services/api';

export default function App() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [toast, setToast] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetchHealth();
      setDbStatus(res.database === 'connected' ? 'connected' : 'disconnected');
    } catch {
      setDbStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleNotify = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar dbStatus={dbStatus} />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard onNotify={handleNotify} onHealthCheck={checkHealth} />}
            />
            <Route path="/add-feedback" element={<AddFeedback onNotify={handleNotify} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            CoursePulse Admin Panel · Built with MongoDB Atlas, Express.js, React &amp; Node.js
          </div>
        </footer>

        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </BrowserRouter>
  );
}
