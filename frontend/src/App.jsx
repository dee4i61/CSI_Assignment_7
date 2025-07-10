import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import DashboardLayout from "./layout/DashboardLayout";
import FileUploader from "./components/file/FileUploader";
import TransferHistory from "./components/file/TransferHistory";
import UserList from "./components/user/UserList";
import LoginPage from "./components/auth/Login";
import Register from "./components/auth/Register";
import socket from "./utils/socket";
import FileReceiver from "./components/file/FileReceiver";
import Profile from "./components/auth/Profile";
import DownloadHistory from "./components/file/DownloadHistory";
import NotificationListener from "./components/file/NotificationListener";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  // console.log("userId", userId);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (userId) {
      socket.emit("identify", userId);
      console.log("📡 Identifying user to socket:", userId);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        <FileReceiver />
        <NotificationListener />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/upload" element={<FileUploader />} />
          <Route path="/downloads" element={<DownloadHistory />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/history" element={<TransferHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
