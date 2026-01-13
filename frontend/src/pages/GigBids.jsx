import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGig } from '../store/slices/gigSlice';
import { fetchBidsForGig, hireBid } from '../store/slices/bidSlice';
import BidCard from '../components/BidCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const GigBids = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentGig: gig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading, hiringBidId } = useSelector((state) => state.bids);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(fetchGig(id)); dispatch(fetchBidsForGig(id)); }, [dispatch, id]);

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      const result = await dispatch(hireBid(bidId));
      if (hireBid.fulfilled.match(result)) { toast.success('Freelancer hired successfully!'); dispatch(fetchGig(id)); }
      else toast.error(result.payload || 'Failed to hire freelancer');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isOwner = user && gig && user._id === gig.ownerId?._id;
  const loading = gigLoading || bidsLoading;

  if (loading) return <Loader />;
  if (!gig) return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Gig not found</h2></div>;
  if (!isOwner) return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-800">Access Denied</h2><p className="text-gray-600 mt-2">Only the gig owner can view bids</p></div>;

  return (
    <div>
      <Link to={`/gigs/${id}`} className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6"><FiArrowLeft className="mr-2" />Back to Gig</Link>

      <div className="card mb-8">
        <div className="flex items-start justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900 mb-2">{gig.title}</h1><p className="text-gray-600">Budget: {formatCurrency(gig.budget)}</p></div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{gig.status}</span>
        </div>
        {gig.status === 'assigned' && gig.hiredFreelancerId && <div className="mt-4 p-4 bg-green-50 rounded-lg"><p className="text-green-800"><span className="font-semibold">Assigned to:</span> {gig.hiredFreelancerId.name}</p></div>}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Bids ({bids.length})</h2>

      {bids.length === 0 ? (
        <div className="card text-center py-12"><p className="text-gray-500 text-lg">No bids received yet</p></div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (<BidCard key={bid._id} bid={bid} onHire={handleHire} isOwner={isOwner} isHiring={hiringBidId === bid._id} gigStatus={gig.status} />))}
        </div>
      )}
    </div>
  );
};

export default GigBids;