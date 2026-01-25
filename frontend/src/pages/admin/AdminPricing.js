import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

const AdminPricing = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name_id: '', name_en: '', description_id: '', description_en: '',
    price: 0, price_note_id: 'Pembayaran sekali', price_note_en: 'One-time payment',
    features: [], is_popular: false, order: 0
  });
  const [newFeature, setNewFeature] = useState({ text_id: '', text_en: '', included: true });

  useEffect(() => { fetchPricing(); }, []);

  const fetchPricing = async () => {
    try {
      const data = await adminApi.getPricing();
      setPackages(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch pricing', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name_id: '', name_en: '', description_id: '', description_en: '',
      price: 0, price_note_id: 'Pembayaran sekali', price_note_en: 'One-time payment',
      features: [], is_popular: false, order: 0
    });
    setEditingId(null);
  };

  const handleEdit = (pkg) => {
    setForm({ ...pkg });
    setEditingId(pkg.id);
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (!newFeature.text_id || !newFeature.text_en) return;
    setForm({ ...form, features: [...form.features, { ...newFeature }] });
    setNewFeature({ text_id: '', text_en: '', included: true });
  };

  const removeFeature = (index) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: parseInt(form.price), order: parseInt(form.order) };
      if (editingId) {
        await adminApi.updatePricing(editingId, data);
        toast({ title: 'Success', description: 'Pricing updated' });
      } else {
        await adminApi.createPricing(data);
        toast({ title: 'Success', description: 'Pricing created' });
      }
      setDialogOpen(false);
      resetForm();
      fetchPricing();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pricing package?')) return;
    try {
      await adminApi.deletePricing(id);
      toast({ title: 'Deleted', description: 'Pricing deleted' });
      fetchPricing();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Pricing</h1>
          <p className="text-neutral-400">{packages.length} packages</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`p-6 rounded-2xl border ${pkg.is_popular ? 'bg-[#FF4500]/10 border-[#FF4500]/50' : 'bg-neutral-900 border-white/10'}`}>
            {pkg.is_popular && <span className="px-3 py-1 text-xs rounded-full bg-[#FF4500] text-white mb-4 inline-block">Popular</span>}
            <h3 className="text-xl font-bold text-white">{pkg.name_id}</h3>
            <p className="text-sm text-neutral-400 mt-1">{pkg.description_id}</p>
            <div className="text-3xl font-bold text-[#FF4500] my-4">Rp {formatPrice(pkg.price)}</div>
            <ul className="space-y-2 mb-4">
              {pkg.features.slice(0, 4).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {f.included ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-neutral-500" />}
                  <span className={f.included ? 'text-neutral-300' : 'text-neutral-500'}>{f.text_id}</span>
                </li>
              ))}
              {pkg.features.length > 4 && <li className="text-xs text-neutral-500">+{pkg.features.length - 4} more</li>}
            </ul>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)} className="flex-1 border-white/10 text-white">
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)} className="border-red-500/50 text-red-500">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Package' : 'Add Package'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name (ID)</Label><Input value={form.name_id} onChange={(e) => setForm({ ...form, name_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
              <div><Label>Name (EN)</Label><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
            </div>
            <div><Label>Description (ID)</Label><Textarea value={form.description_id} onChange={(e) => setForm({ ...form, description_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} /></div>
            <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Price (Rp)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required /></div>
              <div><Label>Price Note (ID)</Label><Input value={form.price_note_id} onChange={(e) => setForm({ ...form, price_note_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" /></div>
              <div><Label>Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="bg-neutral-800 border-white/10 text-white" /></div>
            </div>
            <label className="flex items-center gap-2"><Switch checked={form.is_popular} onCheckedChange={(v) => setForm({ ...form, is_popular: v })} /><span className="text-neutral-300">Popular (highlight)</span></label>
            
            <div>
              <Label>Features</Label>
              <div className="space-y-2 mt-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/5">
                    {f.included ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                    <span className="flex-1 text-sm text-neutral-300">{f.text_id}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeFeature(i)} className="text-red-500 h-6 w-6 p-0">×</Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={newFeature.text_id} onChange={(e) => setNewFeature({ ...newFeature, text_id: e.target.value })} placeholder="Feature (ID)" className="bg-neutral-800 border-white/10 text-white text-sm" />
                <Input value={newFeature.text_en} onChange={(e) => setNewFeature({ ...newFeature, text_en: e.target.value })} placeholder="Feature (EN)" className="bg-neutral-800 border-white/10 text-white text-sm" />
                <label className="flex items-center gap-1 text-xs text-neutral-400">
                  <input type="checkbox" checked={newFeature.included} onChange={(e) => setNewFeature({ ...newFeature, included: e.target.checked })} />
                  Included
                </label>
                <Button type="button" size="sm" onClick={addFeature} className="bg-white/10">Add</Button>
              </div>
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

export default AdminPricing;
