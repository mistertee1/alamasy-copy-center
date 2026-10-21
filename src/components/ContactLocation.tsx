import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Send, 
  Navigation, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Share2, 
  Building, 
  Compass
} from 'lucide-react';
import { STORE_INFO, FAQ_ITEMS } from '../data/servicesData';
import { checkStoreOpenStatus, createGeneralWhatsAppUrl } from '../utils/whatsapp';

export const ContactLocation: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactName, setContactName] = useState<string>('');
  const [contactTopic, setContactTopic] = useState<string>('طباعة مستندات');
  const [contactMsg, setContactMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const storeStatus = checkStoreOpenStatus();

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `السلام عليكم ورحمة الله،
اسمي: ${contactName || 'عميل'}
موضوع الاستفسار: ${contactTopic}
الرسالة: ${contactMsg || 'أود الاستفسار عن خدمات الطباعة والتصوير في سوق القصر المركزي.'}`;
    const url = createGeneralWhatsAppUrl(text);
    window.open(url, '_blank');
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: STORE_INFO.name,
        text: `${STORE_INFO.name} - ${STORE_INFO.location}`,
        url: STORE_INFO.googleMapsUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${STORE_INFO.name} - ${STORE_INFO.location} | هاتف: ${STORE_INFO.phone}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="contact" className="py-16 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>الموقع وساعات العمل والتواصل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            زورونا في سوق القصر المركزي أو تواصلوا فوراً
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            نسعد بخدمتكم في جمعية النعيم التعاونية - سوق القصر المركزي - الدور الميزانين، أو عبر قنوات التواصل المباشرة طوال اليوم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-16">
          
          {/* Left Column: Location, Hours, and Map (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Store Location Card (Dark Bento Tile) */}
            <div className="bg-[#0F172A] text-white rounded-[2rem] p-7 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span className="text-xs font-bold text-slate-200">{storeStatus.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShareLocation}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'تم نسخ العنوان!' : 'مشاركة الموقع'}</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-white text-sm font-bold">العنوان الدقيق:</strong>
                      <span className="text-slate-300 leading-relaxed block mt-0.5">
                        {STORE_INFO.location}
                      </span>
                      <span className="text-blue-300 text-xs mt-0.5 block">
                        (بجانب السلم الكهربائي - فوق السوبرماركت مباشرة بالميزانين)
                      </span>
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-white text-sm font-bold">الهاتف والواتساب المباشر:</strong>
                      <div className="flex items-center gap-3 mt-1">
                        <a
                          href={`https://wa.me/965${STORE_INFO.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-base font-black text-[#25D366] hover:underline"
                          dir="ltr"
                        >
                          {STORE_INFO.phone}
                        </a>
                        <span className="text-slate-400 text-xs">(متاح للاتصال والمراسلة)</span>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours Schedule */}
                  <div className="flex items-start gap-3 pt-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="w-full">
                      <strong className="block text-white text-sm font-bold">أوقات العمل الرسمية:</strong>
                      <div className="mt-2 space-y-2 bg-slate-800/80 p-3.5 rounded-2xl text-xs text-slate-300 border border-slate-700/60">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">السبت إلى الخميس:</span>
                          <span className="text-blue-300 font-mono">8:00 ص – 1:00 ظ | 4:00 ع – 10:30 م</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-700/60 pt-2">
                          <span className="font-semibold text-white">يوم الجمعة:</span>
                          <span className="text-blue-300 font-mono">4:00 عصراً – 10:30 مساءً</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Direct Action Buttons on Location */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/965${STORE_INFO.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg transition active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>محادثة واتساب سريعة</span>
                  </a>
                  
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs border border-slate-700 transition"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>اتصال بالهاتف</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Souq+Al+Qasr+Naeem+Coop+Kuwait"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>اتجاهات الخريطة</span>
                  </a>
                </div>

              </div>
            </div>

            {/* Interactive Location Map Box */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>موقع سوق القصر المركزي - جمعية النعيم بالميزانين</span>
                </span>
                <span className="text-slate-500 font-medium">محافظة الجهراء</span>
              </div>
              
              {/* Map View Frame */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-100">
                <iframe
                  title="خريطة سوق القصر المركزي"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111246.39868778619!2d47.640243!3d29.337583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9b0069352e85%3A0x6331a9aa6618585e!2z2KzZhdi52YrYqSDYp9mE2YbYudmK2YUg2KfZhNiq2LnYp9mI2YbZitipIC0g2LPZiNmCINin2YTZgtitem!5e0!3m2!1sar!2skw!4v1700000000000!5m2!1sar!2skw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Instant WhatsApp Dispatch Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[2rem] p-7 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">أرسل استفسارك مباشرة للفرع</h3>
              <p className="text-xs text-slate-500 mt-1">
                املأ النموذج وسنقوم بفتح محادثة الواتساب معك فوراً لخدمتك والرد على طلبك.
              </p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكريم:</label>
                <input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الخدمة المطلوبة:</label>
                <select
                  value={contactTopic}
                  onChange={(e) => setContactTopic(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="طباعة مستندات وأبحاث">طباعة مستندات وأبحاث</option>
                  <option value="معاملة حكومية / سهل / ديوان">معاملة حكومية / سهل / ديوان</option>
                  <option value="سيرة ذاتية وتقديم وظائف">سيرة ذاتية وتقديم وظائف</option>
                  <option value="ترجمة معتمدة">ترجمة معتمدة</option>
                  <option value="بنر رول أب ودعاية وإعلان">بنر رول أب ودعاية وإعلان</option>
                  <option value="أختام رسمية وشخصية">أختام رسمية وشخصية</option>
                  <option value="طباعة هدايا ومناسبات">طباعة هدايا ومناسبات وأعراس</option>
                  <option value="استفسار عام / طلب خاص">استفسار عام / طلب خاص</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تفاصيل الاستفسار أو الطلب:</label>
                <textarea
                  rows={4}
                  placeholder="اكتب هنا ما تحتاجه وسنرد عليك فوراً بالأسعار وموعد التجهيز..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-4 rounded-xl text-xs shadow-md transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الاستفسار عبر الواتساب (97445151)</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>رد سريع ومباشر من فريق الطباعة خلال أوقات الدوام.</span>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">الأسئلة الأكثر شيوعاً</h3>
            <p className="text-xs text-slate-500">كل ما تحتاج معرفته عن خدمات الطباعة والتوصيل والاستلام</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

