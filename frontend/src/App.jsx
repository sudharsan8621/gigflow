import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import { initializeSocket, disconnectSocket } from './services/socket';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import GigBids from './pages/GigBids';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      initializeSocket(user._id);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/create-gig" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
        <Route path="/my-gigs" element={<ProtectedRoute><MyGigs /></ProtectedRoute>} />
        <Route path="/my-bids" element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
        <Route path="/gigs/:id/bids" element={<ProtectedRoute><GigBids /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;