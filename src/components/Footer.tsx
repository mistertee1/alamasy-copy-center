import React from 'react';
import { 
  Printer, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  FileUp, 
  Grid, 
  Heart, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { STORE_INFO } from '../data/servicesData';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">خدمة الطباعة والتصوير</h3>
                <p className="text-xs text-blue-400 font-semibold">جمعية النعيم التعاونية</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              وجهتكم الأولى لخدمات الطباعة الرقمية، الأبحاث المدرسية والجامعية، المعاملات الحكومية، والدعاية والإعلان في منطقة النعيم والجهراء.
            </p>

            <div className="text-xs text-slate-400 space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>سوق القصر المركزي - الدور الميزانين (بالميزانين)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <span dir="ltr" className="font-mono text-white font-bold">{STORE_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quick-print')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span>رفع وطباعة مستند فوري</span>
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">15 فلس</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('track-order')}
                  className="hover:text-blue-400 transition-colors"
                >
                  تتبع حالة الطلب بالرقم
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('media-gallery')}
                  className="hover:text-blue-400 transition-colors text-indigo-300 font-semibold"
                >
                  معرض الصور والفيديوهات
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('custom-request')}
                  className="hover:text-blue-400 transition-colors"
                >
                  طلب خدمة وتصميم مخصص
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  كتالوج الخدمات والمطبوعات
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="hover:text-blue-400 transition-colors"
                >
                  شريط وجدول الأسعار
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-blue-400 transition-colors"
                >
                  الموقع وساعات العمل
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Prominent Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>أبرز الخدمات</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• طباعة بحوث وتقارير بالليزر</li>
              <li>• بنر رول أب واستاندات معارض</li>
              <li>• أختام أوتوماتيكية وشخصية فورية</li>
              <li>• تصاميم سيرة ذاتية وتقديم وظائف</li>
              <li>• طباعة أكواب وتيشرتات وهدايا أعراس</li>
              <li>• كروت شخصية وفواتير مكربنة</li>
            </ul>
          </div>

          {/* Col 4: Fast WhatsApp Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>طلب مباشر بالواتساب</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              يمكنكم إرسال ملفات PDF وصور التصاميم مباشرة لموظف الطباعة وسنقوم بالتجهيز الفوري:
            </p>
            <a
              href={`https://wa.me/965${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>واتساب: {STORE_INFO.phone}</span>
            </a>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>نستقبل الملفات على مدار الساعة</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — خدمة الطباعة والتصوير (جمعية النعيم - سوق القصر المركزي بالميزانين).
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>جودة عالية وسرعة استلام</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">محافظة الجهراء، الكويت</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
