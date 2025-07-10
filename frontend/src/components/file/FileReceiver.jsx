import { useEffect } from "react";
import socket from "../../utils/socket";

const FileReceiver = () => {
  useEffect(() => {
    socket.on("receive_file", ({ fileName, fileContent, senderId }) => {
      console.log(`📥 File received from ${senderId}: ${fileName}`);

      const blob = new Blob([new Uint8Array(fileContent)]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    return () => {
      socket.off("receive_file");
    };
  }, []);

  return null;
};

export default FileReceiver;
