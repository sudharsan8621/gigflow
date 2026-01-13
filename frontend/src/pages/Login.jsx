import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) { toast.success('Welcome back!'); navigate('/'); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Login to GigFlow</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-center text-gray-600 mt-6">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;