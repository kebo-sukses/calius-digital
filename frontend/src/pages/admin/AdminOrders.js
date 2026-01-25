import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

const statusColors = {
  success: 'bg-green-500/20 text-green-500',
  pending: 'bg-yellow-500/20 text-yellow-500',
  failed: 'bg-red-500/20 text-red-500',
  cancelled: 'bg-neutral-500/20 text-neutral-500',
  expired: 'bg-neutral-500/20 text-neutral-500',
};

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await adminApi.exportData('orders');
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast({ title: 'Exported', description: `${data.count} orders exported` });
    } catch (error) {
      toast({ title: 'Error', description: 'Export failed', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  const totalRevenue = orders.filter(o => o.status === 'success').reduce((sum, o) => sum + o.gross_amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-neutral-400">{orders.length} total orders • Revenue: {formatPrice(totalRevenue)}</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-white/10 text-white">
          Export
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white font-mono text-sm">{order.order_id}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{order.customer_name}</div>
                  <div className="text-xs text-neutral-500">{order.customer_email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  {order.item_details?.map(item => item.name).join(', ') || '-'}
                </td>
                <td className="px-4 py-3 text-[#FF4500] font-semibold">{formatPrice(order.gross_amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <CreditCard className="mx-auto mb-4" size={48} />
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
