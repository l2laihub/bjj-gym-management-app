import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogIn, UserPlus } from 'lucide-react';

export const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center">
        <div className="max-w-md text-white p-8">
          <h1 className="text-4xl font-bold mb-4">BJJ Academy Management</h1>
          <p className="text-lg text-indigo-100">
            Track your progress, manage your curriculum, and grow your academy with our comprehensive
            management system.
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium ${
                isSignIn
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium ${
                !isSignIn
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </button>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {isSignIn ? 'Welcome back!' : 'Create your account'}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isSignIn ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </button>

            {isSignIn && (
              <div className="text-sm text-center">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
