import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

const AdminTestimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', role: '', company: '', content_id: '', content_en: '', avatar: null, rating: 5
  });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await adminApi.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch testimonials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', company: '', content_id: '', content_en: '', avatar: null, rating: 5 });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, rating: parseInt(form.rating) };
      if (editingId) {
        await adminApi.updateTestimonial(editingId, data);
        toast({ title: 'Success', description: 'Testimonial updated' });
      } else {
        await adminApi.createTestimonial(data);
        toast({ title: 'Success', description: 'Testimonial created' });
      }
      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await adminApi.deleteTestimonial(id);
      toast({ title: 'Deleted', description: 'Testimonial deleted' });
      fetchTestimonials();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-neutral-400">{testimonials.length} testimonials</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.id} className="p-6 rounded-2xl bg-neutral-900 border border-white/10">
            <div className="flex gap-1 mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <p className="text-neutral-300 mb-4 line-clamp-3">"{item.content_id}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center">
                <span className="text-white font-bold">{item.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-white font-medium">{item.name}</div>
                <div className="text-xs text-neutral-500">{item.role}, {item.company}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1 border-white/10 text-white">
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="border-red-500/50 text-red-500">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
              <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
            </div>
            <div><Label>Content (ID)</Label><Textarea value={form.content_id} onChange={(e) => setForm({ ...form, content_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={3} required /></div>
            <div><Label>Content (EN)</Label><Textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={3} required /></div>
            <div><Label>Rating</Label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white">
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
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

export default AdminTestimonials;
