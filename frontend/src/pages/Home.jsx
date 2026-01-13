import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import GigCard from '../components/GigCard';
import Loader from '../components/Loader';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('open');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    dispatch(fetchGigs(params));
  }, [dispatch, debouncedSearch, status]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Gig</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse through open projects and submit your bids.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search gigs by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12" />
        </div>
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
            <option value="open">Open Gigs</option>
            <option value="assigned">Assigned Gigs</option>
            <option value="">All Gigs</option>
          </select>
        </div>
      </div>

      {!loading && <p className="text-gray-600 mb-6">Found {gigs.length} gig{gigs.length !== 1 ? 's' : ''}</p>}

      {loading ? (
        <Loader />
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No gigs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (<GigCard key={gig._id} gig={gig} />))}
        </div>
      )}
    </div>
  );
};

export default Home;