
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import NewNoteFlowModal from '../sessions/NewNoteFlowModal.tsx';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  const navItems = [
    { to: "/sessions", name: "Sessions", icon: "messageSquare" as const },
    { to: "/clients", name: "Clients", icon: "users" as const },
    { to: "/calendar", name: "Calendar", icon: "calendar" as const },
    { to: "/templates", name: "Templates", icon: "fileText" as const },
    { to: "/compliance-checker", name: "Compliance Checker", icon: "checkSquare" as const },
    { to: "/practice-settings", name: "Practice settings", icon: "settings" as const },
  ];

  const handleLogout = () => {
    setIsSignOutConfirmOpen(false);
    logout();
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-200 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-800 tracking-tighter">Upheal</span>
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
            </ul>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="font-semibold text-gray-600">VR</span>
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.displayName || 'Vishnu Ram'}</p>
              <button onClick={() => setIsSignOutConfirmOpen(true)} className="text-xs text-gray-500 hover:underline">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
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
    </>
  );
};

export default Sidebar;
