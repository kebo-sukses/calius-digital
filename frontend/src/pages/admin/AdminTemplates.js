import React, { useState, useEffect } from 'react';
import { adminApi, uploadToCloudinary } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

const AdminTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    slug: '', name: '', category: 'business', price: 0, sale_price: null,
    description_id: '', description_en: '', features: [], technologies: [],
    demo_url: '', image: '', images: [], is_featured: false, is_bestseller: false, is_new: false
  });

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      const data = await adminApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch templates', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      slug: '', name: '', category: 'business', price: 0, sale_price: null,
      description_id: '', description_en: '', features: [], technologies: [],
      demo_url: '', image: '', images: [], is_featured: false, is_bestseller: false, is_new: false
    });
    setEditingId(null);
  };

  const handleEdit = (template) => {
    setForm({ ...template, sale_price: template.sale_price || null });
    setEditingId(template.id);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'templates');
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
        features: typeof form.features === 'string' ? form.features.split(',').map(f => f.trim()) : form.features,
        technologies: typeof form.technologies === 'string' ? form.technologies.split(',').map(t => t.trim()) : form.technologies,
        price: parseInt(form.price),
        sale_price: form.sale_price ? parseInt(form.sale_price) : null
      };

      if (editingId) {
        await adminApi.updateTemplate(editingId, data);
        toast({ title: 'Success', description: 'Template updated' });
      } else {
        await adminApi.createTemplate(data);
        toast({ title: 'Success', description: 'Template created' });
      }

      setDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await adminApi.deleteTemplate(id);
      toast({ title: 'Deleted', description: 'Template deleted' });
      fetchTemplates();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-neutral-400">{templates.length} templates</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden">
            <div className="h-40 bg-neutral-800">
              {template.image && <img src={template.image} alt={template.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{template.name}</h3>
                  <p className="text-xs text-neutral-500">{template.category}</p>
                </div>
                <span className="text-[#FF4500] font-bold">Rp {formatPrice(template.sale_price || template.price)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(template)} className="flex-1 border-white/10 text-white">
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(template.id)} className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Template' : 'Add Template'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="bg-neutral-800 border-white/10 text-white" required />
              </div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white">
                  <option value="business">Business</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (Rp)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required />
              </div>
              <div>
                <Label>Sale Price (optional)</Label>
                <Input type="number" value={form.sale_price || ''} onChange={(e) => setForm({ ...form, sale_price: e.target.value || null })} className="bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>

            <div>
              <Label>Description (ID)</Label>
              <Textarea value={form.description_id} onChange={(e) => setForm({ ...form, description_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} />
            </div>

            <div>
              <Label>Description (EN)</Label>
              <Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Features (comma separated)</Label>
                <Input value={Array.isArray(form.features) ? form.features.join(', ') : form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
              </div>
              <div>
                <Label>Technologies (comma separated)</Label>
                <Input value={Array.isArray(form.technologies) ? form.technologies.join(', ') : form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>

            <div>
              <Label>Demo URL</Label>
              <Input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
            </div>

            <div>
              <Label>Image</Label>
              <div className="flex gap-4 items-center mt-2">
                {form.image && <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10">
                  <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <span className="text-neutral-500 text-sm">or</span>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="flex-1 bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                <span className="text-neutral-300">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={form.is_bestseller} onCheckedChange={(v) => setForm({ ...form, is_bestseller: v })} />
                <span className="text-neutral-300">Bestseller</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={form.is_new} onCheckedChange={(v) => setForm({ ...form, is_new: v })} />
                <span className="text-neutral-300">New</span>
              </label>
            </div>

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

export default AdminTemplates;
