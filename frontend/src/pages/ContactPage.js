import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiService.getServices();
        setServices(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.submitContact(form);
      toast({
        title: language === 'id' ? 'Berhasil!' : 'Success!',
        description: t('contact.success'),
      });
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo Calius Digital, saya ${form.name || 'ingin'} menanyakan tentang layanan pembuatan website. ${form.message || ''}`
    );
    window.open(`https://wa.me/628126067561?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">
                {language === 'id' ? 'Informasi Kontak' : 'Contact Information'}
              </h2>

              <div className="space-y-6 mb-10">
                <a
                  href="mailto:hello@calius.digital"
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-white/10 hover:border-[#FF4500]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FF4500]/20 flex items-center justify-center">
                    <Mail className="text-[#FF4500]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Email</div>
                    <div className="text-white font-medium">hello@calius.digital</div>
                  </div>
                </a>

                <a
                  href="tel:+628126067561"
                  className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-white/10 hover:border-[#FF4500]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FF4500]/20 flex items-center justify-center">
                    <Phone className="text-[#FF4500]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{language === 'id' ? 'Telepon' : 'Phone'}</div>
                    <div className="text-white font-medium">+62 812 6067 561</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4500]/20 flex items-center justify-center">
                    <MapPin className="text-[#FF4500]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">{language === 'id' ? 'Lokasi' : 'Location'}</div>
                    <div className="text-white font-medium">Indonesia</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                data-testid="whatsapp-contact"
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold transition-colors"
              >
                <MessageCircle size={24} />
                {t('contact.whatsapp')}
              </button>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <Label htmlFor="name" className="text-neutral-300 mb-2 block">{t('contact.name')}</Label>
                  <Input
                    id="name"
                    data-testid="contact-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="bg-neutral-900 border-white/10 text-white h-12 focus:border-[#FF4500]"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-neutral-300 mb-2 block">{t('contact.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="contact-email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="bg-neutral-900 border-white/10 text-white h-12 focus:border-[#FF4500]"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-neutral-300 mb-2 block">{t('contact.phone')}</Label>
                    <Input
                      id="phone"
                      data-testid="contact-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-neutral-900 border-white/10 text-white h-12 focus:border-[#FF4500]"
                      placeholder="+62xxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service" className="text-neutral-300 mb-2 block">{t('contact.service')}</Label>
                  <Select value={form.service} onValueChange={(value) => setForm({ ...form, service: value })}>
                    <SelectTrigger data-testid="contact-service" className="bg-neutral-900 border-white/10 text-white h-12">
                      <SelectValue placeholder={t('contact.service')} />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10">
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.slug} className="text-white">
                          {language === 'id' ? service.name_id : service.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-neutral-300 mb-2 block">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    data-testid="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-neutral-900 border-white/10 text-white resize-none focus:border-[#FF4500]"
                    placeholder={language === 'id' ? 'Ceritakan kebutuhan website Anda...' : 'Tell us about your website needs...'}
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="contact-submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#FF4500] hover:bg-[#FF5722] text-white rounded-xl font-semibold text-base"
                >
                  {loading ? t('contact.sending') : t('contact.send')}
                  <Send className="ml-2" size={18} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
