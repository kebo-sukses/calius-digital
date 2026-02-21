import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, FileText, Image, MessageSquare, Users, Package,
  CreditCard, Mail, Settings, LogOut, Menu, X, ChevronDown, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/services', icon: Briefcase, label: 'Services' },
  { path: '/admin/templates', icon: Package, label: 'Templates' },
  { path: '/admin/portfolio', icon: Image, label: 'Portfolio' },
  { path: '/admin/blog', icon: FileText, label: 'Blog' },
  { path: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { path: '/admin/pricing', icon: CreditCard, label: 'Pricing', adminOnly: true },
  { path: '/admin/contacts', icon: Mail, label: 'Messages' },
  { path: '/admin/orders', icon: CreditCard, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users', adminOnly: true },
  { path: '/admin/settings', icon: Settings, label: 'Settings', adminOnly: true },
];

const AdminLayout = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const filteredMenu = menuItems.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-white/10 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-white font-bold">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-400">
              <X size={20} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenu.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#FF4500] text-white'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                <span className="text-white font-bold">{user.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="text-white font-medium">{user.username}</div>
                <div className="text-xs text-neutral-500 capitalize">{user.role}</div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-neutral-400 hover:text-white">
                View Site →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
