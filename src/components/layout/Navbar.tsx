import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../lib/utils';
import {
  Code2, Moon, Sun, Menu, X, User, LogOut, LayoutDashboard,
  MessageSquare, Trophy, Building2, Brain, ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/problems', label: 'Problems', icon: Code2 },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const AUTH_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/behavioral', label: 'Behavioral', icon: MessageSquare },
  { to: '/ai-chat', label: 'AI Coach', icon: Brain },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">
              Intelli<span className="gradient-text">View</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={cn('nav-link px-4 py-2 rounded-lg',
                location.pathname === to && 'active bg-brand-50 dark:bg-brand-950/30'
              )}>
                {label}
              </Link>
            ))}
            {isAuthenticated && AUTH_NAV.map(({ to, label }) => (
              <Link key={to} to={to} className={cn('nav-link px-4 py-2 rounded-lg',
                location.pathname === to && 'active bg-brand-50 dark:bg-brand-950/30'
              )}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-brand-600" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user?.fullName || 'User'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-surface-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl animate-slide-down z-50">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-700">
                      <p className="text-sm font-semibold">{user?.fullName}</p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <hr className="my-1 border-zinc-100 dark:border-zinc-700" />
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm !px-5 !py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-surface-900 border-t border-zinc-200 dark:border-zinc-800 animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                location.pathname === to ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              )}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            {isAuthenticated && AUTH_NAV.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                location.pathname === to ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              )}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            <hr className="border-zinc-200 dark:border-zinc-700" />
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-zinc-500">Theme</span>
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-brand-600" />}
              </button>
            </div>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary flex-1 text-center text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary flex-1 text-center text-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
