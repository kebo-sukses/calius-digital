"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { portfolioConfig } from "@/config/portfolio";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  const { personal, contact } = portfolioConfig;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with your API endpoint)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (contact.whatsappNumber) {
      const message = encodeURIComponent(contact.whatsappMessage || "Halo!");
      window.open(`https://wa.me/${contact.whatsappNumber}?text=${message}`, "_blank");
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Mari Berkolaborasi!
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Punya project menarik atau ingin discuss ide? Jangan ragu untuk menghubungi saya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Informasi Kontak</h3>
                <div className="space-y-4">
                  {personal.email && (
                    <a
                      href={`mailto:${personal.email}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-sm">{personal.email}</p>
                      </div>
                    </a>
                  )}

                  {personal.phone && (
                    <a
                      href={`tel:${personal.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <p className="text-sm">{personal.phone}</p>
                      </div>
                    </a>
                  )}

                  {contact.whatsappNumber && (
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group w-full text-left"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">WhatsApp</p>
                        <p className="text-sm">Chat langsung via WA</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick WhatsApp Button */}
              {contact.whatsappNumber && (
                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat via WhatsApp
                </Button>
              )}
            </div>

            {/* Contact Form */}
            {contact.formEnabled && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Kirim Pesan</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Email Anda"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Pesan Anda..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : contact.formSubmitText || "Kirim Pesan"}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <p className="text-sm text-green-600 text-center">
                      ✓ Pesan berhasil dikirim! Terima kasih.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-sm text-red-600 text-center">
                      ✗ Gagal mengirim pesan. Silakan coba lagi.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
