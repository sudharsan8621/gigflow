import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGig } from '../store/slices/gigSlice';
import toast from 'react-hot-toast';

const CreateGig = () => {
  const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.gigs);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.length < 5) { toast.error('Title must be at least 5 characters'); return; }
    if (formData.description.length < 20) { toast.error('Description must be at least 20 characters'); return; }
    const result = await dispatch(createGig({ ...formData, budget: Number(formData.budget) }));
    if (createGig.fulfilled.match(result)) { toast.success('Gig posted successfully!'); navigate('/my-gigs'); }
    else { toast.error(result.payload || 'Failed to create gig'); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Post a New Gig</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Gig Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required minLength={5} maxLength={100} className="input" placeholder="e.g., Build a responsive landing page" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required minLength={20} maxLength={2000} rows={6} className="input resize-none" placeholder="Describe your project requirements..." />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Budget (USD)</label>
            <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} required min={1} className="input" placeholder="500" />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Posting...' : 'Post Gig'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;