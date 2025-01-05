import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

export function SidebarLink({ icon, text, to, onClick }: SidebarLinkProps) {
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
}