import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberCheckIn from './pages/MemberCheckIn';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import Inventory from './pages/Inventory';
import Attendance from './pages/Attendance';
import Promotions from './pages/Promotions';
import Schedule from './pages/Schedule';
import Curriculum from './pages/Curriculum';
import Finances from './pages/Finances';
import TournamentRecords from './pages/TournamentRecords';
import Prospects from './pages/Prospects';
import Settings from './pages/Settings';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
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
                          {/* Redirect based on role */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          
                          {/* Admin Dashboard */}
                          <Route path="/dashboard" element={
                            <RequireAuth requireAdmin>
                              <Dashboard />
                            </RequireAuth>
                          } />
                          
                          {/* Member Dashboard */}
                          <Route path="/member/dashboard" element={<MemberDashboard />} />
                          <Route path="/member/check-in" element={<MemberCheckIn />} />
                          
                          {/* Admin-only routes */}
                          <Route path="/members" element={
                            <RequireAuth requireAdmin>
                              <Members />
                            </RequireAuth>
                          } />
                          <Route path="/members/:id" element={
                            <RequireAuth requireAdmin>
                              <MemberProfile />
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
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;