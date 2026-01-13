import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));
    if (register.fulfilled.match(result)) { toast.success('Account created successfully!'); navigate('/'); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="input" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        <p className="text-center text-gray-600 mt-6">Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;