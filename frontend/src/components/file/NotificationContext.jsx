import { createContext, useContext, useState, useEffect } from "react";
import socket from "../../utils/socket";
import { toast } from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const LOCAL_STORAGE_KEY = "notification_history";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("⚠️ Failed to load notifications from localStorage", err);
      return [];
    }
  });

  useEffect(() => {
    socket.on("notification", (data) => {
      console.log("New notification received:", data);
      setNotifications((prev) => {
        const updated = [...prev, data];

        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error("❌ Failed to save notifications to localStorage", err);
        }

        return updated;
      });

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

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
