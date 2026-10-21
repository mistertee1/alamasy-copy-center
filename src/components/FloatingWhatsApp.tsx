import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/servicesData';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-end gap-3 group">
      
      {/* Tooltip on hover */}
      <div className="hidden sm:block bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        تواصل فوري مع المكتبة (97445151)
      </div>

      <a
        href={`https://wa.me/965${STORE_INFO.phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر الواتساب"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
        
        <MessageCircle className="w-7 h-7 text-white fill-current relative z-10" />
        
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-slate-950">
          1
        </span>
      </a>
    </div>
  );
};
