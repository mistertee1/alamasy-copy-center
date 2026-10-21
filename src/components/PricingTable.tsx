import React from 'react';
import { Tag, Check, Sparkles, HelpCircle, FileUp, MessageCircle } from 'lucide-react';
import { FREQUENT_PRICING_TABLE, STORE_INFO } from '../data/servicesData';
import { ActiveTab } from '../types';

interface PricingTableProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ setActiveTab }) => {
  return (
    <section id="pricing" className="py-16 bg-[#F1F5F9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>لائحة الأسعار المباشرة والمعلنة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
            أسعار واضحة وتنافسية لجميع الطلاب والمؤسسات
          </h2>
          <p className="text-sm text-slate-600">
            نلتزم بأعلى معايير الدقة والسرعة مع أسعار رمزية ثابتة لخدمة أهالي منطقة النعيم والجهراء.
          </p>
        </div>

        {/* Pricing Cards Comparison Highlights (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Black & White */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                طباعة الأبحاث والمذكرات
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">طباعة أسود ليزر</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-black text-slate-900">15</span>
                <span className="text-sm font-bold text-slate-500">فلس / ورقة A4</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>دقة نصوص عالية جداً 1200 DPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ورق أبيض ناصع 80 جرام</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>خصم خاص للكميات والمذكرات</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('quick-print')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl text-xs transition"
            >
              احسب واطبع الآن
            </button>
          </div>

          {/* Card 2: Color Highlight (Dark Bento Tile) */}
          <div className="bg-[#0F172A] text-white rounded-[2rem] p-7 shadow-xl border border-slate-800 relative flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              الأكثر طلباً
            </div>
            <div>
              <div className="inline-block bg-slate-800 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-slate-700">
                التقارير والمشاريع والشهادات
              </div>
              <h3 className="text-lg font-bold text-white mb-1">طباعة ملون ليزر</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-black text-blue-400">70</span>
                <span className="text-sm font-bold text-slate-300">فلس / ورقة A4</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>ألوان زاهية وواقعية بدون بهتان</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>طباعة رسوم بيانية ومخططات ملونة</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>متوفر ورق مقوى وكوشيه لماع</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('quick-print')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow transition active:scale-95"
            >
              احسب واطبع ملون
            </button>
          </div>

          {/* Card 3: Binding & Packaging */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                التجليد والتشطيب الفاخر
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">تجليد وتغليف حراري</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl font-black text-slate-900">من 250</span>
                <span className="text-sm font-bold text-slate-500">فلس / نسخة</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>تجليد حلزوني وسلك حديد متين</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>تغليف حراري لماع لحماية البطاقات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>أغلفة شفافة وملونة بمختلف الأحجام</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('quick-print')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl text-xs transition"
            >
              تصفح خيارات التجليد
            </button>
          </div>

        </div>

        {/* Detailed Tariff Table */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 sm:p-6 bg-[#0F172A] text-white flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <span>جدول أسعار الخدمات والطباعة المباشرة</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">فرع سوق القصر المركزي (الميزانين)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:px-6">الخدمة أو نوع الطباعة</th>
                  <th className="p-4 sm:px-6">السعر / التكلفة</th>
                  <th className="p-4 sm:px-6">ملاحظات إضافية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FREQUENT_PRICING_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 sm:px-6 font-semibold text-slate-900">{row.item}</td>
                    <td className="p-4 sm:px-6 font-bold text-blue-600">{row.price}</td>
                    <td className="p-4 sm:px-6 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Fast WhatsApp Inquire */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">هل لديك طلب خاص أو كميات كبيرة لمدرسة أو معهد؟</h4>
              <p className="text-xs text-slate-500 mt-0.5">تواصل مع قسم المبيعات والطباعة للحصول على عرض سعر مخصص وخصومات مميزة.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/965${STORE_INFO.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition active:scale-95"
          >
            تواصل عبر الواتساب (97445151)
          </a>
        </div>

      </div>
    </section>
  );
};
