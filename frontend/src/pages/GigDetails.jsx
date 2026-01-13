import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig } from '../store/slices/gigSlice';
import { createBid } from '../store/slices/bidSlice';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiDollarSign, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGig: gig, loading } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);
  const { loading: bidLoading } = useSelector((state) => state.bids);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({ message: '', price: '' });

  useEffect(() => { dispatch(fetchGig(id)); }, [dispatch, id]);

  const isOwner = user && gig && user._id === gig.ownerId?._id;
  const canBid = user && !isOwner && gig?.status === 'open';

  const handleBidChange = (e) => { setBidData({ ...bidData, [e.target.name]: e.target.value }); };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (bidData.message.length < 10) { toast.error('Message must be at least 10 characters'); return; }
    const result = await dispatch(createBid({ gigId: id, message: bidData.message, price: Number(bidData.price) }));
    if (createBid.fulfilled.match(result)) { toast.success('Bid submitted successfully!'); setShowBidForm(false); navigate('/my-bids'); }
    else { toast.error(result.payload || 'Failed to submit bid'); }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) return <Loader />;
  if (!gig) return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Gig not found</h2><Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">Browse all gigs</Link></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} mb-3`}>{gig.status === 'open' ? 'Open for Bids' : 'Assigned'}</span>
            <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-primary-600"><FiDollarSign /><span>{gig.budget}</span></div>
            <span className="text-sm text-gray-500">Budget</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center text-gray-600"><FiUser className="mr-2" /><span>Posted by {gig.ownerId?.name || 'Unknown'}</span></div>
          <div className="flex items-center text-gray-600"><FiCalendar className="mr-2" /><span>{formatDate(gig.createdAt)}</span></div>
          <div className="flex items-center text-gray-600"><FiMessageSquare className="mr-2" /><span>{gig.bidCount || 0} bids</span></div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{gig.description}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {isOwner && <Link to={`/gigs/${gig._id}/bids`} className="btn btn-primary">View Bids ({gig.bidCount || 0})</Link>}
          {canBid && !showBidForm && <button onClick={() => setShowBidForm(true)} className="btn btn-primary">Submit a Bid</button>}
          {!user && gig.status === 'open' && <Link to="/login" className="btn btn-primary">Login to Bid</Link>}
        </div>

        {showBidForm && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Bid</h3>
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Proposal</label>
                <textarea id="message" name="message" value={bidData.message} onChange={handleBidChange} required minLength={10} rows={4} className="input resize-none" placeholder="Explain why you're the best fit..." />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Your Price (USD)</label>
                <input type="number" id="price" name="price" value={bidData.price} onChange={handleBidChange} required min={1} className="input" placeholder="Enter your bid amount" />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button type="button" onClick={() => setShowBidForm(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={bidLoading} className="btn btn-primary">{bidLoading ? 'Submitting...' : 'Submit Bid'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;