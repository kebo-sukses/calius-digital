import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Shield, Edit } from 'lucide-react';

const AdminUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'editor' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createUser(form);
      toast({ title: 'Success', description: 'User created' });
      setDialogOpen(false);
      setForm({ username: '', email: '', password: '', role: 'editor' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      toast({ title: 'Deleted', description: 'User deleted' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await adminApi.updateUser(user.id, { is_active: !user.is_active });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-neutral-400">{users.length} users</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add User
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                      <span className="text-white font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.username}</div>
                      <div className="text-xs text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-[#FF4500]/20 text-[#FF4500]' : 'bg-blue-500/20 text-blue-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {user.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500 text-sm">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.id !== currentUser.id && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleToggleActive(user)} className="border-white/10 text-white">
                          {user.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)} className="border-red-500/50 text-red-500">
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required />
            </div>
            <div>
              <Label>Role</Label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white">
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-white/10 text-white">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#FF4500] hover:bg-[#FF5722]">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
