import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('/'); // Assume Socket.IO server is at root

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('file:received', (data) => {
      const notification = {
        id: Date.now(),
        message: `New file received: ${data.fileName} from ${data.senderId}`,
      };
      setNotifications((prev) => [notification, ...prev]);
      toast.success(notification.message);
    });

    return () => {
      socket.off('file:received');
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-2 mb-2 rounded shadow"
          >
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;