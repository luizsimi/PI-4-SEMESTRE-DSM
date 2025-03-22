// src/layouts/WhatsappButton.jsx
import React from "react";
import { MessageCircle } from "lucide-react"; // Ícone WhatsApp

const WhatsappButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all rounded-full flex items-center gap-2"
    >
      <MessageCircle className="w-5 h-5" /> {/* Ícone do WhatsApp */}
      {children} {/* Texto */}
    </button>
  );
};

export default WhatsappButton;
