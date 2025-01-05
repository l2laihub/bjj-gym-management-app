import React, { useState, ReactNode } from 'react';
import { NavLink, To } from 'react-router-dom';
import { Users, ShoppingBag, Calendar, Award, BarChart3, Settings, Clock, BookOpen, DollarSign, Trophy, UserPlus, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import SignOutButton from '../auth/SignOutButton';
import { useRoles } from '../../hooks/useRoles';

// Define menu items with role requirements
const menuItems = [
  { to: "/dashboard", icon: BarChart3, text: "Dashboard", requireAdmin: false },
  { to: "/prospects", icon: UserPlus, text: "Prospects", requireAdmin: true },
  { to: "/members", icon: Users, text: "Members", requireAdmin: true },
  { to: "/inventory", icon: ShoppingBag, text: "Inventory", requireAdmin: true },
  { to: "/attendance", icon: Calendar, text: "Attendance", requireAdmin: false },
  { to: "/schedule", icon: Clock, text: "Class Schedule", requireAdmin: false },
  { to: "/promotions", icon: Award, text: "Promotions", requireAdmin: true },
  { to: "/curriculum", icon: BookOpen, text: "Curriculum", requireAdmin: false },
  { to: "/finances", icon: DollarSign, text: "Finances", requireAdmin: true },
  { to: "/tournament-records", icon: Trophy, text: "Tournament Records", requireAdmin: false },
  { to: "/settings", icon: Settings, text: "Settings", requireAdmin: true },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useRoles();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => !item.requireAdmin || isAdmin);

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center lg:hidden z-40 px-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-white">HEVA BJJ</h1>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white",
        "transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        "flex flex-col flex-shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 hidden lg:block">
            <h1 className="text-2xl font-bold text-white">HEVA BJJ</h1>
            <p className="text-gray-400 text-sm">Management System</p>
          </div>
          
          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            {filteredMenuItems.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                icon={<item.icon />}
                text={item.text}
                onClick={toggleSidebar}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  );
};

interface SidebarLinkProps {
  to: To;
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, text, onClick }: SidebarLinkProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "flex items-center px-4 py-2 text-sm rounded-lg",
      "hover:bg-gray-800 transition-colors duration-200",
      isActive ? "bg-gray-800 text-white" : "text-gray-400"
    )}
  >
    <span className="w-5 h-5 mr-3">{icon}</span>
    {text}
  </NavLink>
);
