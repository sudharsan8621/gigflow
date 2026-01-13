import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">GigFlow</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Browse Gigs</Link>

              {user ? (
                <>
                  <Link to="/create-gig" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Post a Gig</Link>
                  <Link to="/my-gigs" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">My Gigs</Link>
                  <Link to="/my-bids" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">My Bids</Link>

                  <div className="relative">
                    <button onClick={() => setNotificationOpen(!notificationOpen)} className="relative p-2 text-gray-600 hover:text-primary-600">
                      <FiBell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>
                      )}
                    </button>
                    {notificationOpen && <NotificationDropdown onClose={() => setNotificationOpen(false)} />}
                  </div>

                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <button onClick={handleLogout} className="btn btn-secondary text-sm">Logout</button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn btn-secondary">Login</Link>
                  <Link to="/register" className="btn btn-primary">Sign Up</Link>
                </div>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Browse Gigs</Link>
                {user ? (
                  <>
                    <Link to="/create-gig" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Post a Gig</Link>
                    <Link to="/my-gigs" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>My Gigs</Link>
                    <Link to="/my-bids" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>My Bids</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-gray-600 hover:text-primary-600 px-3 py-2">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="text-gray-600 hover:text-primary-600 px-3 py-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">© 2024 GigFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;