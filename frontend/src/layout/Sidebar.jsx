import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Upload,
  Download,
  Users,
  History,
  Settings,
  Shield,
  HelpCircle,
  FileText,
  Activity,
  Cloud,
  Lock,
  Zap,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const [expandedSection, setExpandedSection] = useState("main");

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, badge: null, link: "/" },
    {
      id: "upload",
      label: "Upload Files",
      icon: Upload,
      badge: null,
      link: "/upload",
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: Download,
      link: "/downloads",
    },

    { id: "users", label: "Users", icon: Users, badge: null, link: "/users" },
    {
      id: "history",
      label: "Transfer History",
      icon: History,
      badge: null,
      link: "/history",
    },
  ];

  const MenuItem = ({ item }) => (
    <Link
      to={item.link}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
    >
      <div className="flex items-center space-x-3">
        <item.icon
          size={18}
          className="text-gray-500 group-hover:text-gray-700"
        />
        <span className={`font-medium ${isOpen ? "block" : "hidden"}`}>
          {item.label}
        </span>
      </div>
      {item.badge && isOpen && (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
          {item.badge}
        </span>
      )}
    </Link>
  );

  const SectionHeader = ({ title, section, items }) => (
    <div className="space-y-2">
      {isOpen && (
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          <span>{title}</span>
          {expandedSection === section ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      )}
      {(!isOpen || expandedSection === section) && (
        <div className="space-y-1">
          {items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full"}
        md:w-64 md:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <SectionHeader
            title="Main Menu"
            section="main"
            items={mainMenuItems}
          />
        </nav>
        <div className="px-4 py-3 border-t border-gray-200">
          <div
            className={`flex items-center space-x-3 ${
              isOpen ? "justify-start" : "justify-center"
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isOpen && (
              <div>
                <p className="text-sm font-medium text-gray-700">Connected</p>
                <p className="text-xs text-gray-500">
                  Secure connection active
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
