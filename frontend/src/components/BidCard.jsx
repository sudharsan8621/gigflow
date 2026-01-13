import { FiDollarSign, FiUser, FiClock } from 'react-icons/fi';

const BidCard = ({ bid, onHire, isOwner, isHiring, gigStatus }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{bid.freelancerId?.name || 'Unknown'}</h4>
            <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bid.status]}`}>{bid.status}</span>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">{bid.message}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-primary-600">
            <FiDollarSign />
            <span className="font-bold text-lg">{bid.price}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <FiClock />
            <span>{formatDate(bid.createdAt)}</span>
          </div>
        </div>

        {isOwner && bid.status === 'pending' && gigStatus === 'open' && (
          <button onClick={() => onHire(bid._id)} disabled={isHiring} className="btn btn-success">
            {isHiring ? 'Hiring...' : 'Hire'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BidCard;