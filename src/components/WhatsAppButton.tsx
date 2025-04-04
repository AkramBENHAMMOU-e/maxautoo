"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  // Numéro WhatsApp de l'entreprise au format international (sans espaces ni +)
  const phoneNumber = "212661345678";
  
  // Message prédéfini (optionnel)
  const message = "Bonjour, je souhaite avoir plus d'informations sur la location de voitures.";
  
  // Construction de l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center group hover:pr-6"
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle size={28} className="flex-shrink-0" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton; 