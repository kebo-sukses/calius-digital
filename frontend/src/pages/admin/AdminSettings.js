import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Settings, Globe, Image, Share2, Phone, Mail, Save, Loader2, Check, Upload, ExternalLink } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminSettings = () => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'Calius Digital',
    tagline_id: '',
    tagline_en: '',
    description_id: '',
    description_en: '',
    logo_url: '',
    favicon_url: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
    social_youtube: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil pengaturan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        handleChange(field, data.url);
        toast({
          title: "Berhasil",
          description: "Gambar berhasil diupload",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Pengaturan berhasil disimpan",
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Pengaturan Website
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola logo, tagline, deskripsi, dan metadata website
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Simpan Semua</>
          )}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="branding" className="gap-2">
            <Image className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Globe className="h-4 w-4" />
            Konten
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            SEO / Meta
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            Kontak & Sosial
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>
                Upload logo dan favicon untuk website Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label>Logo Website</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {settings.logo_url ? (
                      <div className="space-y-3">
                        <img 
                          src={settings.logo_url} 
                          alt="Logo" 
                          className="max-h-24 mx-auto object-contain"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChange('logo_url', '')}
                        >
                          Hapus Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Upload logo (PNG, JPG, SVG)
                        </p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-3"
                      onChange={(e) => handleImageUpload('logo_url', e.target.files[0])}
                      disabled={uploading}
                    />
                  </div>
                  <Input
                    placeholder="Atau masukkan URL logo langsung"
                    value={settings.logo_url}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                  />
                </div>

                {/* Favicon Upload */}
                <div className="space-y-3">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {settings.favicon_url ? (
                      <div className="space-y-3">
                        <img 
                          src={settings.favicon_url} 
                          alt="Favicon" 
                          className="max-h-16 mx-auto object-contain"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChange('favicon_url', '')}
                        >
                          Hapus Favicon
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Upload favicon (32x32 atau 64x64 px)
                        </p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-3"
                      onChange={(e) => handleImageUpload('favicon_url', e.target.files[0])}
                      disabled={uploading}
                    />
                  </div>
                  <Input
                    placeholder="Atau masukkan URL favicon langsung"
                    value={settings.favicon_url}
                    onChange={(e) => handleChange('favicon_url', e.target.value)}
                  />
                </div>
              </div>

              {/* Site Name */}
              <div className="space-y-2">
                <Label>Nama Website</Label>
                <Input
                  value={settings.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  placeholder="Nama website Anda"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Tagline & Deskripsi</CardTitle>
              <CardDescription>
                Tulis tagline dan deskripsi dalam Bahasa Indonesia dan Inggris
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tagline (Indonesia)</Label>
                  <Input
                    value={settings.tagline_id}
                    onChange={(e) => handleChange('tagline_id', e.target.value)}
                    placeholder="Tagline dalam Bahasa Indonesia"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline (English)</Label>
                  <Input
                    value={settings.tagline_en}
                    onChange={(e) => handleChange('tagline_en', e.target.value)}
                    placeholder="Tagline in English"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deskripsi (Indonesia)</Label>
                  <Textarea
                    value={settings.description_id}
                    onChange={(e) => handleChange('description_id', e.target.value)}
                    placeholder="Deskripsi website dalam Bahasa Indonesia"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi (English)</Label>
                  <Textarea
                    value={settings.description_en}
                    onChange={(e) => handleChange('description_en', e.target.value)}
                    placeholder="Website description in English"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Data</CardTitle>
              <CardDescription>
                Pengaturan meta data untuk optimasi mesin pencari dan sitemap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={settings.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="Judul yang muncul di tab browser dan hasil pencarian"
                />
                <p className="text-xs text-gray-500">
                  Idealnya 50-60 karakter. Saat ini: {settings.meta_title?.length || 0} karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={settings.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  placeholder="Deskripsi singkat website untuk hasil pencarian"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Idealnya 150-160 karakter. Saat ini: {settings.meta_description?.length || 0} karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Input
                  value={settings.meta_keywords}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  placeholder="Kata kunci dipisahkan koma (website, template, jasa web)"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-3">
                <Label>Open Graph Image</Label>
                <p className="text-xs text-gray-500">
                  Gambar yang muncul saat link di-share ke media sosial (rekomendasi: 1200x630 px)
                </p>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {settings.og_image ? (
                    <div className="space-y-3">
                      <img 
                        src={settings.og_image} 
                        alt="OG Image" 
                        className="max-h-32 mx-auto object-contain"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChange('og_image', '')}
                      >
                        Hapus Gambar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Upload OG Image
                      </p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-3"
                    onChange={(e) => handleImageUpload('og_image', e.target.files[0])}
                    disabled={uploading}
                  />
                </div>
                <Input
                  placeholder="Atau masukkan URL gambar langsung"
                  value={settings.og_image}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                />
              </div>

              {/* Sitemap Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">📋 Sitemap Dinamis</h4>
                <p className="text-sm text-blue-600 mb-2">
                  Sitemap website Anda otomatis di-generate dan diperbarui setiap kali ada blog post baru.
                </p>
                <a 
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-700 underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Lihat Sitemap
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Social Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="contact@calius.digital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    placeholder="+62 812 3456 7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={settings.contact_whatsapp}
                    onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                    placeholder="6281234567890 (tanpa + atau spasi)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Textarea
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Alamat lengkap bisnis Anda"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Media Sosial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/caliusdigital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/caliusdigital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter / X</Label>
                  <Input
                    value={settings.social_twitter}
                    onChange={(e) => handleChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/caliusdigital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={settings.social_linkedin}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/caliusdigital"
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube</Label>
                  <Input
                    value={settings.social_youtube}
                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                    placeholder="https://youtube.com/@caliusdigital"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
