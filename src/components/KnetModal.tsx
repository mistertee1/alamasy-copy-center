import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, X, ArrowRight, Lock } from 'lucide-react';

interface KnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  amountKWD: string;
  orderTitle: string;
}

const KUWAIT_BANKS = [
  { id: 'nbk', name: 'بنك الكويت الوطني (NBK)', prefix: '5160' },
  { id: 'kfh', name: 'بيت التمويل الكويتي (KFH)', prefix: '4507' },
  { id: 'boubyan', name: 'بنك بوبيان (Boubyan)', prefix: '4040' },
  { id: 'gulf', name: 'بنك الخليج (Gulf Bank)', prefix: '4282' },
  { id: 'burgan', name: 'بنك برقان (Burgan)', prefix: '4036' },
  { id: 'warba', name: 'بنك وربة (Warba)', prefix: '5324' },
  { id: 'cbk', name: 'البنك التجاري الكويتي (CBK)', prefix: '5211' },
  { id: 'ahli', name: 'البنك الأهلي الكويتي (ABK)', prefix: '4152' },
];

export const KnetModal: React.FC<KnetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amountKWD,
  orderTitle,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('nbk');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [generatedRef, setGeneratedRef] = useState<string>('');

  if (!isOpen) return null;

  const currentBank = KUWAIT_BANKS.find((b) => b.id === selectedBank) || KUWAIT_BANKS[0];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const ref = `KNET-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedRef(ref);
      setIsProcessing(false);
      setIsDone(true);

      setTimeout(() => {
        onSuccess(ref);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* K-Net Header styling */}
        <div className="bg-gradient-to-r from-[#003B73] via-[#00529B] to-[#0072CE] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-md shadow-xs">
              <span className="font-black text-xs text-[#00529B] tracking-wider">K-NET</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">بوابة الدفع الإلكتروني K-Net</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>اتصال آمن وموثق 256-bit SSL</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">المعاملة:</span>
            <span className="font-bold text-slate-800 line-clamp-1">{orderTitle}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500 block">المبلغ الإجمالي:</span>
            <span className="font-black text-base text-blue-700">{amountKWD}</span>
          </div>
        </div>

        {/* Content */}
        {isDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">تمت عملية الدفع بنجاح!</h4>
            <p className="text-xs text-slate-600">
              تم خصم الرسوم وتأكيد المعاملة لدى شبكة K-Net الكويتية.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs font-mono font-bold text-emerald-800">
              رقم المرجع (Ref ID): {generatedRef}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-5 space-y-4 text-xs">
            {/* Bank Select */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">اختر البنك الكويتي:</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {KUWAIT_BANKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم بطاقة السحب الآلي K-Net:</label>
              <div className="relative">
                <div className="absolute right-3 top-2.5 font-mono text-slate-400 font-bold">
                  {currentBank.prefix}
                </div>
                <input
                  type="text"
                  maxLength={12}
                  required
                  placeholder="•••• •••• ••••"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-16 pl-3 font-mono font-bold text-slate-800 tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Expiry & PIN */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">تاريخ الانتهاء:</label>
                <div className="grid grid-cols-2 gap-1 font-mono">
                  <select className="bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-center">
                    <option>09</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                  </select>
                  <select className="bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-center">
                    <option>26</option>
                    <option>27</option>
                    <option>28</option>
                    <option>29</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الرقم السري (PIN):</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-center font-mono font-bold text-slate-800 text-sm tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>هذه عملية محاكاة تجريبية آمنة تحاكي بوابة K-Net الكويتية لاعتماد الطلب فورياً.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-[#00529B] to-[#0072CE] hover:from-[#003B73] hover:to-[#00529B] text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري التواصل مع شبكة K-Net...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد وسداد رسوم المعاملة ({amountKWD})</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
