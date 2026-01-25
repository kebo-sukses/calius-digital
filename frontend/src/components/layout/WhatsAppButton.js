import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '628126067561';
  const message = encodeURIComponent('Halo Calius Digital, saya tertarik dengan layanan pembuatan website.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-button"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} className="text-white" fill="white" />
    </a>
  );
};

export default WhatsAppButton;
