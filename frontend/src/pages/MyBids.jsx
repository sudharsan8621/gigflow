import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidSlice';
import Loader from '../components/Loader';
import { FiExternalLink } from 'react-icons/fi';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, loading } = useSelector((state) => state.bids);

  useEffect(() => { dispatch(fetchMyBids()); }, [dispatch]);

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', hired: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
  const statusMessages = { pending: 'Waiting for client response', hired: 'Congratulations! You got the job!', rejected: 'Not selected for this project' };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bids</h1>

      {myBids.length === 0 ? (
        <div className="card text-center py-12"><p className="text-gray-500 text-lg mb-4">You haven't submitted any bids yet</p><Link to="/" className="btn btn-primary">Browse Available Gigs</Link></div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div key={bid._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{bid.gigId?.title || 'Gig Unavailable'}</h3>
                  <p className="text-sm text-gray-500">Posted by {bid.gigId?.ownerId?.name || 'Unknown'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[bid.status]}`}>{bid.status}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4"><p className="text-gray-600">{bid.message}</p></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-primary-600 font-semibold"><span>Your Bid: {formatCurrency(bid.price)}</span></div>
                  <span className="text-gray-500">Budget: {formatCurrency(bid.gigId?.budget)}</span>
                </div>
                <Link to={`/gigs/${bid.gigId?._id}`} className="btn btn-secondary flex items-center space-x-1"><span>View Gig</span><FiExternalLink /></Link>
              </div>
              <div className={`mt-4 pt-4 border-t border-gray-200 text-sm ${bid.status === 'hired' ? 'text-green-600' : bid.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{statusMessages[bid.status]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;