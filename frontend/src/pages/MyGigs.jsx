import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs, deleteGig } from '../store/slices/gigSlice';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, loading } = useSelector((state) => state.gigs);

  useEffect(() => { dispatch(fetchMyGigs()); }, [dispatch]);

  const handleDelete = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      const result = await dispatch(deleteGig(gigId));
      if (deleteGig.fulfilled.match(result)) toast.success('Gig deleted successfully');
      else toast.error(result.payload || 'Failed to delete gig');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        <Link to="/create-gig" className="btn btn-primary flex items-center space-x-2"><FiPlus /><span>Post New Gig</span></Link>
      </div>

      {myGigs.length === 0 ? (
        <div className="card text-center py-12"><p className="text-gray-500 text-lg mb-4">You haven't posted any gigs yet</p><Link to="/create-gig" className="btn btn-primary">Post Your First Gig</Link></div>
      ) : (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div key={gig._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{gig.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{gig.status}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">{gig.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="font-semibold text-primary-600">${gig.budget}</span>
                    <span>{gig.bidCount || 0} bids</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link to={`/gigs/${gig._id}`} className="btn btn-secondary flex items-center space-x-1"><FiEye /><span>View</span></Link>
                  <Link to={`/gigs/${gig._id}/bids`} className="btn btn-primary flex items-center space-x-1"><FiUsers /><span>Bids</span></Link>
                  {gig.status === 'open' && <button onClick={() => handleDelete(gig._id)} className="btn btn-danger flex items-center space-x-1"><FiTrash2 /><span>Delete</span></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;