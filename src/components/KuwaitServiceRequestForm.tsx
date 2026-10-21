import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  CreditCard,
  Phone,
  User,
  MapPin,
  Send,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  FileCheck,
  ShieldCheck,
  Printer,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  CLEARANCE_CATEGORIES,
  KUWAIT_CLEARANCE_SERVICES
} from '../data/kuwaitClearanceServices';
import { ClearanceServiceItem, UploadedFile, ActiveTab } from '../types';
import { createOrderFromClearanceRequest } from '../utils/ordersStore';
import { formatClearanceServiceWhatsAppMessage, createClearanceServiceWhatsAppUrl } from '../utils/whatsapp';
import { STORE_INFO } from '../data/servicesData';
import { KnetModal } from './KnetModal';

interface KuwaitServiceRequestFormProps {
  initialServiceId?: string;
  onOrderCreated?: (orderId: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const KuwaitServiceRequestForm: React.FC<KuwaitServiceRequestFormProps> = ({
  initialServiceId,
  onOrderCreated,
  setActiveTab,
}) => {
  // Step navigation: 1 = Service Details, 2 = Attachments, 3 = Contact & Payment, 4 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || 'residency-renewal'
  );

  // Residency Specific fields
  const [residencyArticle, setResidencyArticle] = useState<string>('مادة 18 (عمل أهلي)');
  const [renewalDuration, setRenewalDuration] = useState<string>('سنة واحدة');
  const [civilIdNumber, setCivilIdNumber] = useState<string>('');

  // Company Specific fields
  const [companyType, setCompanyType] = useState<string>('شركة ذات مسؤولية محدودة (ذ.م.م)');
  const [companySuggestedName, setCompanySuggestedName] = useState<string>('');

  // Customs Specific fields
  const [portType, setPortType] = useState<string>('ميناء الشويخ (بحري)');
  const [shipmentType, setShipmentType] = useState<string>('بضائع ومواد استهلاكية');
  const [policyNumber, setPolicyNumber] = useState<string>('');

  // Traffic / Civil ID fields
  const [subTransactionType, setSubTransactionType] = useState<string>('تجديد دفتر مركبة');

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [paciNumber, setPaciNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'knet_paid' | 'knet_link' | 'branch_pay'>('knet_link');
  const [knetReference, setKnetReference] = useState<string>('');
  const [showKnetModal, setShowKnetModal] = useState<boolean>(false);

  // Attached files
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [civilIdFile, setCivilIdFile] = useState<File | null>(null);
  const [workPermitOrHealthFile, setWorkPermitOrHealthFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<{ id: string; file: File; label?: string }[]>([]);

  // Submission state
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const extraFileInputRef = useRef<HTMLInputElement>(null);

  // Current active service item
  const currentService: ClearanceServiceItem =
    KUWAIT_CLEARANCE_SERVICES.find((s) => s.id === selectedServiceId) ||
    KUWAIT_CLEARANCE_SERVICES[0];

  // If initialServiceId changes
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Handle adding extra files
  const handleExtraFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added: { id: string; file: File; label?: string }[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        added.push({
          id: `${Date.now()}-${i}`,
          file: e.target.files[i],
          label: 'مستند إضافي',
        });
      }
      setExtraFiles((prev) => [...prev, ...added]);
    }
  };

  const removeExtraFile = (id: string) => {
    setExtraFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Compile all files list
  const getCompiledFilesList = () => {
    const list: { name: string; size?: number; type?: string; label?: string; rawFile?: File }[] = [];

    if (passportFile) {
      list.push({
        name: passportFile.name,
        size: passportFile.size,
        type: passportFile.type,
        label: 'جواز السفر',
        rawFile: passportFile,
      });
    }
    if (civilIdFile) {
      list.push({
        name: civilIdFile.name,
        size: civilIdFile.size,
        type: civilIdFile.type,
        label: 'البطاقة المدنية',
        rawFile: civilIdFile,
      });
    }
    if (workPermitOrHealthFile) {
      list.push({
        name: workPermitOrHealthFile.name,
        size: workPermitOrHealthFile.size,
        type: workPermitOrHealthFile.type,
        label: 'اعتماد القوى العاملة / الضمان الصحي',
        rawFile: workPermitOrHealthFile,
      });
    }
    extraFiles.forEach((ef) => {
      list.push({
        name: ef.file.name,
        size: ef.file.size,
        type: ef.file.type,
        label: ef.label || 'مستند إضافي',
        rawFile: ef.file,
      });
    });

    return list;
  };

  // Build request summary details string
  const compileRequestDetails = () => {
    const parts: string[] = [];
    if (selectedServiceId.includes('residency')) {
      parts.push(`الإقامة: ${residencyArticle}`);
      parts.push(`المدة: ${renewalDuration}`);
      if (civilIdNumber) parts.push(`الرقم المدني: ${civilIdNumber}`);
    } else if (selectedServiceId.includes('company')) {
      parts.push(`الكيان: ${companyType}`);
      if (companySuggestedName) parts.push(`الاسم التجاري المقترح: ${companySuggestedName}`);
    } else if (selectedServiceId.includes('customs')) {
      parts.push(`المنفذ: ${portType}`);
      parts.push(`الشحنة: ${shipmentType}`);
      if (policyNumber) parts.push(`رقم البوليصة: ${policyNumber}`);
    } else {
      parts.push(`نوع الإجراء: ${subTransactionType}`);
      if (civilIdNumber) parts.push(`الرقم المدني/الموحد: ${civilIdNumber}`);
    }
    return parts.join(' • ');
  };

  // Form Submit: Save to Orders Database & Show Success / WhatsApp Dispatch
  const handleSubmit = (target: 'dashboard' | 'whatsapp') => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف/الواتساب للمتابعة');
      return;
    }

    setIsSubmitting(true);
    const orderId = `KW-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const files = getCompiledFilesList();

    // 1. Create order in store
    createOrderFromClearanceRequest({
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceTitle: currentService.name,
      officialEntity: currentService.officialEntity,
      details: compileRequestDetails(),
      files: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl: f.rawFile && f.type?.startsWith('image/') ? URL.createObjectURL(f.rawFile) : undefined,
      })),
      totalCost:
        paymentMethod === 'knet_paid'
          ? 'تم الدفع بالكامل عبر K-Net'
          : 'سيتم تحديدها وإرسال رابط K-Net بعد مراجعة الأوراق',
      estimatedTime: currentService.estimatedTime,
      notes: notes.trim() || undefined,
      paymentMethod,
      knetReference: knetReference || undefined,
    });

    setCreatedOrderId(orderId);
    setIsSubmitting(false);
    setCurrentStep(4);

    if (onOrderCreated) {
      onOrderCreated(orderId);
    }

    // If direct WhatsApp chosen, open it immediately
    if (target === 'whatsapp') {
      const msg = formatClearanceServiceWhatsAppMessage({
        orderId,
        serviceName: currentService.name,
        categoryName: currentService.categoryName,
        officialEntity: currentService.officialEntity,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || undefined,
        paciNumber: paciNumber.trim() || undefined,
        residencyArticle: selectedServiceId.includes('residency') ? residencyArticle : undefined,
        renewalDuration: selectedServiceId.includes('residency') ? renewalDuration : undefined,
        civilIdNumber: civilIdNumber.trim() || undefined,
        companyType: selectedServiceId.includes('company') ? companyType : undefined,
        companySuggestedName: companySuggestedName.trim() || undefined,
        portType: selectedServiceId.includes('customs') ? portType : undefined,
        shipmentType: selectedServiceId.includes('customs') ? shipmentType : undefined,
        policyNumber: policyNumber.trim() || undefined,
        paymentMethod,
        knetReference: knetReference || undefined,
        attachedFiles: files,
        notes: notes.trim() || undefined,
      });

      window.open(createClearanceServiceWhatsAppUrl(msg), '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام طلب المعاملات الحكومية والتخليص الجمركي بالكويت</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-2 text-white">
            نموذج تقديم ومتابعة المعاملات الرسمية
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            اختر الخدمة المطلوبة، ارفع المستندات، وحدد طريقة الدفع لتصل إلى موظف التعقيب بالجمعية مباشرة أو تحويلها بضغطة زر إلى واتساب المكتب.
          </p>

          <div className="flex items-center gap-4 mt-5 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>معتمد رسمياً بسوق القصر المركزي</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-300">
              <Clock className="w-4 h-4" />
              <span>متابعة على مدار الساعة</span>
            </span>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
        {[
          { step: 1, title: 'تفاصيل المعاملة', icon: FileText },
          { step: 2, title: 'المستندات المطلوبة', icon: Upload },
          { step: 3, title: 'التواصل والدفع', icon: CreditCard },
          { step: 4, title: 'التنفيذ والمتابعة', icon: CheckCircle2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;

          return (
            <div
              key={item.step}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : isPassed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : isPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold block truncate">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">

        {/* ========================================================= */}
        {/* STEP 1: اختيار وتفاصيل المعاملة */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>الخطوة الأولى: اختيار المعاملة وتفاصيلها</span>
              </h2>
              <p className="text-xs text-slate-500">
                حدد المعاملة المطلوبة لتظهر لك الحقول والمستندات الخاصة بها تلقائياً.
              </p>
            </div>

            {/* Service Selection Dropdown & Categories */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  اختر المعاملة المطلوبة:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {CLEARANCE_CATEGORIES.map((cat) => (
                    <optgroup key={cat.id} label={`== ${cat.name} ==`}>
                      {KUWAIT_CLEARANCE_SERVICES.filter((s) => s.category === cat.id).map((serv) => (
                        <option key={serv.id} value={serv.id}>
                          {serv.name} — ({serv.officialEntity})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Service Highlight Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-blue-950 text-sm">{currentService.name}</span>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    {currentService.officialEntity}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{currentService.detailedDesc}</p>
                <div className="flex items-center gap-4 text-slate-500 pt-1">
                  <span>⏱️ الوقت المقدر للإنجاز: <strong>{currentService.estimatedTime}</strong></span>
                </div>
              </div>
            </div>

            {/* Dynamic Specific Fields based on Service Type */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-800">
                بيانات وتفاصيل المعاملة المحددة:
              </h3>

              {/* A. If Residency Service (تجديد وإصدار إقامة، نقل كفالة، إلخ) */}
              {selectedServiceId.includes('residency') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      1. نوع الإقامة المطلوبة:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'مادة 18 (عمل أهلي)', label: 'مادة 18 عمل أهلي', desc: 'موظفي وعمال الشركات والقطاع الخاص' },
                        { id: 'مادة 20 (عمالة منزلية)', label: 'مادة 20 عمالة منزلية', desc: 'سائق، خادم، طباخ على كفيل كويتي' },
                        { id: 'مادة 22 (التحاق بعائل)', label: 'مادة 22 التحاق بعائل', desc: 'الزوجة والأبناء والوالدين' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setResidencyArticle(item.id)}
                          className={`p-3 rounded-xl border text-right transition ${
                            residencyArticle === item.id
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="block font-bold text-xs">{item.label}</span>
                          <span className={`text-[10px] mt-0.5 block ${residencyArticle === item.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        2. مدة التجديد المطلوبة:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['سنة واحدة', 'سنتين'].map((dur) => (
                          <button
                            type="button"
                            key={dur}
                            onClick={() => setRenewalDuration(dur)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                              renewalDuration === dur
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        3. الرقم المدني أو الرقم الموحد للوافد (اختياري):
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="أدخل 12 رقماً"
                        value={civilIdNumber}
                        onChange={(e) => setCivilIdNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* B. If Company / Business Service (تأسيس شركات، تراخيص) */}
              {selectedServiceId.includes('company') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      الشكل القانوني للشركة:
                    </label>
                    <select
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    >
                      <option>شركة الشخص الواحد (W.L.L)</option>
                      <option>شركة ذات مسؤولية محدودة (ذ.م.م)</option>
                      <option>شركة تضامنية</option>
                      <option>مؤسسة فردية / فرع شركة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      الاسم التجاري المقترح (3 خيارات لحجز الاسم):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: شركة الخليج للخدمات اللوجستية / الصقر للتجارة"
                      value={companySuggestedName}
                      onChange={(e) => setCompanySuggestedName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* C. If Customs Clearance Service */}
              {selectedServiceId.includes('customs') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      المنفذ الجمركي المستهدف:
                    </label>
                    <select
                      value={portType}
                      onChange={(e) => setPortType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    >
                      <option>ميناء الشويخ (بحري)</option>
                      <option>ميناء الشعيبة (بحري)</option>
                      <option>مطار الكويت الدولي (جوي)</option>
                      <option>منفذ النويصيب (بري)</option>
                      <option>منفذ السالمي (بري)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      رقم بوليصة الشحن / البيان (إن وجد):
                    </label>
                    <input
                      type="text"
                      placeholder="رقم B/L أو Airway Bill"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* D. Other Services (Traffic / Civil ID / Translation) */}
              {!selectedServiceId.includes('residency') &&
                !selectedServiceId.includes('company') &&
                !selectedServiceId.includes('customs') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        نوع المعاملة المطلوب تنفيذها:
                      </label>
                      <input
                        type="text"
                        value={subTransactionType}
                        onChange={(e) => setSubTransactionType(e.target.value)}
                        placeholder="اكتب المعاملة المحددة بالتفصيل"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        الرقم المدني / رقم اللوحة / رقم الملف:
                      </label>
                      <input
                        type="text"
                        value={civilIdNumber}
                        onChange={(e) => setCivilIdNumber(e.target.value)}
                        placeholder="بيانات التعريف الرسمية"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>الانتقال لرفع المستندات</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: رفع المستندات (Upload Attachments) */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>الخطوة الثانية: رفع المستندات والمرفقات (PDF أو صور)</span>
              </h2>
              <p className="text-xs text-slate-500">
                ارفع المستندات المطلوبة الخاصة بالمعاملة لتدقيقها بواسطة فني وموظف التعقيب.
              </p>
            </div>

            {/* Checklist of required documents for this service */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-amber-900 block">
                📋 قائمة المستندات الرسمية الموصى بها لهذه المعاملة:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-amber-950 font-medium list-disc list-inside">
                {currentService.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="truncate" title={doc}>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Upload Dropzones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 1. Passport */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 bg-slate-50 text-center transition flex flex-col items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800 mb-1">
                  1. صورة جواز السفر
                </span>
                <span className="text-[10px] text-slate-500 mb-3">
                  (ملف PDF أو صورة واضحة)
                </span>

                {passportFile ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 font-bold flex items-center justify-between gap-1">
                    <span className="truncate">{passportFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setPassportFile(null)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition text-center">
                    <span>اختيار الملف</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPassportFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* 2. Civil ID */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 bg-slate-50 text-center transition flex flex-col items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800 mb-1">
                  2. البطاقة المدنية
                </span>
                <span className="text-[10px] text-slate-500 mb-3">
                  (الوجهين أو ملف PDF)
                </span>

                {civilIdFile ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 font-bold flex items-center justify-between gap-1">
                    <span className="truncate">{civilIdFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setCivilIdFile(null)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition text-center">
                    <span>اختيار الملف</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCivilIdFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* 3. Labor Permit / Health Insurance */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 bg-slate-50 text-center transition flex flex-col items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800 mb-1">
                  3. اعتماد التوقيع / الضمان
                </span>
                <span className="text-[10px] text-slate-500 mb-3">
                  (إذن العمل أو بوليصة الشحن)
                </span>

                {workPermitOrHealthFile ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 font-bold flex items-center justify-between gap-1">
                    <span className="truncate">{workPermitOrHealthFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setWorkPermitOrHealthFile(null)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition text-center">
                    <span>اختيار الملف</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setWorkPermitOrHealthFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Extra Documents Upload Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>إرفاق مستندات وعقود إضافية (اختياري):</span>
                </span>
                <button
                  type="button"
                  onClick={() => extraFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-blue-700 transition flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>إضافة مستندات أخرى</span>
                </button>
                <input
                  type="file"
                  ref={extraFileInputRef}
                  multiple
                  accept=".pdf,image/*,.docx"
                  className="hidden"
                  onChange={handleExtraFilesUpload}
                />
              </div>

              {extraFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  {extraFiles.map((ef) => (
                    <div
                      key={ef.id}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{ef.file.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({(ef.file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExtraFile(ef.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                العودة للتفاصيل
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>الانتقال لبيانات التواصل والدفع</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: بيانات التواصل والدفع */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>الخطوة الثالثة: بيانات التواصل وطريقة الدفع</span>
              </h2>
              <p className="text-xs text-slate-500">
                أدخل بياناتك للتواصل وتأكيد المعاملة، واختر طريقة الدفع المناسبة لك.
              </p>
            </div>

            {/* Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم العميل الكامل: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="الاسم الثلاثي أو الرباعي"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-9 pl-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف / الواتساب: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="رقم الهاتف للتواصل (مثال: 97445151)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-9 pl-3 text-xs font-bold font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العنوان السكني / المنطقة:
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    placeholder="المحافظة، المنطقة، القطعة، الشارع"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-9 pl-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الرقم الآلي للعنوان (PACI للبيت):
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="8 أرقام (الرقم الآلي للهيئة المدنية)"
                  value={paciNumber}
                  onChange={(e) => setPaciNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-bold font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ملاحظات إضافية للموظف:
              </label>
              <textarea
                rows={2}
                placeholder="أية توجيهات خاصة، أسماء الشركاء، أو مواعيد مستعجلة..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-black text-slate-900">
                اختر طريقة الدفع المفضلة:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. K-Net Link Later */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('knet_link')}
                  className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'knet_link'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xs text-blue-900">إرسال رابط K-Net لاحقاً</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                        الأكثر اختياراً
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      يقوم موظف المكتب بمراجعة الأوراق وتحديد الرسوم بدقة ثم إرسال رابط K-Net لك على الواتساب.
                    </p>
                  </div>
                </button>

                {/* 2. Direct Instant K-Net */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('knet_paid');
                    if (!knetReference) {
                      setShowKnetModal(true);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'knet_paid'
                      ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xs text-emerald-900">دفع فوري الآن K-Net</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        فوري وآمن
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      سداد رسوم فتح المعاملة (5.000 د.ك) مباشرة عبر محاكي بوابة K-Net الكويتية.
                    </p>
                  </div>

                  {knetReference && (
                    <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-white p-1 rounded border border-emerald-200">
                      ✓ تم الدفع (مرجع: {knetReference})
                    </div>
                  )}
                </button>

                {/* 3. Branch / Pickup Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('branch_pay')}
                  className={`p-3.5 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === 'branch_pay'
                      ? 'bg-slate-100 border-slate-600 ring-2 ring-slate-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xs text-slate-800">الدفع عند المراجعة</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                        في الفرع
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      السداد نقداً أو عبر جهاز K-Net في مكتبة جمعية النعيم سوق القصر المركزي بالدور الميزانين.
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* Submission Actions Dual Option */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
              <span className="text-xs font-black text-slate-800 block">
                خيارات الإرسال والتنفيذ:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Option 1: WhatsApp Direct Link */}
                <button
                  type="button"
                  onClick={() => handleSubmit('whatsapp')}
                  disabled={isSubmitting}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال فوري عبر الواتساب (موصى به)</span>
                </button>

                {/* Option 2: Dashboard System Order */}
                <button
                  type="button"
                  onClick={() => handleSubmit('dashboard')}
                  disabled={isSubmitting}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Building2 className="w-4 h-4" />
                  <span>تسجيل في لوحة التحكم وتوليد كود التتبع</span>
                </button>

              </div>

              <p className="text-[11px] text-slate-500 text-center">
                كلا الخيارين يقومان بتسجيل طلبك وإرسال إشعار فوري لموظف التعقيب لبدء إنجاز المعاملة.
              </p>
            </div>

            {/* Back Button */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                العودة للمستندات
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: النجاح وتأكيد الطلب والتتبع */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 mb-2">
                تم تسجيل طلب المعاملة بنجاح!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                تم إدراج معاملتك في نظام الإدارة والمتابعة، وتم إشعار موظف التعقيب لمراجعة الأوراق وبدء الإجراءات.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-4 max-w-sm mx-auto">
              <span className="text-xs text-slate-500 block mb-1 font-bold">كود المتابعة الرسمي (Tracking ID):</span>
              <span className="text-2xl font-black text-blue-700 font-mono tracking-wider">
                {createdOrderId}
              </span>
            </div>

            {/* Quick Actions for Order */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const msg = formatClearanceServiceWhatsAppMessage({
                    orderId: createdOrderId,
                    serviceName: currentService.name,
                    categoryName: currentService.categoryName,
                    officialEntity: currentService.officialEntity,
                    customerName: customerName.trim(),
                    customerPhone: customerPhone.trim(),
                    customerAddress: customerAddress.trim() || undefined,
                    paciNumber: paciNumber.trim() || undefined,
                    residencyArticle: selectedServiceId.includes('residency') ? residencyArticle : undefined,
                    renewalDuration: selectedServiceId.includes('residency') ? renewalDuration : undefined,
                    civilIdNumber: civilIdNumber.trim() || undefined,
                    companyType: selectedServiceId.includes('company') ? companyType : undefined,
                    companySuggestedName: companySuggestedName.trim() || undefined,
                    portType: selectedServiceId.includes('customs') ? portType : undefined,
                    shipmentType: selectedServiceId.includes('customs') ? shipmentType : undefined,
                    policyNumber: policyNumber.trim() || undefined,
                    paymentMethod,
                    knetReference: knetReference || undefined,
                    attachedFiles: getCompiledFilesList(),
                    notes: notes.trim() || undefined,
                  });
                  window.open(createClearanceServiceWhatsAppUrl(msg), '_blank');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>إعادة فتح في الواتساب</span>
              </button>

              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('track-order')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>متابعة في صفحة تتبع الطلبات</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة إشعار الاستلام</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* K-Net Simulator Modal */}
      <KnetModal
        isOpen={showKnetModal}
        onClose={() => setShowKnetModal(false)}
        onSuccess={(ref) => {
          setKnetReference(ref);
          setShowKnetModal(false);
        }}
        amountKWD="5.000 د.ك"
        orderTitle={currentService.name}
      />

    </div>
  );
};
