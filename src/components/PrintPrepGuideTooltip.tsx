import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Palette,
  Layers,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  BookOpen,
  Info
} from 'lucide-react';
import { STORE_INFO } from '../data/servicesData';

export interface PrintPrepGuideTooltipProps {
  buttonText?: string;
  variant?: 'pill' | 'button' | 'compact' | 'hero' | 'header';
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export const PrintPrepGuideTooltip: React.FC<PrintPrepGuideTooltipProps> = ({
  buttonText = 'استفسار: إرشادات تجهيز الملفات للطباعة',
  variant = 'pill',
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'specs' | 'checklist'>('basics');
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    pdfFormat: false,
    dpi300: false,
    cmykColor: false,
    safetyMargin: false,
    fontsEmbedded: false,
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyGuideSummary = async () => {
    const summaryText = `📋 دليل تحضير الملفات للطباعة الاحترافية - مركز جمعية النعيم:
1. صيغة الملف: يفضل دائماً PDF (Press Quality) لتثبيت الخطوط والتنسيقات.
2. الدقة: لا تقل عن 300 DPI للصور لضمان وضوح عالي بدون بكسلة.
3. الألوان: نظام CMYK للمطبوعات والبوسترات لضمان تطابق الألوان.
4. الهوامش: ترك مسافة أمان داخلية 5 ملم و 1.5 سم من جهة التجليد السلك.
5. الخطوط: تضمين الخطوط أو تحويلها لمسارات (Outlines) في برامج التصميم.
📍 جمعية النعيم سوق القصر المركزي - الدور الميزانين | هاتف: ${STORE_INFO.phone}`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openWhatsAppSupport = () => {
    const message = encodeURIComponent(`السلام عليكم ورحمة الله،
أود الاستفسار عن تجهيز وتحضير ملف للطباعة بمكتبة جمعية النعيم (سوق القصر المركزي):
- نوع الملف:
- المقاس المطلوب:
- هل يحتاج الملف إلى تدقيق فني قبل الطباعة؟

شكراً لمساعدتكم!`);
    window.open(`https://wa.me/965${STORE_INFO.phone}?text=${message}`, '_blank');
  };

  // Trigger button styling based on variant
  const getTriggerClass = () => {
    switch (variant) {
      case 'pill':
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-xs active:scale-95';
      case 'button':
        return 'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all shadow-xs active:scale-95';
      case 'compact':
        return 'inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors';
      case 'hero':
        return 'inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95';
      case 'header':
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold transition';
      default:
        return 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold';
    }
  };

  // Alignment positioning classes for desktop
  const getAlignmentClass = () => {
    switch (align) {
      case 'left':
        return 'left-0 sm:left-auto sm:right-0';
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'right':
      default:
        return 'right-0';
    }
  };

  return (
    <div className={`relative inline-block text-right ${className}`}>
      
      {/* Trigger: زر الاستفسار */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="استفسار: دليل تحضير الملفات للطباعة"
        className={getTriggerClass()}
      >
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="truncate">{buttonText}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
      </button>

      {/* Popover / Tooltip Window */}
      {isOpen && (
        <>
          {/* Mobile backdrop for better focus on small screens */}
          <div 
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={popoverRef}
            role="dialog"
            aria-label="دليل تحضير الملفات للطباعة"
            className={`fixed sm:absolute top-1/2 sm:top-full left-4 right-4 sm:left-auto sm:right-auto -translate-y-1/2 sm:translate-y-0 sm:mt-2.5 z-50 ${getAlignmentClass()} w-auto sm:w-[480px] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col`}
          >
            {/* Pointer arrow for desktop */}
            <div className="hidden sm:block absolute -top-2 right-6 w-4 h-4 bg-white border-t border-r border-slate-200 rotate-[-45deg] z-10" />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 sm:p-5 relative z-20 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/20 text-blue-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30 inline-block mb-0.5">
                      إرشادات فنية من مكتبة جمعية النعيم
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      كيف تجهّز ملفك للطباعة بشكل احترافي؟
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                  aria-label="إغلاق النافذة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-[11px] text-blue-100/90 leading-relaxed mt-2.5 font-normal">
                اتبع هذه الإرشادات السريعة لتفادي بكسلة الصور أو تقطيع الكلمات عند التجليد والقص، ولتطابق الألوان بدقة.
              </p>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('basics')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                    activeTab === 'basics'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  الأساسيات
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                    activeTab === 'specs'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  الهوامش والألوان
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('checklist')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1 ${
                    activeTab === 'checklist'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>قائمة الفحص</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </button>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700 divide-y divide-slate-100 flex-1">
              
              {/* Tab 1: Basics (File Formats & Word to PDF) */}
              {activeTab === 'basics' && (
                <div className="space-y-3 pt-1">
                  
                  {/* Format #1 */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-2">
                        <span>الصيغة الذهبية: ملف PDF دائماً</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">موصى به</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        احفظ مستندك كـ <strong>PDF</strong> قبل الإرسال. هذا يضمن بقاء الخطوط والجداول والتنسيقات ثابتة 100% ولا تتغير باختلاف إصدار البرنامج أو نوع الجهاز.
                      </p>
                    </div>
                  </div>

                  {/* Word & PowerPoint Notice */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs mb-1">
                        ملفات Word و PowerPoint
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        إذا أرسلت ملف Word، قد تختلف الخطوط إذا لم تكن مثبتة في جهاز الطباعة. الحل السهل: من برنامج Word اختر <strong>ملف &gt; حفظ باسم &gt; نوع الملف PDF</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Images & Graphics */}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs mb-1">
                        دقة الصور (300 DPI)
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        للحصول على طباعة واضحة بدون بكسلة، تأكد أن الصور بحجمها الأصلي وبدقة <strong>300 DPI</strong> على الأقل. تجنب لقطات الشاشة (Screenshots) أو الصور المضغوطة بالواتساب العادي.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Specs (Bleed, Margins & Colors) */}
              {activeTab === 'specs' && (
                <div className="space-y-3 pt-1">
                  
                  {/* Safety Margins & Binding */}
                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1 text-emerald-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>هوامش الأمان والتجليد السلك/الحلزوني</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mr-2">
                      <li>• <strong>هامش داخلي عام:</strong> اترك 5 ملم على الأقل بين النصوص وحواف الصفحة حتى لا تُقطع أثناء القص.</li>
                      <li>• <strong>للتجليد السلك أو الحلزوني:</strong> اترك مسافة <strong>1.5 سم</strong> من جهة التجليد (اليمين للمستندات العربية واليسار للإنجليزية) لتفادي ثقب الكلمات.</li>
                    </ul>
                  </div>

                  {/* Color Modes */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>نظام الألوان (CMYK مقابل RGB)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      شاشات الهواتف تعمل بنظام <strong>RGB</strong>، بينما مكائن الطباعة تستخدم أحبار <strong>CMYK</strong>. في تصاميم البوسترات والرول أب والكروت، اختر نمط CMYK لتكون الألوان المطبوعة مطابقة لما تراه بالشاشة.
                    </p>
                  </div>

                  {/* Fonts Embedding */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>تحويل النصوص إلى مسارات (Outlines)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      لمصممي الفوتوشوب والإليستريتور: تأكد من عمل <strong>Create Outlines / Convert to Curves</strong> لكافة النصوص، أو تضمين الخطوط عند الحفظ كـ PDF.
                    </p>
                  </div>

                </div>
              )}

              {/* Tab 3: Interactive Checklist */}
              {activeTab === 'checklist' && (
                <div className="space-y-2.5 pt-1">
                  <p className="text-[11px] text-slate-500 mb-2">
                    انقر على النقاط التالية للتأكد من جاهزية ملفك بنسبة 100% قبل إرساله للطباعة:
                  </p>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200">
                    <input
                      type="checkbox"
                      checked={checklist.pdfFormat}
                      onChange={() => toggleCheck('pdfFormat')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="text-right">
                      <strong className="block text-xs text-slate-900">الملف بصيغة PDF عالية الجودة</strong>
                      <span className="text-[10px] text-slate-500">للحفاظ على الخطوط والتنسيقات ثابتة</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200">
                    <input
                      type="checkbox"
                      checked={checklist.dpi300}
                      onChange={() => toggleCheck('dpi300')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="text-right">
                      <strong className="block text-xs text-slate-900">دقة الصور 300 DPI على الأقل</strong>
                      <span className="text-[10px] text-slate-500">ليست لقطة شاشة ولا مضغوطة بالواتساب</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200">
                    <input
                      type="checkbox"
                      checked={checklist.safetyMargin}
                      onChange={() => toggleCheck('safetyMargin')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="text-right">
                      <strong className="block text-xs text-slate-900">ترك مسافة أمان للتجليد والقص (1.5 سم)</strong>
                      <span className="text-[10px] text-slate-500">حتى لا يتم ثقب النصوص في التجليد الحلزوني</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200">
                    <input
                      type="checkbox"
                      checked={checklist.cmykColor}
                      onChange={() => toggleCheck('cmykColor')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="text-right">
                      <strong className="block text-xs text-slate-900">تطابق مقاس الصفحة (A4 / A3 / Banners)</strong>
                      <span className="text-[10px] text-slate-500">ضبط حجم الورقة الفعلي بنسبة 1:1</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200">
                    <input
                      type="checkbox"
                      checked={checklist.fontsEmbedded}
                      onChange={() => toggleCheck('fontsEmbedded')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div className="text-right">
                      <strong className="block text-xs text-slate-900">تضمين الخطوط أو تحويلها لمسارات Outlines</strong>
                      <span className="text-[10px] text-slate-500">خاص بملفات التصميم من إليستريتور وفوتوشوب</span>
                    </div>
                  </label>

                  {/* Checklist status bar */}
                  {Object.values(checklist).filter(Boolean).length === 5 ? (
                    <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>رائع! ملفك جاهز تماماً للطباعة الاحترافية.</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 text-center pt-1">
                      تم التحقق من ({Object.values(checklist).filter(Boolean).length} من 5) معايير
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer Quick Actions */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyGuideSummary}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  title="نسخ ملخص التعليمات"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>نسخ الإرشادات</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={openWhatsAppSupport}
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs active:scale-95"
                  title="استفسار فني مباشر مع فريق المكتبة بالواتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>استفسار مع الفني</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2 py-1 transition"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
