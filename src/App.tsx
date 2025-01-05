import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { Sidebar } from './components/sidebar'; // Fixed import
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Inventory from './pages/Inventory';
import Attendance from './pages/Attendance';
import Promotions from './pages/Promotions';
import Schedule from './pages/Schedule';
import Curriculum from './pages/Curriculum';
import Finances from './pages/Finances';
import TournamentRecords from './pages/TournamentRecords';
import Prospects from './pages/Prospects';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 flex flex-col min-h-screen">
                    <main className="flex-1 w-full">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Admin-only routes */}
                        <Route path="/members" element={
                          <RequireAuth requireAdmin>
                            <Members />
                          </RequireAuth>
                        } />
                        <Route path="/inventory" element={
                          <RequireAuth requireAdmin>
                            <Inventory />
                          </RequireAuth>
                        } />
                        <Route path="/promotions" element={
                          <RequireAuth requireAdmin>
                            <Promotions />
                          </RequireAuth>
                        } />
                        <Route path="/finances" element={
                          <RequireAuth requireAdmin>
                            <Finances />
                          </RequireAuth>
                        } />
                        <Route path="/prospects" element={
                          <RequireAuth requireAdmin>
                            <Prospects />
                          </RequireAuth>
                        } />
                        
                        {/* Member routes */}
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/curriculum" element={<Curriculum />} />
                        <Route path="/tournament-records" element={<TournamentRecords />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;