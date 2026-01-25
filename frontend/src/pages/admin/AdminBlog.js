import React, { useState, useEffect } from 'react';
import { adminApi, uploadToCloudinary } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, Eye } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';

const AdminBlog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('id');
  const [form, setForm] = useState({
    slug: '', title_id: '', title_en: '', excerpt_id: '', excerpt_en: '',
    content_id: '', content_en: '', image: '', author: 'Calius Team', category: 'tips', tags: [], read_time: 5
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const data = await adminApi.getBlog();
      setPosts(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      slug: '', title_id: '', title_en: '', excerpt_id: '', excerpt_en: '',
      content_id: '', content_en: '', image: '', author: 'Calius Team', category: 'tips', tags: [], read_time: 5
    });
    setEditingId(null);
    setActiveTab('id');
  };

  const handleEdit = (post) => {
    setForm({ ...post });
    setEditingId(post.id);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'blog');
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
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()) : form.tags,
        read_time: parseInt(form.read_time)
      };

      if (editingId) {
        await adminApi.updateBlog(editingId, data);
        toast({ title: 'Success', description: 'Post updated' });
      } else {
        await adminApi.createBlog(data);
        toast({ title: 'Success', description: 'Post created' });
      }
      setDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await adminApi.deleteBlog(id);
      toast({ title: 'Deleted', description: 'Post deleted' });
      fetchPosts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="text-neutral-400">{posts.length} posts</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-[#FF4500] hover:bg-[#FF5722]">
          <Plus size={18} className="mr-2" /> Add Post
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900 border border-white/10">
            <div className="w-20 h-20 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
              {post.image && <img src={post.image} alt={post.title_id} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{post.title_id}</h3>
              <p className="text-sm text-neutral-400 line-clamp-1">{post.excerpt_id}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                <span>{post.category}</span>
                <span>{post.published_at}</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setForm(post); setPreviewOpen(true); }} className="border-white/10 text-white">
                <Eye size={14} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleEdit(post)} className="border-white/10 text-white">
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)} className="border-red-500/50 text-red-500">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Post' : 'Add Post'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title (ID)</Label>
                <Input 
                  value={form.title_id} 
                  onChange={(e) => setForm({ ...form, title_id: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} 
                  className="bg-neutral-800 border-white/10 text-white" 
                  required 
                />
              </div>
              <div>
                <Label>Title (EN)</Label>
                <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" required />
              </div>
            </div>

            <div>
              <Label>Excerpt (ID)</Label>
              <Textarea value={form.excerpt_id} onChange={(e) => setForm({ ...form, excerpt_id: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} />
            </div>
            <div>
              <Label>Excerpt (EN)</Label>
              <Textarea value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} className="bg-neutral-800 border-white/10 text-white" rows={2} />
            </div>

            {/* Rich Text Editor with Tabs */}
            <div>
              <Label className="mb-2 block">Content</Label>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-neutral-800 mb-2">
                  <TabsTrigger value="id" className="data-[state=active]:bg-[#FF4500]">Indonesia</TabsTrigger>
                  <TabsTrigger value="en" className="data-[state=active]:bg-[#FF4500]">English</TabsTrigger>
                </TabsList>
                <TabsContent value="id">
                  <RichTextEditor
                    content={form.content_id}
                    onChange={(html) => setForm({ ...form, content_id: html })}
                    placeholder="Tulis konten artikel dalam Bahasa Indonesia..."
                  />
                </TabsContent>
                <TabsContent value="en">
                  <RichTextEditor
                    content={form.content_en}
                    onChange={(html) => setForm({ ...form, content_en: html })}
                    placeholder="Write article content in English..."
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
              </div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 rounded-md bg-neutral-800 border border-white/10 text-white">
                  <option value="tips">Tips</option>
                  <option value="business">Business</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div>
                <Label>Read Time (min)</Label>
                <Input type="number" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="bg-neutral-800 border-white/10 text-white" />
            </div>

            {/* Featured Image */}
            <div>
              <Label>Featured Image</Label>
              <div className="flex gap-4 items-center mt-2">
                {form.image && <img src={form.image} alt="Preview" className="w-24 h-16 object-cover rounded-lg" />}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10">
                  <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="or Image URL" className="flex-1 bg-neutral-800 border-white/10 text-white" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-white/10 text-white">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#FF4500] hover:bg-[#FF5722]">{editingId ? 'Update' : 'Publish'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Preview: {form.title_id}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {form.image && (
              <img src={form.image} alt={form.title_id} className="w-full h-48 object-cover rounded-lg" />
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span>{form.author}</span>
              <span>{form.category}</span>
              <span>{form.read_time} min read</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{form.title_id}</h1>
            <p className="text-neutral-400">{form.excerpt_id}</p>
            <hr className="border-white/10" />
            <div 
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: form.content_id }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
