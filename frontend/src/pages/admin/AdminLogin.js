import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast({ title: 'Login berhasil', description: 'Selamat datang di Admin Panel' });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Login gagal',
        description: error.response?.data?.detail || 'Username atau password salah',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-neutral-400 mt-2">Calius Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-neutral-900 border border-white/10">
          <div>
            <Label htmlFor="username" className="text-neutral-300">Username</Label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <Input
                id="username"
                data-testid="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-neutral-800 border-white/10 text-white pl-10 h-12"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-neutral-300">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <Input
                id="password"
                type="password"
                data-testid="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-white/10 text-white pl-10 h-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            data-testid="admin-login-btn"
            disabled={loading}
            className="w-full h-12 bg-[#FF4500] hover:bg-[#FF5722] text-white font-semibold"
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        
      </div>
    </div>
  );
};

export default AdminLogin;

