import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Calendar, Award, BarChart3, Settings, Clock, BookOpen, DollarSign, Trophy, UserPlus, Menu, X, Home } from 'lucide-react';
import { cn } from '../utils/cn';
import SignOutButton from './auth/SignOutButton';
import { useRoles } from '../hooks/useRoles';

// Define menu items with role requirements and database integration status
const menuItems = [
  // Admin-only items
  { to: "/dashboard", icon: BarChart3, text: "Admin Dashboard", requireAdmin: true, dbIntegrated: true },
  { to: "/prospects", icon: UserPlus, text: "Prospects", requireAdmin: true, dbIntegrated: true },
  { to: "/members", icon: Users, text: "Members", requireAdmin: true, dbIntegrated: true },
  { to: "/inventory", icon: ShoppingBag, text: "Inventory", requireAdmin: true, dbIntegrated: false },
  { to: "/promotions", icon: Award, text: "Promotions", requireAdmin: true, dbIntegrated: false },
  { to: "/finances", icon: DollarSign, text: "Finances", requireAdmin: true, dbIntegrated: true },
  
  // Member-only items
  { to: "/member/dashboard", icon: Home, text: "Member Dashboard", requireAdmin: false, memberOnly: true, dbIntegrated: true },
  { to: "/member/check-in", icon: Clock, text: "Check In", requireAdmin: false, memberOnly: true, dbIntegrated: false },
  
  // Shared items (accessible by both admin and members)
  { to: "/attendance", icon: Calendar, text: "Attendance", requireAdmin: false, dbIntegrated: false },
  { to: "/schedule", icon: Clock, text: "Class Schedule", requireAdmin: false, dbIntegrated: false },
  { to: "/curriculum", icon: BookOpen, text: "Curriculum", requireAdmin: false, dbIntegrated: true },
  { to: "/tournament-records", icon: Trophy, text: "Tournament Records", requireAdmin: false, dbIntegrated: false },
  { to: "/settings", icon: Settings, text: "Settings", requireAdmin: false, dbIntegrated: true },
];

// SidebarLink component
const SidebarLink = ({ to, icon, text, onClick }: { to: string; icon: React.ReactNode; text: string; onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
          isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-800"
        )
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, isMember } = useRoles();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Redirect regular members to member dashboard if they try to access admin dashboard
  if (!isAdmin && window.location.pathname === '/dashboard') {
    navigate('/member/dashboard');
  }

  // Filter menu items based on user role and database integration status
  const filteredMenuItems = menuItems.filter(item => {
    // Only show items that are integrated with the database
    if (!item.dbIntegrated) return false;
    
    // Admin can see all non-member-only items
    if (isAdmin && !item.memberOnly) return true;
    
    // Members can see member-only items and shared items
    if (isMember) {
      return !item.requireAdmin;
    }
    
    return false;
  });

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