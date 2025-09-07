
import React, { useRef, useEffect } from 'react';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  children: React.ReactNode;
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, onClose, position, children, className = '' }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 bg-white rounded-lg shadow-xl border border-gray-100 p-2 min-w-[200px] ${className}`}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
