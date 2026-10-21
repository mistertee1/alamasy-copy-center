import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface KnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  amountKWD: string;
  orderTitle: string;
}

/** No bank card data is collected until a real licensed payment integration exists. */
export const KnetModal: React.FC<KnetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="payment-unavailable-title">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button type="button" onClick={onClose} aria-label="إغلاق" className="float-left rounded-lg p-2 text-slate-600 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
        <AlertTriangle className="mb-3 h-8 w-8 text-amber-600" />
        <h2 id="payment-unavailable-title" className="mb-2 text-lg font-bold text-slate-900">الدفع الإلكتروني غير متاح حاليًا</h2>
        <p className="mb-5 text-sm leading-relaxed text-slate-700">
          لا توجد بوابة K-Net حقيقية متصلة بالموقع. لا تدخل بيانات بطاقتك أو الرقم السري هنا.
          تواصل مع فريق الاماسي لتأكيد الرسوم وطريقة السداد المناسبة.
        </p>
        <button type="button" onClick={onClose} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">فهمت</button>
      </div>
    </div>
  );
};
