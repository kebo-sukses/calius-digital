import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Pencil, Trash2, Check, X, ExternalLink,
  Building2, ShoppingCart, Rocket, Code, FileText, Image, 
  Utensils, Briefcase, Globe, Smartphone, Database, Server,
  Layout, Layers, PenTool, Camera, Monitor, Zap
} from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

// Extended icon mapping
const iconMap = {
  Building2: { icon: Building2, label: 'Building (Company Profile)' },
  ShoppingCart: { icon: ShoppingCart, label: 'Shopping Cart (E-Commerce)' },
  Rocket: { icon: Rocket, label: 'Rocket (Startup/Launch)' },
  Layout: { icon: Layout, label: 'Layout (Landing Page)' },
  Code: { icon: Code, label: 'Code (Custom Development)' },
  FileText: { icon: FileText, label: 'File Text (Blog/Content)' },
  Image: { icon: Image, label: 'Image (Portfolio)' },
  Utensils: { icon: Utensils, label: 'Utensils (Restaurant)' },
  Briefcase: { icon: Briefcase, label: 'Briefcase (Business)' },
  Globe: { icon: Globe, label: 'Globe (Multi-language)' },
  Smartphone: { icon: Smartphone, label: 'Smartphone (Mobile App)' },
  Database: { icon: Database, label: 'Database (System)' },
  Server: { icon: Server, label: 'Server (Backend)' },
  Layers: { icon: Layers, label: 'Layers (Multi-page)' },
  PenTool: { icon: PenTool, label: 'Pen Tool (Creative)' },
  Camera: { icon: Camera, label: 'Camera (Photography)' },
  Monitor: { icon: Monitor, label: 'Monitor (Dashboard)' },
  Zap: { icon: Zap, label: 'Zap (Fast/Performance)' },
};

// Template categories for linking
const templateCategories = [
  { value: '', label: 'No Template Link' },
  { value: 'business', label: 'Business Templates' },
  { value: 'ecommerce', label: 'E-Commerce Templates' },
  { value: 'portfolio', label: 'Portfolio Templates' },
  { value: 'landing-page', label: 'Landing Page Templates' },
  { value: 'restaurant', label: 'Restaurant Templates' },
  { value: 'blog', label: 'Blog Templates' },
  { value: 'creative', label: 'Creative Templates' },
];

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    slug: '',
    name_id: '',
    name_en: '',
    description_id: '',
    description_en: '',
    icon: 'Building2',
    features: [],
    included_features: [],
    price_start: 0,
    image: '',
    order: 0,
    template_category: ''
  });
  const [newFeature, setNewFeature] = useState({ text_id: '', text_en: '', included: true });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const data = await adminApi.getServices();
      setServices(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      slug: '',
      name_id: '',
      name_en: '',
      description_id: '',
      description_en: '',
      icon: 'Building2',
      features: [],
      included_features: [],
      price_start: 0,
      image: '',
      order: 0,
      template_category: ''
    });
    setEditingId(null);
    setNewFeature({ text_id: '', text_en: '', included: true });
  };

  const handleEdit = (service) => {
    setForm({
      slug: service.slug || '',
      name_id: service.name_id || '',
      name_en: service.name_en || '',
      description_id: service.description_id || '',
      description_en: service.description_en || '',
      icon: service.icon || 'Building2',
      features: service.features || [],
      included_features: service.included_features || [],
      price_start: service.price_start || 0,
      image: service.image || '',
      order: service.order || 0,
      template_category: service.template_category || ''
    });
    setEditingId(service.id);
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (!newFeature.text_id.trim() || !newFeature.text_en.trim()) {
      toast({ title: 'Error', description: 'Please fill both ID and EN text', variant: 'destructive' });
      return;
    }
    setForm({ 
      ...form, 
      included_features: [...form.included_features, { ...newFeature }],
      features: [...form.features, newFeature.text_en]
    });
    setNewFeature({ text_id: '', text_en: '', included: true });
  };

  const removeFeature = (index) => {
    setForm({ 
      ...form, 
      included_features: form.included_features.filter((_, i) => i !== index),
      features: form.features.filter((_, i) => i !== index)
    });
  };

  const toggleFeatureIncluded = (index) => {
    const updated = [...form.included_features];
    updated[index] = { ...updated[index], included: !updated[index].included };
    setForm({ ...form, included_features: updated });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value) => {
    setForm({
      ...form,
      name_en: value,
      slug: !editingId ? generateSlug(value) : form.slug
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price_start: parseInt(form.price_start),
        order: parseInt(form.order)
      };
      
      if (editingId) {
        await adminApi.updateService(editingId, data);
        toast({ title: 'Success', description: 'Service updated successfully' });
      } else {
        await adminApi.createService(data);
        toast({ title: 'Success', description: 'Service created successfully' });
      }
      setDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.detail || 'Failed to save service', 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await adminApi.deleteService(id);
      toast({ title: 'Deleted', description: 'Service deleted successfully' });
      fetchServices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="text-neutral-400">{services.length} services available</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setDialogOpen(true); }} 
          className="bg-[#FF4500] hover:bg-[#FF5722]"
        >
          <Plus size={18} className="mr-2" /> Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconData = iconMap[service.icon] || iconMap.Building2;
          const IconComponent = IconData.icon;
          const linkedCategory = templateCategories.find(c => c.value === service.template_category);
          
          return (
            <div 
              key={service.id} 
              className="p-6 rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF4500] to-[#FF6B35] flex items-center justify-center shadow-lg shadow-[#FF4500]/20">
                  <IconComponent size={28} className="text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-neutral-400">
                    #{service.order}
                  </span>
                </div>
              </div>
              
              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF4500] transition-colors">
                {service.name_id}
              </h3>
              <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{service.description_id}</p>
              
              {/* Price */}
              <div className="text-2xl font-bold text-[#FF4500] mb-4">
                Rp {formatPrice(service.price_start)}
                <span className="text-sm font-normal text-neutral-500 ml-1">mulai</span>
              </div>
              
              {/* Features Preview */}
              <div className="space-y-2 mb-4">
                {(service.included_features?.length > 0 
                  ? service.included_features 
                  : service.features?.map(f => ({ text_id: f, included: true })) || []
                ).slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {feature.included !== false ? (
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-neutral-600 flex-shrink-0" />
                    )}
                    <span className={feature.included !== false ? 'text-neutral-300' : 'text-neutral-600 line-through'}>
                      {feature.text_id || feature}
                    </span>
                  </div>
                ))}
                {((service.included_features?.length || service.features?.length) || 0) > 4 && (
                  <p className="text-xs text-neutral-500">
                    +{(service.included_features?.length || service.features?.length) - 4} more features
                  </p>
                )}
              </div>

              {/* Template Link */}
              {service.template_category && (
                <div className="mb-4 p-3 rounded-lg bg-[#FF4500]/10 border border-[#FF4500]/20">
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink size={14} className="text-[#FF4500]" />
                    <span className="text-neutral-300">Template:</span>
                    <span className="text-[#FF4500] font-medium">
                      {linkedCategory?.label || service.template_category}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(service)} 
                  className="flex-1 border-white/10 text-white hover:bg-white/10"
                >
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(service.id)} 
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-16">
          <Briefcase size={48} className="mx-auto text-neutral-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Services Yet</h3>
          <p className="text-neutral-400 mb-6">Get started by adding your first service</p>
          <Button 
            onClick={() => { resetForm(); setDialogOpen(true); }} 
            className="bg-[#FF4500] hover:bg-[#FF5722]"
          >
            <Plus size={18} className="mr-2" /> Add Service
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingId ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="p-4 rounded-xl bg-white/5 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileText size={16} className="text-[#FF4500]" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name (Indonesian)</Label>
                  <Input 
                    value={form.name_id} 
                    onChange={(e) => setForm({ ...form, name_id: e.target.value })} 
                    placeholder="Website Company Profile"
                    className="bg-neutral-800 border-white/10 text-white" 
                    required 
                  />
                </div>
                <div>
                  <Label>Name (English)</Label>
                  <Input 
                    value={form.name_en} 
                    onChange={(e) => handleNameChange(e.target.value)} 
                    placeholder="Company Profile Website"
                    className="bg-neutral-800 border-white/10 text-white" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug (URL)</Label>
                  <Input 
                    value={form.slug} 
                    onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                    placeholder="company-profile"
                    className="bg-neutral-800 border-white/10 text-white" 
                    required 
                  />
                  <p className="text-xs text-neutral-500 mt-1">URL: /services/{form.slug || 'slug'}</p>
                </div>
                <div>
                  <Label>Icon</Label>
                  <select 
                    value={form.icon} 
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white"
                  >
                    {Object.entries(iconMap).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Description (Indonesian)</Label>
                <Textarea 
                  value={form.description_id} 
                  onChange={(e) => setForm({ ...form, description_id: e.target.value })} 
                  placeholder="Deskripsi lengkap layanan dalam Bahasa Indonesia..."
                  className="bg-neutral-800 border-white/10 text-white" 
                  rows={3} 
                />
              </div>

              <div>
                <Label>Description (English)</Label>
                <Textarea 
                  value={form.description_en} 
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })} 
                  placeholder="Complete service description in English..."
                  className="bg-neutral-800 border-white/10 text-white" 
                  rows={3} 
                />
              </div>
            </div>

            {/* Pricing & Order Section */}
            <div className="p-4 rounded-xl bg-white/5 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Zap size={16} className="text-[#FF4500]" />
                Pricing & Display
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Starting Price (Rp)</Label>
                  <Input 
                    type="number" 
                    value={form.price_start} 
                    onChange={(e) => setForm({ ...form, price_start: e.target.value })} 
                    placeholder="3500000"
                    className="bg-neutral-800 border-white/10 text-white" 
                    required 
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input 
                    type="number" 
                    value={form.order} 
                    onChange={(e) => setForm({ ...form, order: e.target.value })} 
                    placeholder="1"
                    className="bg-neutral-800 border-white/10 text-white" 
                  />
                </div>
                <div>
                  <Label>Image URL (Optional)</Label>
                  <Input 
                    value={form.image} 
                    onChange={(e) => setForm({ ...form, image: e.target.value })} 
                    placeholder="https://..."
                    className="bg-neutral-800 border-white/10 text-white" 
                  />
                </div>
              </div>
            </div>

            {/* Template Link Section */}
            <div className="p-4 rounded-xl bg-white/5 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <ExternalLink size={16} className="text-[#FF4500]" />
                Template Link
              </h3>
              <p className="text-sm text-neutral-400">
                Link this service to a template category so customers can see available templates
              </p>
              
              <div>
                <Label>Related Template Category</Label>
                <select 
                  value={form.template_category} 
                  onChange={(e) => setForm({ ...form, template_category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white"
                >
                  {templateCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {form.template_category && (
                  <p className="text-xs text-[#FF4500] mt-2">
                    ✓ Customers will see templates in "{templateCategories.find(c => c.value === form.template_category)?.label}" category
                  </p>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="p-4 rounded-xl bg-white/5 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Check size={16} className="text-[#FF4500]" />
                Features List
              </h3>
              <p className="text-sm text-neutral-400">
                Add features that are included or not included in this service package
              </p>
              
              {/* Add Feature Form */}
              <div className="p-4 rounded-lg bg-neutral-800/50 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Feature (Indonesian)</Label>
                    <Input 
                      value={newFeature.text_id} 
                      onChange={(e) => setNewFeature({ ...newFeature, text_id: e.target.value })} 
                      placeholder="Desain Responsif"
                      className="bg-neutral-800 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Feature (English)</Label>
                    <Input 
                      value={newFeature.text_en} 
                      onChange={(e) => setNewFeature({ ...newFeature, text_en: e.target.value })} 
                      placeholder="Responsive Design"
                      className="bg-neutral-800 border-white/10 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={newFeature.included}
                      onCheckedChange={(checked) => setNewFeature({ ...newFeature, included: checked })}
                    />
                    <Label className="text-sm">
                      {newFeature.included ? (
                        <span className="text-green-500">✓ Included in package</span>
                      ) : (
                        <span className="text-neutral-500">✗ Not included</span>
                      )}
                    </Label>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addFeature} 
                    size="sm"
                    className="bg-[#FF4500] hover:bg-[#FF5722]"
                  >
                    <Plus size={14} className="mr-1" /> Add Feature
                  </Button>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {form.included_features.length === 0 ? (
                  <p className="text-neutral-500 text-sm text-center py-4">
                    No features added yet. Add features above.
                  </p>
                ) : (
                  form.included_features.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        feature.included 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-neutral-800/50 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFeatureIncluded(index)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            feature.included 
                              ? 'bg-green-500 text-white' 
                              : 'bg-neutral-700 text-neutral-400'
                          }`}
                        >
                          {feature.included ? <Check size={14} /> : <X size={14} />}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${feature.included ? 'text-white' : 'text-neutral-500 line-through'}`}>
                            {feature.text_id}
                          </p>
                          <p className="text-xs text-neutral-500">{feature.text_en}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFeature(index)}
                        className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="border-white/10 text-white"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#FF4500] hover:bg-[#FF5722]">
                {editingId ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
