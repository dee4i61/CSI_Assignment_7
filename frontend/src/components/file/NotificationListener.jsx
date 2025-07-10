import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { toast } from "react-hot-toast";

const NotificationListener = ({ onNotification }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      // Store the notification in memory
      setNotifications((prev) => [...prev, data]);

      // Emit it to parent if needed
      if (onNotification) onNotification(data);

      // Toast feedback
      if (data.type === "file_received" || data.type === "file_sent") {
        toast.success(data.message);
      } else if (data.type === "error") {
        console.error("❌ Error notification:", data.message);
        toast.error(data.message);
      } else {
        toast(data.message);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return null; // You can optionally render notification count, etc.
};

export default NotificationListener;
