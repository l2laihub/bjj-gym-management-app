import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useRoles } from '../../hooks/useRoles';
import { menuItems } from './menuItems';
import { SidebarLink } from './SidebarLink';
import { SidebarHeader } from './SidebarHeader';
import { MobileHeader } from './MobileHeader';
import SignOutButton from '../auth/SignOutButton';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useRoles();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => !item.requireAdmin || isAdmin);

  return (
    <>
      <MobileHeader isOpen={isOpen} onToggle={toggleSidebar} />

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
          <SidebarHeader />
          
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
}