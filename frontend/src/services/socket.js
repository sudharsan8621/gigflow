import { io } from 'socket.io-client';
import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';
import { updateBidStatus } from '../store/slices/bidSlice';
import toast from 'react-hot-toast';

let socket = null;

export const initializeSocket = (userId) => {
  if (socket) { socket.disconnect(); }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  socket = io(socketUrl, { withCredentials: true });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join', userId);
  });

  socket.on('hired', (data) => {
    toast.success(data.message, { duration: 6000, icon: '🎉' });
    store.dispatch(addNotification({ type: 'hired', message: data.message, gig: data.gig }));
    if (data.gig?.hiredBidId) {
      store.dispatch(updateBidStatus({ bidId: data.gig.hiredBidId, status: 'hired' }));
    }
  });

  socket.on('bid-rejected', (data) => {
    toast.error(data.message, { duration: 4000 });
    store.dispatch(addNotification({ type: 'rejected', message: data.message, gigId: data.gigId }));
  });

  socket.on('new-bid', (data) => {
    toast.success(data.message, { duration: 4000, icon: '📩' });
    store.dispatch(addNotification({ type: 'new-bid', message: data.message, bid: data.bid }));
  });

  socket.on('disconnect', () => { console.log('Socket disconnected'); });
  socket.on('error', (error) => { console.error('Socket error:', error); });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const getSocket = () => socket;