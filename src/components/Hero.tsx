import React, { useState } from 'react';
import { 
  FileUp, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  GraduationCap, 
  Megaphone, 
  Gift, 
  ArrowLeft,
  ChevronLeft,
  Phone,
  Package,
  Video,
  Play,
  Image as ImageIcon,
  ExternalLink,
  Tag,
  FileCheck2,
  Building2
} from 'lucide-react';
import { ActiveTab } from '../types';
import { STORE_INFO } from '../data/servicesData';
import { MEDIA_ASSETS, GALLERY_ITEMS } from '../data/mediaData';
import { PrintPrepGuideTooltip } from './PrintPrepGuideTooltip';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const [activeVideoPreview, setActiveVideoPreview] = useState<boolean>(false);

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Bento Tile 1: Primary Hero Intro (8 cols) */}
          <section className="md:col-span-8 bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-sm">
            {/* Background image overlay with soft gradient */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
              <img 
                src={MEDIA_ASSETS.hero} 
                alt="مركز الطباعة والتصوير" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Soft decorative background circles */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-slate-50 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <MapPin className="w-3.5 h-3.5" />
                <span>جمعية النعيم سوق القصر المركزي - الدور الميزانين</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight sm:leading-tight tracking-tight mb-3">
                مكتبة الأماسي<br />
                <span className="text-blue-600">خدمات الطباعة والنسخ والطلبات المخصصة</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed mb-6">
                جهّز ملفات الطباعة، حدّد الورق والتشطيب، واطلب مراجعة التكلفة قبل التنفيذ. ونساعدك أيضًا في تجهيز مستندات المعاملات دون صفة حكومية.
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => setActiveTab('clearance-services')}
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:from-amber-700 hover:to-amber-700 shadow-lg shadow-amber-200 transition-all active:scale-95 flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-amber-100" />
                <span>مساعدة في تجهيز المعاملات</span>
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-black">خدمة خاصة</span>
              </button>

              <button
                onClick={() => setActiveTab('quick-print')}
                className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                <span>ارفع ملفك للطباعة الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('media-gallery')}
                className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-indigo-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>معرض الصور والفيديوهات</span>
              </button>

              <button
                onClick={() => setActiveTab('track-order')}
                className="bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
              >
                <Package className="w-4 h-4 text-blue-400" />
                <span>تتبع الطلب</span>
              </button>

              <button
                onClick={() => setActiveTab('custom-request')}
                className="bg-amber-50 text-amber-900 border border-amber-200 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-amber-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>طلب تصميم</span>
              </button>

              <PrintPrepGuideTooltip
                buttonText="استفسار: دليل تجهيز الملفات"
                variant="hero"
              />

              <a
                href={`https://wa.me/965${STORE_INFO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#20bd5a] transition-all shadow-md flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>واتساب</span>
              </a>
            </div>

            {/* Value Trust Tags */}
            <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>استلام بعد تأكيد الجاهزية</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>التواصل وتأكيد الطلب عبر واتساب</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>مراجعة مواصفات الطباعة قبل التنفيذ</span>
              </span>
            </div>
          </section>

          {/* Right Column Stack (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-5">
            
            {/* Bento Tile 2: Interactive Video / Photo Showcase Tile */}
            <div 
              onClick={() => setActiveTab('media-gallery')}
              className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 text-white flex flex-col justify-between shadow-sm relative group cursor-pointer hover:border-blue-400 transition-all aspect-[4/3] md:aspect-auto flex-1 min-h-[200px]"
            >
              {/* Background preview image */}
              <img 
                src={MEDIA_ASSETS.digitalLaser} 
                alt="فيديو مكائن الطباعة"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badge top */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  <span>فيديو حي</span>
                </span>
                <span className="bg-black/60 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                  0:35 دقيقة
                </span>
              </div>

              {/* Center Play Button */}
              <div className="relative z-10 self-center my-auto">
                <div className="w-13 h-13 rounded-2xl bg-white/20 group-hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-md shadow-xl group-hover:scale-110 transition-all p-3.5">
                  <Play className="w-6 h-6 fill-current translate-x-[-1px]" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 p-5 pt-0">
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">
                  شاهد عمل مكائن الطباعة والليزر
                </h3>
                <p className="text-[11px] text-slate-300">
                  فيديوهات تشغيلية لدقة وسرعة الإنجاز بفرع الجمعية
                </p>
              </div>
            </div>

            {/* Bento Tile 3: Pricing summary card */}
            <section className="bg-white rounded-[2rem] p-5 text-slate-900 flex flex-col justify-between shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>أسعار رمزية وفورية</span>
                </h3>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  تبدأ من 15 فلس
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-slate-500 text-[11px]">طباعة أسود A4</span>
                  <strong className="text-sm font-black text-blue-600">15 فلس</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="block text-slate-500 text-[11px]">طباعة ملون A4</span>
                  <strong className="text-sm font-black text-pink-600">70 فلس</strong>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">جمعية النعيم - سوق القصر (الميزانين)</span>
                <button 
                  onClick={() => setActiveTab('pricing')}
                  className="text-blue-600 hover:text-blue-700 font-bold text-[11px]"
                >
                  التفاصيل ←
                </button>
              </div>
            </section>

          </div>

          {/* Bottom Bento Row: 4 Specialized Visual Tiles with Generated Images */}
          
          {/* Tile 4: Student Services with Photo */}
          <div 
            onClick={() => setActiveTab('services')}
            className="md:col-span-3 bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div className="h-28 overflow-hidden relative bg-slate-100">
              <img 
                src={MEDIA_ASSETS.digitalLaser} 
                alt="خدمات طلابية وأبحاث"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                خدمات طلابية
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
                  <span>بحوث وتقارير وتجليد</span>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تنسيق مراجع أكاديمية، تدقيق لغوي، وتجليد سلك وحلزوني فوري.
                </p>
              </div>
              <span className="text-[11px] text-blue-600 font-bold mt-3 block group-hover:translate-x-[-2px] transition-transform">
                استعراض الخدمات ←
              </span>
            </div>
          </div>

          {/* Tile 5: Commercial Print & Banners with Photo */}
          <div 
            onClick={() => setActiveTab('services')}
            className="md:col-span-3 bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-amber-300 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div className="h-28 overflow-hidden relative bg-slate-100">
              <img 
                src={MEDIA_ASSETS.bannersAndStickers} 
                alt="بنرات ومطبوعات تجارية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                دعاية وإعلان
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
                  <span>بنر ورول أب واستكرات</span>
                  <Megaphone className="w-4 h-4 text-amber-500" />
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  طباعة رول أب ستاند مع القاعدة، استكرات ضد الماء، وبوسترات.
                </p>
              </div>
              <span className="text-[11px] text-amber-600 font-bold mt-3 block group-hover:translate-x-[-2px] transition-transform">
                استعراض الخدمات ←
              </span>
            </div>
          </div>

          {/* Tile 6: Gifts & Trophies with Photo */}
          <div 
            onClick={() => setActiveTab('services')}
            className="md:col-span-3 bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-pink-300 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div className="h-28 overflow-hidden relative bg-slate-100">
              <img 
                src={MEDIA_ASSETS.giftsAndTrophies} 
                alt="دروع وهدايا تذكارية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2.5 right-2.5 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                هدايا وتكريم
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
                  <span>دروع كريستال وأكواب</span>
                  <Gift className="w-4 h-4 text-pink-600" />
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  دروع ملكية مع علبة قطيفة، طباعة حرارية على الأكواب والمخدات.
                </p>
              </div>
              <span className="text-[11px] text-pink-600 font-bold mt-3 block group-hover:translate-x-[-2px] transition-transform">
                استعراض الخدمات ←
              </span>
            </div>
          </div>

          {/* Tile 7: Working Hours & Location Tile with Photo */}
          <div 
            onClick={() => setActiveTab('contact')}
            className="md:col-span-3 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-5 text-white flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">ساعات العمل والموقع</h4>
                  <span className="text-[10px] text-indigo-200">سوق القصر - الميزانين</span>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-2.5 text-[11px] text-indigo-100 space-y-1 mb-2">
                <div>صباحاً: 8:00 ص – 1:00 م</div>
                <div>مساءً: 4:00 م – 10:30 م</div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-blue-300 font-bold flex items-center justify-between">
              <span>خريطة الوصول والاتصال</span>
              <span>←</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

