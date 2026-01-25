import React, { useState, useEffect } from 'react';
import { adminApi, uploadToCloudinary } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, ExternalLink } from 'lucide-react';

const AdminPortfolio = () => {
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', client: '', category: 'company-profile', description_id: '', description_en: '',
    image: '', images: [], url: '', technologies: [], year: new Date().getFullYear(), is_featured: false
  });

  useEffect(() => { fetchPortfolio(); }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await adminApi.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch portfolio', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '', client: '', category: 'company-profile', description_id: '', description_en: '',
      image: '', images: [], url: '', technologies: [], year: new Date().getFullYear(), is_featured: false
    });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'portfolio');
      setForm({ ...form, image: result.secure_url });
      toast({ title: 'Success', description: 'Image uploaded' });
    } catch (error) {
      toast({ title: 'Error', description: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        technologies: typeof form.technologies === 'string' ? form.technologies.split(',').map(t => t.trim()) : form.technologies,
        year: parseInt(form.year)
      };

      if (editingId) {
        await adminApi.updatePortfolio(editingId, data);
        toast({ title: 'Success', description: 'Portfolio updated' });
      } else {
        await adminApi.createPortfolio(data);
        toast({ title: 'Success', description: 'Portfolio created' });
      }
      setDialogOpen(false);
      resetForm();
      fetchPortfolio();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await adminApi.deletePortfolio(id);
      toast({ title: 'Deleted', description: 'Portfolio deleted' });
      fetchPortfolio();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-neutral-400">{portfolio.length} projects</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
            <div className="h-40 bg-neutral-800">
              {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-neutral-500">{item.client} • {item.year}</p>
                </div>
                {item.is_featured && <span className="px-2 py-1 text-xs bg-[#FF4500]/20 text-[#FF4500] rounded-full">Featured</span>}
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1 border-white/10 text-white">
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="border-white/10 text-white"><ExternalLink size={14} /></Button>
                  </a>
                )}
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="border-red-500/50 text-red-500">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
              <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white">
                  <option value="company-profile">Company Profile</option>
                  <option value="e-commerce">E-Commerce</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="bg-neutral-800 border-white/10 text-white" /></div>
            </div>
            <div><Label>Description (ID)</Label><Textarea value={form.description_id} onChange={(e) => setForm({ ...form, description_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} /></div>
            <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} /></div>
            <div><Label>Technologies (comma separated)</Label><Input value={Array.isArray(form.technologies) ? form.technologies.join(', ') : form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="bg-neutral-800 border-white/10 text-white" /></div>
            <div><Label>Project URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="bg-neutral-800 border-white/10 text-white" /></div>
            <div><Label>Image</Label>
              <div className="flex gap-4 items-center mt-2">
                {form.image && <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10">
                  <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="or Image URL" className="flex-1 bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>
            <label className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /><span className="text-neutral-300">Featured</span></label>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-white/10 text-white">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#FF4500] hover:bg-[#FF5722]">{editingId ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortfolio;
