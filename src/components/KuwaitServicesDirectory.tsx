import React, { useState } from 'react';
import {
  Users,
  Building2,
  Ship,
  FileCheck,
  Car,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  FileText,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import {
  CLEARANCE_CATEGORIES,
  KUWAIT_CLEARANCE_SERVICES,
  ClearanceCategoryInfo
} from '../data/kuwaitClearanceServices';
import { ClearanceServiceItem, ClearanceCategory, ActiveTab } from '../types';
import { STORE_INFO } from '../data/servicesData';
import { createClearanceServiceWhatsAppUrl } from '../utils/whatsapp';

interface KuwaitServicesDirectoryProps {
  onSelectServiceForRequest: (serviceId: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const KuwaitServicesDirectory: React.FC<KuwaitServicesDirectoryProps> = ({
  onSelectServiceForRequest,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ClearanceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<ClearanceServiceItem | null>(null);

  // Filter services
  const filteredServices = KUWAIT_CLEARANCE_SERVICES.filter((service) => {
    const matchesCat = selectedCategory === 'all' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.metaDesc.toLowerCase().includes(q) ||
      service.detailedDesc.toLowerCase().includes(q) ||
      service.officialEntity.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5" />;
      case 'Car':
        return <Car className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8" dir="rtl">
      
      {/* Top Hero Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>خدمات تخليص المعاملات الحكومية والتجارية والجمركية بدولة الكويت</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          دليل الخدمات الحكومية وتخليص المعاملات
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          نقدم لكم باقة متكاملة من الخدمات المعتمدة لدى وزارات وهيئات دولة الكويت: شؤون الإقامة، القوى العاملة، وزارة التجارة، التخليص الجمركي، المرور، والبطاقة المدنية مع متابعة مباشرة وتنفيذ موثوق.
        </p>
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
          <input
            type="text"
            placeholder="ابحث عن أي معاملة (مثال: تجديد إقامة، تأسيس شركة، فحص عمالة، جمارك، مرور)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-2xl py-3 pr-12 pl-4 text-xs sm:text-sm font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>جميع الخدمات ({KUWAIT_CLEARANCE_SERVICES.length})</span>
          </button>

          {CLEARANCE_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                    {service.categoryName}
                  </span>
                  {service.badge && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {service.metaDesc}
                </p>

                {/* Entity & Time */}
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{service.officialEntity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>الوقت المقدر: {service.estimatedTime || 'سريع'}</span>
                  </div>
                </div>

                {/* What We Deliver summary */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-800 block">ما ننجزه لك:</span>
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {service.whatWeDeliver.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectServiceForRequest(service.id)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>طلب الخدمة الآن</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalService(service)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  التفاصيل
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm font-bold">
            لم يتم العثور على أية خدمات تطابق بحثك.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            إظهار كافة الخدمات
          </button>
        </div>
      )}

      {/* Details Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-1 inline-block">
                  {activeModalService.categoryName}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {activeModalService.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">الوصف التفصيلي للخدمة:</h4>
                <p className="text-slate-600 leading-relaxed">
                  {activeModalService.detailedDesc}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">ما ننجزه للعميل والمميزات:</h4>
                <ul className="space-y-1.5">
                  {activeModalService.whatWeDeliver.map((del, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">المستندات المطلوبة من العميل:</h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  {activeModalService.requiredDocuments.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-blue-950 flex items-center justify-between">
                <div>
                  <span className="font-bold block">الجهة الحكومية المختصة:</span>
                  <span>{activeModalService.officialEntity}</span>
                </div>
                <div className="text-left font-bold text-blue-700">
                  ⏱️ {activeModalService.estimatedTime}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const sId = activeModalService.id;
                  setActiveModalService(null);
                  onSelectServiceForRequest(sId);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>تقديم طلب لهذه الخدمة الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const text = `السلام عليكم ورحمة الله، أود الاستفسار عن خدمة: ${activeModalService.name} من مكتبة جمعية النعيم بسوق القصر.`;
                  window.open(createClearanceServiceWhatsAppUrl(text), '_blank');
                }}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
