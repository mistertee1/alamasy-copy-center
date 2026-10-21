import React, { useState } from 'react';
import { X, Printer, CheckCircle2, MessageCircle, Copy, Share2, Package, Check } from 'lucide-react';
import { PrintOrderConfig, PriceBreakdown, ActiveTab } from '../types';
import { STORE_INFO } from '../data/servicesData';
import { createQuickPrintWhatsAppUrl, canShareFilesDirectly, shareFilesDirectly, getRawPriceBreakdownText } from '../utils/whatsapp';
import { createOrderFromQuickPrint } from '../utils/ordersStore';
import { WhatsAppFileDispatchModal } from './WhatsAppFileDispatchModal';

interface OrderReceiptModalProps {
  config: PrintOrderConfig | null;
  breakdown: PriceBreakdown | null;
  onClose: () => void;
  onNavigateToTracking?: (orderId: string) => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ 
  config, 
  breakdown, 
  onClose,
  onNavigateToTracking
}) => {
  if (!config || !breakdown) return null;

  const [orderRecord] = useState(() => createOrderFromQuickPrint(config, breakdown));
  const [copiedId, setCopiedId] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const dateStr = new Date().toLocaleDateString('ar-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendToWhatsApp = async () => {
    const rawFiles = config.files.map((f) => f.rawFile).filter((f): f is File => f instanceof File);
    
    if (rawFiles.length > 0 && canShareFilesDirectly(rawFiles)) {
      const msg = getRawPriceBreakdownText(config, breakdown);
      const res = await shareFilesDirectly(rawFiles, msg, 'طلب طباعة مستندات - جمعية النعيم');
      if (res.success && res.method === 'native_share') {
        return;
      }
    }

    setShowDispatchModal(true);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderRecord.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Printable Area */}
        <div id="printable-receipt" className="text-center pt-2 pb-2">
          
          {/* Logo / Header */}
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Printer className="w-6 h-6" />
          </div>
          
          <h3 className="text-base font-black text-slate-900">
            مكتبة وخدمات الطباعة
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            جمعية النعيم التعاونية — سوق القصر المركزي (الدور الميزانين)
          </p>
          <p className="text-[11px] text-[#25D366] font-mono font-bold mt-0.5">
            واتساب وهاتف: {STORE_INFO.phone}
          </p>

          {/* Tracking ID Pill */}
          <div className="my-3 py-2 px-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">كود التتبع:</span>
              <strong className="text-blue-400 font-mono tracking-wider text-sm">{orderRecord.id}</strong>
            </div>
            <button
              onClick={handleCopyId}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md flex items-center gap-1 transition"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedId ? 'تم' : 'نسخ'}</span>
            </button>
          </div>

          <div className="mb-3 pb-2 border-b border-dashed border-slate-200 text-[11px] text-slate-400 text-center">
            {dateStr}
          </div>

          {/* Customer Info */}
          {(config.customerName || config.customerPhone) && (
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-right space-y-1 mb-3 border border-slate-100">
              {config.customerName && <div><span className="text-slate-400">العميل:</span> <strong className="text-slate-800">{config.customerName}</strong></div>}
              {config.customerPhone && <div><span className="text-slate-400">الهاتف:</span> <strong className="text-slate-800 font-mono" dir="ltr">{config.customerPhone}</strong></div>}
            </div>
          )}

          {/* Specifications list */}
          <div className="text-right space-y-2 text-xs border-b border-dashed border-slate-300 pb-3 mb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">نوع الطباعة:</span>
              <strong className="text-slate-900">
                {config.colorMode === 'black_white' ? 'أسود (15 فلس)' : config.colorMode === 'color_standard' ? 'ملون (70 فلس)' : 'ملون فاخر (100 فلس)'}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">عدد الصفحات والنسخ:</span>
              <strong className="text-slate-900">{config.pageCount} صفحة × {config.copies} نسخة</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">الوجه والورق:</span>
              <strong className="text-slate-900">
                {config.sides === 'single' ? 'وجه واحد' : 'وجهين'} — {config.paperSize === 'a4_standard' ? 'A4 عادي' : config.paperSize === 'a4_heavy' ? 'A4 مقوى' : 'A3/كوشيه'}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">التجليد / التغليف:</span>
              <strong className="text-slate-900">
                {config.binding === 'none' ? 'بدون' : config.binding === 'spiral_plastic' ? 'حلزوني بلاستيك' : config.binding === 'wire_metal' ? 'سلك حديد' : config.binding === 'lamination' ? 'تغليف حراري' : 'تدبيس'}
              </strong>
            </div>

            {config.files.length > 0 && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">الملفات المرفقة:</span>
                <span className="text-slate-700 truncate max-w-[200px]">{config.files.map(f => f.name).join(', ')}</span>
              </div>
            )}

            {config.notes && (
              <div className="pt-1 text-[11px] text-slate-500">
                <span>ملاحظات: </span>
                <span className="text-slate-700 italic">{config.notes}</span>
              </div>
            )}
          </div>

          {/* Price Total */}
          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-900">المبلغ الإجمالي التقديري:</span>
            <div className="text-left">
              <span className="text-xl font-black text-blue-950 font-mono block">
                {breakdown.grandTotalKWD.toFixed(3)} د.ك
              </span>
              <span className="text-[10px] text-blue-700 font-bold">
                ({breakdown.grandTotalFils} فلس)
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl text-xs shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>إرسال الملفات والطلب للفرع عبر الواتساب</span>
            </button>

            {onNavigateToTracking && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTracking(orderRecord.id);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95"
              >
                <Package className="w-4 h-4 text-blue-400" />
                <span>تتبع حالة هذا الطلب بالرقم ({orderRecord.id})</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-xl text-xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة الإيصال / حفظ كـ PDF</span>
            </button>
          </div>

        </div>

      </div>

      {showDispatchModal && (
        <WhatsAppFileDispatchModal
          config={config}
          breakdown={breakdown}
          trackingId={orderRecord.id}
          onClose={() => setShowDispatchModal(false)}
        />
      )}
    </div>
  );
};
