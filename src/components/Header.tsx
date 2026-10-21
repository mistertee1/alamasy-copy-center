import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  FileUp, 
  Grid, 
  Home, 
  Tag, 
  Menu, 
  X,
  Sparkles,
  Package,
  Layers,
  Video,
  FileCheck2,
  Building2
} from 'lucide-react';
import { ActiveTab } from '../types';
import { STORE_INFO } from '../data/servicesData';
import { checkStoreOpenStatus } from '../utils/whatsapp';
import { PrintPrepGuideTooltip } from './PrintPrepGuideTooltip';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState(checkStoreOpenStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStoreStatus(checkStoreOpenStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
    { id: 'clearance-services', label: 'تخليص المعاملات', icon: <FileCheck2 className="w-4 h-4 text-amber-400" />, badge: 'طلب فوري' },
    { id: 'quick-print', label: 'طباعة سريعة', icon: <FileUp className="w-4 h-4" /> },
    { id: 'track-order', label: 'تتبع الطلب', icon: <Package className="w-4 h-4" /> },
    { id: 'media-gallery', label: 'معرض الوسائط', icon: <Video className="w-4 h-4" />, badge: 'فيديو' },
    { id: 'custom-request', label: 'خدمة مخصصة', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'services', label: 'الخدمات', icon: <Grid className="w-4 h-4" /> },
    { id: 'pricing', label: 'الأسعار', icon: <Tag className="w-4 h-4" /> },
    { id: 'contact', label: 'الموقع والدوام', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner with Location and Store Open Status */}
      <div className="bg-[#0F172A] text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>جمعية النعيم سوق القصر المركزي - بالميزانين</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>فترتان: صباحية 8-1 | مسائية 4-10:30</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className={storeStatus.isOpen ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}>
                {storeStatus.isOpen ? 'الفرع مفتوح الآن' : 'نستقبلكم بالفترة القادمة'}
              </span>
            </div>
            <a 
              href={`tel:${STORE_INFO.phone}`}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-slate-300"
            >
              <Phone className="w-3 h-3 text-[#25D366]" />
              <span dir="ltr" className="font-mono font-bold text-white">{STORE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between">
          
          {/* Logo and Store Title */}
          <button type="button" aria-label="العودة إلى الرئيسية"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none text-right"
          >
            <BrandLogo />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Track Order & Print & WhatsApp */}
          <div className="hidden xl:flex 2xl:hidden items-center gap-2.5">
            <PrintPrepGuideTooltip buttonText="استفسار الملفات" variant="pill" align="left" />

            <button
              onClick={() => setActiveTab('track-order')}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2.5 rounded-full text-xs font-bold border border-slate-200 transition"
            >
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <span>تتبع طلبك</span>
            </button>

            <button
              onClick={() => setActiveTab('quick-print')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>طلب طباعة</span>
            </button>

            <a
              href={`https://wa.me/965${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-full font-bold flex items-center gap-1.5 text-xs shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>واتساب</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex 2xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex justify-center pb-1">
              <PrintPrepGuideTooltip buttonText="استفسار: إرشادات تجهيز الملفات للطباعة" variant="pill" align="center" />
            </div>

            <a
              href={`https://wa.me/965${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold shadow text-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>تواصل مباشر واتساب: {STORE_INFO.phone}</span>
            </a>
            
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold text-xs"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>اتصال هاتفي ({STORE_INFO.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

