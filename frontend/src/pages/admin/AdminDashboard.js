import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';
import { Package, Image, FileText, MessageSquare, Mail, CreditCard, Users, TrendingUp } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { label: 'Templates', value: stats.templates, icon: Package, color: 'from-blue-500 to-blue-600', link: '/admin/templates' },
    { label: 'Portfolio', value: stats.portfolio, icon: Image, color: 'from-purple-500 to-purple-600', link: '/admin/portfolio' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, color: 'from-green-500 to-green-600', link: '/admin/blog' },
    { label: 'Messages', value: stats.contacts, badge: stats.unread_contacts, icon: Mail, color: 'from-yellow-500 to-yellow-600', link: '/admin/contacts' },
    { label: 'Orders', value: stats.orders, icon: CreditCard, color: 'from-pink-500 to-pink-600', link: '/admin/orders' },
    { label: 'Revenue', value: formatPrice(stats.total_revenue), icon: TrendingUp, color: 'from-[#FF4500] to-[#FF6B35]', link: '/admin/orders' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1">Welcome to Calius Digital Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="relative p-6 rounded-2xl bg-neutral-900 border border-white/10 hover:border-white/20 transition-colors group"
          >
            <div className={`absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="text-white" size={24} />
            </div>
            {stat.badge > 0 && (
              <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {stat.badge}
              </span>
            )}
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-neutral-400">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/templates" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
              <Package className="mx-auto mb-2 text-[#FF4500]" size={24} />
              <span className="text-sm text-neutral-300">Add Template</span>
            </Link>
            <Link to="/admin/blog" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
              <FileText className="mx-auto mb-2 text-[#FF4500]" size={24} />
              <span className="text-sm text-neutral-300">Write Blog</span>
            </Link>
            <Link to="/admin/portfolio" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
              <Image className="mx-auto mb-2 text-[#FF4500]" size={24} />
              <span className="text-sm text-neutral-300">Add Project</span>
            </Link>
            <Link to="/admin/contacts" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
              <Mail className="mx-auto mb-2 text-[#FF4500]" size={24} />
              <span className="text-sm text-neutral-300">View Messages</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CreditCard className="text-green-500" size={18} />
              </div>
              <div>
                <div className="text-white text-sm">{stats?.successful_orders || 0} successful orders</div>
                <div className="text-neutral-500 text-xs">Total revenue: {formatPrice(stats?.total_revenue || 0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Mail className="text-yellow-500" size={18} />
              </div>
              <div>
                <div className="text-white text-sm">{stats?.unread_contacts || 0} unread messages</div>
                <div className="text-neutral-500 text-xs">From contact form</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
