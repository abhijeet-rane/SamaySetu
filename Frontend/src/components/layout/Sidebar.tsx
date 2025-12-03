import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiCalendar, 
  FiGrid,
  FiSettings,
  FiX,
  FiClock,
  FiBriefcase
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isAdmin = false }) => {
  const teacherLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/timetable', icon: FiCalendar, label: 'My Timetable' },
    { to: '/dashboard/availability', icon: FiGrid, label: 'Availability' },
    { to: '/dashboard/profile', icon: FiSettings, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/departments', icon: FiBriefcase, label: 'Departments' },
    { to: '/admin/teachers', icon: FiUsers, label: 'Teachers' },
    { to: '/admin/courses', icon: FiBook, label: 'Courses' },
    { to: '/admin/rooms', icon: FiGrid, label: 'Rooms' },
    { to: '/admin/academic-years', icon: FiCalendar, label: 'Academic Years' },
    { to: '/admin/divisions', icon: FiUsers, label: 'Divisions' },
    { to: '/admin/time-slots', icon: FiClock, label: 'Time Slots' },
  ];

  const links = isAdmin ? adminLinks : teacherLinks;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button (Mobile) */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 MIT Academy of Engineering
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
