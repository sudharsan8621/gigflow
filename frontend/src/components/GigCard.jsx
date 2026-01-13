import { Link } from 'react-router-dom';
import { FiDollarSign, FiUser, FiClock } from 'react-icons/fi';

const GigCard = ({ gig }) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800',
    assigned: 'bg-blue-100 text-blue-800',
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{gig.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[gig.status]}`}>{gig.status}</span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{gig.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <FiDollarSign />
          <span className="font-semibold text-gray-800">${gig.budget}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FiUser />
          <span>{gig.ownerId?.name || 'Unknown'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <FiClock />
          <span>{formatDate(gig.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{gig.bidCount || 0} bids</span>
          <Link to={`/gigs/${gig._id}`} className="btn btn-primary text-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
};

export default GigCard;