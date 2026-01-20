import React from 'react';
import { FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

// Composant carte compacte pour le footer - Afrique centrale
const JessicaFooterMap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#5a4a47] to-[#4a3a37] rounded-2xl p-6 text-white">
      <div className="flex items-center mb-4">
        <FaGlobe className="text-[#f4a6a9] mr-2" />
        <h3 className="font-bold text-lg">My Impact Zone</h3>
      </div>
      
      <div className="relative mb-4">
        {/* Carte simplifiée en SVG */}
        <svg viewBox="0 0 200 120" className="w-full h-24 mb-3">
          {/* Fond océan */}
          <rect width="200" height="120" fill="#1e40af" opacity="0.1" />
          
          {/* Contour Afrique centrale simplifié */}
          <path
            d="M80 40 L120 35 L130 50 L125 70 L115 80 L90 85 L75 75 L70 60 Z"
            fill="#f4a6a9"
            opacity="0.3"
          />
          
          {/* Points d'intervention */}
          <circle cx="100" cy="60" r="3" fill="#f4a6a9" className="animate-pulse" />
          <circle cx="95" cy="65" r="2" fill="#e8b4b8" />
          
          {/* Labels */}
          <text x="100" y="50" textAnchor="middle" className="fill-white text-xs font-medium">
            BURUNDI
          </text>
        </svg>
        
        <div className="text-xs text-white/80 text-center">
          Central Africa Focus Zone
        </div>
      </div>

      {/* Stats compactes basées sur les vraies données de Jessica */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className="text-[#f4a6a9] font-bold text-lg">230</div>
          <div className="text-white/80 text-xs">Girls Reached</div>
        </div>
        <div className="text-center">
          <div className="text-[#f4a6a9] font-bold text-lg">12</div>
          <div className="text-white/80 text-xs">Workshops</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center text-sm text-white/90">
          <FaMapMarkerAlt className="text-[#f4a6a9] mr-2 flex-shrink-0" />
          <span>Bujumbura & Mugerere, Burundi</span>
        </div>
      </div>
    </div>
  );
};

export default JessicaFooterMap;