

import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Toast from '../ui/Toast';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import NewNoteFlowModal from '../sessions/NewNoteFlowModal.tsx';
import ContextMenu from '../ui/ContextMenu';
import ComingSoonModal from '../ui/ComingSoonModal';
import { ICONS } from '../../constants';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  const [comingSoonModalInfo, setComingSoonModalInfo] = useState<{
    isOpen: boolean;
    feature: {
      title: string;
      icon: keyof typeof ICONS;
      message: string;
      note: string;
    } | null;
  }>({ isOpen: false, feature: null });

  const navItems = [
    { to: "/home", name: "Home", icon: "home" as const },
    { to: "/sessions", name: "Sessions", icon: "fileText" as const },
    { to: "/clients", name: "Clients", icon: "users" as const },
  ];

  const comingSoonFeatures = [
    { name: "Calendar", icon: "calendar" as const, message: "Our calendar is on its way—soon you’ll be able to schedule and organize with ease!", note: "We’re building this with care so your workflow gets even smoother. Stay tuned for updates!" },
    { name: "Templates", icon: "copy" as const, message: "Customizable templates are coming soon to speed up your note-taking process.", note: "Spend less time on documentation and more time with your clients. We're excited to bring this to you!" },
    { name: "Compliance Checker", icon: "checkSquare" as const, message: "An automated compliance checker is in development to help you stay on top of regulations.", note: "Peace of mind is just around the corner. We're working hard to ensure everything is perfect." },
    { name: "Practice settings", icon: "settings" as const, message: "Advanced practice settings are being developed to give you more control over your workspace.", note: "We're crafting powerful new ways for you to manage your practice details, billing, and more." },
  ];

  const handleLogout = () => {
    setIsSignOutConfirmOpen(false);
    logout();
  };

  const handleNewNoteClick = () => {
    setShowToast(true);
  };

  const handleSettingsMenuToggle = () => {
      if (!isSettingsMenuOpen && settingsBtnRef.current) {
          const rect = settingsBtnRef.current.getBoundingClientRect();
          const menuHeight = 130; // Estimated height of the context menu
          setMenuPosition({ top: rect.top - menuHeight, left: rect.left });
      }
      setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  const handleComingSoonClick = (feature: typeof comingSoonFeatures[0]) => {
    setComingSoonModalInfo({
      isOpen: true,
      feature: {
        title: feature.name,
        icon: feature.icon,
        message: feature.message,
        note: feature.note,
      },
    });
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-200 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-800 tracking-tighter">MindScribe</span>
          </div>
        </div>
        <div className="p-4 flex-grow">
          <Button onClick={() => setIsNewNoteModalOpen(true)} className="w-full mb-4 flex items-center justify-center gap-2">
            <Icon name="plus" className="h-5 w-5" />
            New note
          </Button>
          <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon name="search" className="h-5 w-5 text-gray-400" />
              </span>
              <input 
                  type="text" 
                  placeholder="Search all clients..." 
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light text-gray-800"
              />
          </div>
          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 my-1 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-light text-primary-dark'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
              {comingSoonFeatures.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleComingSoonClick(item)}
                    className="flex items-center gap-3 px-3 py-2 my-1 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 w-full text-left"
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
              ref={settingsBtnRef}
              onClick={handleSettingsMenuToggle}
              className="flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-light"
              aria-haspopup="true"
              aria-expanded={isSettingsMenuOpen}
            >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="font-semibold text-gray-600">VR</span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm">{user?.displayName || 'Vishnu Ram'}</p>
              <p className="text-xs text-gray-500">Profile & settings</p>
            </div>
             <Icon name="chevronDown" className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isSettingsMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      <ContextMenu 
        isOpen={isSettingsMenuOpen} 
        onClose={() => setIsSettingsMenuOpen(false)} 
        position={menuPosition}
        className="!w-60"
      >
        <div className="py-1">
          <NavLink to="/settings" onClick={() => setIsSettingsMenuOpen(false)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <Icon name="settings" className="h-5 w-5 text-gray-500" /> Settings
          </NavLink>
        </div>
        <div className="border-t border-gray-100 my-1"></div>
        <div className="py-1">
          <button
            onClick={() => {
              setIsSettingsMenuOpen(false);
              setIsSignOutConfirmOpen(true);
            }}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            <Icon name="logOut" className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </ContextMenu>
      
      <Toast message="Will be available soon" show={showToast} onClose={() => setShowToast(false)} />
      
      <ConfirmationDialog
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Sign Out"
        message="Are you sure you want to sign out?"
      />
      <NewNoteFlowModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
      />
      
      <ComingSoonModal
        isOpen={comingSoonModalInfo.isOpen}
        onClose={() => setComingSoonModalInfo({ isOpen: false, feature: null })}
        feature={comingSoonModalInfo.feature}
      />
    </>
  );
};

export default Sidebar;