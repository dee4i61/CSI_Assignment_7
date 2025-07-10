import { useEffect } from "react";
import socket from "../../utils/socket";
import { toast } from "react-hot-toast";

const NotificationListener = () => {
  useEffect(() => {
    socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data);

      if (data.type === "file_received") {
        console.log("data.receive", data.message);
        alert(data.message);
        toast.success(data.message);
      } else if (data.type === "file_sent") {
        console.log("data.send", data.message);
        alert(data.message);
        toast.success(data.message);
      } else {
        toast(data.message);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return null;
};

export default NotificationListener;
