import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Layers,
  UploadCloud,
  ShieldCheck,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rgukt-800 to-rgukt-600 flex items-center justify-center text-white shadow-md shadow-rgukt-900/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">College Project Hub</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-rgukt-700 bg-rgukt-50 rounded-full border border-rgukt-200">
                  RGUKT SKLM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Dept. of Computer Science & Engineering
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-rgukt-50 text-rgukt-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Showcase</span>
            </Link>

            <Link
              to="/upload"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'bg-rgukt-50 text-rgukt-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Project</span>
            </Link>

            <Link
              to="/teacher"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith('/teacher')
                  ? 'bg-rgukt-50 text-rgukt-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Teacher Portal</span>
            </Link>
          </div>

          {/* Right Section: Auth or Logged In User */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-rgukt-100 text-rgukt-800 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-800 max-w-[140px] truncate">{user.name}</p>
                  <span className="inline-block px-1.5 py-0.2 text-[10px] font-medium rounded bg-rgukt-100 text-rgukt-800">
                    {role === 'TEACHER' ? 'Faculty' : 'Team Lead'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rgukt-800 text-white text-sm font-medium hover:bg-rgukt-900 shadow-sm transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Portal Login</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {loginDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setLoginDropdownOpen(false)}
                  >
                    <Link
                      to="/login/teacher"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-rgukt-50 hover:text-rgukt-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-rgukt-600" />
                      <div>
                        <div className="font-medium">Teacher Portal</div>
                        <div className="text-xs text-slate-400">Faculty evaluation & management</div>
                      </div>
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <Link
                      to="/login/team-lead"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-rgukt-50 hover:text-rgukt-800 transition-colors"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Team Lead Portal</div>
                        <div className="text-xs text-slate-400">Submit & view your team project</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Showcase / All Projects
          </Link>
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Upload Project
          </Link>
          <Link
            to="/teacher"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Teacher Portal
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  Signed in as <span className="font-semibold text-slate-800">{user.name}</span> ({user.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login/teacher"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 text-sm font-medium bg-rgukt-50 text-rgukt-700 rounded-lg border border-rgukt-200"
                >
                  Teacher Login
                </Link>
                <Link
                  to="/login/team-lead"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
                >
                  Team Lead Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
