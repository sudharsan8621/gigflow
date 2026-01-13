import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead } from '../store/slices/notificationSlice';
import { FiX } from 'react-icons/fi';

const NotificationDropdown = ({ onClose }) => {
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'hired': return '🎉';
      case 'rejected': return '❌';
      case 'new-bid': return '📩';
      default: return '📢';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={18} /></button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-primary-50' : ''}`}>
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                </div>
                {!notification.read && <span className="h-2 w-2 bg-primary-500 rounded-full"></span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;