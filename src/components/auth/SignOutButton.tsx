import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign out logic here
    navigate('/signin');
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
    >
      <LogOut />
      <span>Sign out</span>
    </button>
  );
};

export default SignOutButton;