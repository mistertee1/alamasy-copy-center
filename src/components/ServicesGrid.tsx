import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  FileText, 
  Building2, 
  Briefcase, 
  Languages, 
  CreditCard, 
  Receipt, 
  Image, 
  Stamp, 
  Contact2, 
  Scissors, 
  Sparkles, 
  Shirt, 
  Award, 
  Trophy, 
  Package, 
  Layers, 
  CheckCircle2, 
  MessageCircle, 
  Search, 
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SERVICES_LIST, STORE_INFO } from '../data/servicesData';
import { createServiceInquiryWhatsAppUrl } from '../utils/whatsapp';

interface ServicesGridProps {
  onQuickPrintClick?: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onQuickPrintClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [customInquiryNote, setCustomInquiryNote] = useState<string>('');

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'FileText': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'Languages': return <Languages className="w-6 h-6 text-blue-600" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-amber-600" />;
      case 'Receipt': return <Receipt className="w-6 h-6 text-amber-600" />;
      case 'Image': return <Image className="w-6 h-6 text-amber-600" />;
      case 'Stamp': return <Stamp className="w-6 h-6 text-amber-600" />;
      case 'Contact2': return <Contact2 className="w-6 h-6 text-amber-600" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-emerald-600" />;
      case 'Award': return <Award className="w-6 h-6 text-emerald-600" />;
      case 'Trophy': return <Trophy className="w-6 h-6 text-emerald-600" />;
      case 'Package': return <Package className="w-6 h-6 text-emerald-600" />;
      case 'Layers': return <Layers className="w-6 h-6 text-emerald-600" />;
      default: return <Sparkles className="w-6 h-6 text-blue-600" />;
    }
  };

  // Filtered list
  const filteredServices = useMemo(() => {
    return SERVICES_LIST.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'جميع الخدمات والمطبوعات' },
    { id: 'student-govt', label: '🎓 الخدمات الطالبية والحكومية' },
    { id: 'commercial-print', label: '📣 المطبوعات والدعاية' },
    { id: 'events-gifts', label: '🎉 المناسبات والهدايا' },
  ];

  const handleSendCustomInquiry = (service: ServiceItem) => {
    const url = createServiceInquiryWhatsAppUrl(service, customInquiryNote);
    window.open(url, '_blank');
    setActiveModalService(null);
    setCustomInquiryNote('');
  };

  return (
    <section id="services" className="py-16 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>كتالوج الخدمات والمطبوعات الشامل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            استعرض كافة خدماتنا الطلابية والإعلانية
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            نوفر لكم في فرع جمعية النعيم بسوق القصر المركزي بالميزانين تشكيلة متكاملة من الخدمات الطلابية، المعاملات، المطبوعات التجارية، وهدايا المناسبات.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن خدمة، بنر، أختام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
            />
          </div>

        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold mb-2">لم نجد أي خدمة تطابق بحثك</p>
            <p className="text-xs text-slate-400">يمكنك الاستفسار عن أي طلب خاص مباشرة عبر الواتساب</p>
            <a
              href={`https://wa.me/965${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition hover:bg-[#20bd5a]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الفرع عبر الواتساب</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white hover:border-blue-400 border border-slate-200 rounded-[2rem] p-7 transition-all duration-200 hover:shadow-md flex flex-col justify-between group shadow-sm"
              >
                <div>
                  
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform text-blue-600">
                      {getIcon(service.iconName)}
                    </div>
                    {service.badge && (
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Features Bullet List */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-700">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                {/* Card Bottom: Price and Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">التكلفة:</span>
                    <span className="text-xs font-bold text-slate-900">{service.startingPrice || 'حسب الطلب'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalService(service)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      تفاصيل
                    </button>
                    <a
                      href={createServiceInquiryWhatsAppUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-sm transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>اطلب بالواتساب</span>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail & Custom Inquiry Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-200 text-blue-600 shadow-sm">
                {getIcon(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 block">{activeModalService.categoryName}</span>
                <h3 className="text-lg font-black text-slate-900">{activeModalService.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeModalService.fullDesc}
              </p>

              <div>
                <span className="font-bold text-slate-900 block mb-2">مميزات وتفاصيل الخدمة:</span>
                <div className="grid grid-cols-2 gap-2">
                  {activeModalService.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl text-slate-700 border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom notes for WhatsApp */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  أضف أي تفاصيل أو متطلبات خاصة ترغب بإرسالها:
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: أحتاج طباعة 50 حبة مع تغليف وتصميم خاص، متى موعد التسليم المتوقع؟"
                  value={customInquiryNote}
                  onChange={(e) => setCustomInquiryNote(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-semibold">
                الفرع: سوق القصر (الميزانين)
              </span>
              <button
                type="button"
                onClick={() => handleSendCustomInquiry(activeModalService)}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>إرسال الطلب للواتساب الآن</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
