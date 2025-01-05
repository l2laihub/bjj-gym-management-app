import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center lg:hidden z-40 px-4">
      <button 
        onClick={onToggle}
        className="p-2 hover:bg-gray-800 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>
      <div className="ml-4">
        <h1 className="text-xl font-bold text-white">HEVA BJJ</h1>
      </div>
    </div>
  );
}