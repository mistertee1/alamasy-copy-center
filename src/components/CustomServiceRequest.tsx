import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Send, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Palette, 
  Layers, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Building,
  Share2,
  FileCheck
} from 'lucide-react';
import { CustomServiceRequestData, CustomRequestAttachment, ActiveTab } from '../types';
import { createOrderFromCustomRequest } from '../utils/ordersStore';
import { STORE_INFO } from '../data/servicesData';
import { canShareFilesDirectly, shareFilesDirectly } from '../utils/whatsapp';
import { PrintPrepGuideTooltip } from './PrintPrepGuideTooltip';

interface CustomServiceRequestProps {
  onOrderCreated?: (orderId: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

const SERVICE_TYPE_OPTIONS = [
  'تصميم بنرات ورول أب واستاندات معارض',
  'تصنيع دروع تكريم وكؤوس وباجات مغناطيس',
  'تصميم وطباعة استكرات وقص ليزر دي-كت',
  'أختام أوتوماتيكية وشخصية للشركات والمهندسين',
  'ثيمات ومطبوعات أعراس ومواليد وتخرج',
  'طباعة حرارية على الأكواب والتيشرتات والمخدات',
  'تصميم سيرة ذاتية احترافية وتقديم وظائف',
  'بحوث وتقارير وتنسيق مراجع أكاديمية',
  'ترجمة معتمدة للمستندات والشهادات',
  'دفاتر فواتير وسندات مكربنة NCR',
  'طلب تصميم وهوية خاصة أخرى'
];

export const CustomServiceRequest: React.FC<CustomServiceRequestProps> = ({
  onOrderCreated,
  setActiveTab
}) => {
  const [formData, setFormData] = useState<CustomServiceRequestData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceType: SERVICE_TYPE_OPTIONS[0],
    serviceTitle: '',
    dimensions: '',
    quantity: '1',
    colorPreferences: '',
    targetDate: '',
    description: '',
    additionalNotes: '',
    attachedFiles: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    id: string;
    emailSent: boolean;
    customerName: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Uploads (Images, Logos, Vectors, PDFs)
  const handleFiles = (filesList: FileList | null) => {
    if (!filesList) return;

    const newAttachments: CustomRequestAttachment[] = [];
    Array.from(filesList).forEach((file) => {
      // Create local preview URL if image
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      newAttachments.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'file',
        previewUrl,
        rawFile: file
      });
    });

    setFormData((prev) => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...newAttachments]
    }));
  };

  const handleRemoveFile = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((f) => f.id !== id)
    }));
  };

  const handleSendCustomRequestToWhatsApp = async () => {
    if (!submittedOrder) return;
    const rawFiles = formData.attachedFiles
      .map((f) => f.rawFile)
      .filter((f): f is File => f instanceof File);

    const message = `*طلب خدمة مخصصة جديد - ${submittedOrder.id}*
اسم العميل: ${formData.customerName}
الهاتف: ${formData.customerPhone}
البريد: ${formData.customerEmail || 'غير محدد'}
نوع الخدمة: ${formData.serviceType}
الكمية: ${formData.quantity} ${formData.dimensions ? `(المقاس: ${formData.dimensions})` : ''}
${formData.targetDate ? `موعد التسليم المطلوب: ${formData.targetDate}` : ''}

الوصف والمتطلبات:
${formData.description}

عدد المرفقات والتصاميم: ${formData.attachedFiles.length} ملفات`;

    if (rawFiles.length > 0 && canShareFilesDirectly(rawFiles)) {
      const res = await shareFilesDirectly(rawFiles, message, `طلب خدمة مخصصة ${submittedOrder.id}`);
      if (res.success && res.method === 'native_share') {
        return;
      }
    }

    const waUrl = `https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.description.trim()) {
      alert('يرجى ملء الاسم ورقم الهاتف والوصف التفصيلي لطلبك.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Attempt API registration; a successful response is not proof of email delivery.
      let generatedId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      let emailSuccess = false;

      try {
        const response = await fetch('/api/custom-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.trackingId) {
            generatedId = resData.trackingId;
          }
          emailSuccess = Boolean(resData.emailSent);
        }
      } catch (apiErr) {
        console.warn('API call fallback to client storage & mailto/whatsapp', apiErr);
      }

      // 2. Save locally into tracking store
      const finalRequest = { ...formData, id: generatedId };
      const savedOrder = createOrderFromCustomRequest(finalRequest);

      setSubmittedOrder({
        id: savedOrder.id,
        emailSent: emailSuccess,
        customerName: formData.customerName
      });

      if (onOrderCreated) {
        onOrderCreated(savedOrder.id);
      }
    } catch (err) {
      console.error('Error submitting custom request:', err);
      alert('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة أو مراسلتنا عبر الواتساب مباشرة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const generateWhatsAppMessage = () => {
    if (!submittedOrder) return '';
    const message = `*طلب خدمة مخصصة جديد - ${submittedOrder.id}*
اسم العميل: ${formData.customerName}
الهاتف: ${formData.customerPhone}
البريد: ${formData.customerEmail || 'غير محدد'}
نوع الخدمة: ${formData.serviceType}
الكمية: ${formData.quantity} ${formData.dimensions ? `(المقاس: ${formData.dimensions})` : ''}
${formData.targetDate ? `موعد التسليم المطلوب: ${formData.targetDate}` : ''}

الوصف والمتطلبات:
${formData.description}

عدد المرفقات والتصاميم: ${formData.attachedFiles.length} ملفات`;

    return `https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="custom-request" className="py-12 sm:py-16 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>طلب تصميم مخصص وتصنيع مطبوعات خاصة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            نموذج طلب خدمة وتصميم مخصص
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            سجّل تفاصيل الطلب لمراجعتها، ثم أرسلها عبر واتساب إلى فريق الاماسي. التسجيل على هذا الجهاز لا يؤكد قبول الطلب أو إرسال بريد إلكتروني.
          </p>
        </div>

        {submittedOrder ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200 shadow-md text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {submittedOrder.emailSent ? 'تم حفظ طلبك وإرسال إشعار البريد' : 'تم حفظ مسودة الطلب على هذا الجهاز'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              شكرًا لك أستاذ/ة <strong className="text-slate-900">{submittedOrder.customerName}</strong>. لإرسال تفاصيل طلبك للفريق، افتح رسالة واتساب وأكّد إرسالها بنفسك. رقم المسودة وحده لا يعني قبول الطلب.
            </p>

            {/* Tracking ID Badge */}
            <div className="bg-[#0F172A] text-white p-6 rounded-2xl mb-6 text-center">
              <span className="text-xs text-slate-400 block mb-1">رقم تتبع طلبك الخاص:</span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-3xl font-black tracking-widest text-blue-400">
                  {submittedOrder.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyId(submittedOrder.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                احتفظ بهذا الكود لمتابعة حالة الطلب متى شئت.
              </p>
            </div>

            {/* Next Steps Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSendCustomRequestToWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>إرسال الملفات والطلب عبر الواتساب فوراً</span>
              </button>

              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('track-order')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition active:scale-95"
                >
                  <span>الانتقال لصفحة تتبع الطلب الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSubmittedOrder(null);
                  setFormData({
                    customerName: '',
                    customerPhone: '',
                    customerEmail: '',
                    serviceType: SERVICE_TYPE_OPTIONS[0],
                    serviceTitle: '',
                    dimensions: '',
                    quantity: '1',
                    colorPreferences: '',
                    targetDate: '',
                    description: '',
                    additionalNotes: '',
                    attachedFiles: []
                  });
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 py-2 transition"
              >
                تقديم طلب خدمة مخصصة آخر
              </button>
            </div>
          </div>
        ) : (
          /* Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Form Column (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Customer Basic Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                    <span>بيانات التواصل والعميل</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        اسم العميل الكريم <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="text"
                        placeholder="أدخل اسمك الثلاثي"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        رقم الهاتف / الواتساب <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        type="tel"
                        placeholder="مثال: 97445151"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        dir="ltr"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        البريد الإلكتروني للعميل:
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Service Specs */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                    <span>تفاصيل الخدمة والمواصفات</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        نوع وتصنيف الخدمة <span className="text-rose-500">*</span>:
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition font-medium text-slate-800"
                      >
                        {SERVICE_TYPE_OPTIONS.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        عنوان مختصر للمشروع أو المناسبة:
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: رول أب لمعرض مدرسة النعيم، دروع حفل تفوق..."
                        value={formData.serviceTitle}
                        onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        الكمية المطلوبة:
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: 1 حبة، 500 كرت، 3 دروع..."
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        المقاس / الأبعاد (إن وجدت):
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: 85×200 سم، A3، 5×5 سم..."
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        موعد التسليم المستهدف:
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: غداً مساءً، خلال 3 أيام..."
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Description Field */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
                    <span>الوصف التفصيلي والمتطلبات <span className="text-rose-500">*</span></span>
                  </h3>

                  <textarea
                    rows={4}
                    placeholder="اكتب هنا جميع التفاصيل التي تود تضمينها: النصوص والعبارات، الألوان المفضلة، خامات الورق أو القماش، وملاحظات التصميم..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition leading-relaxed"
                    required
                  />
                </div>

                {/* 4. Upload Design Files & Attachments */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">4</span>
                      <span>رفع ملفات التصميم، الشعارات، والرسومات الإضافية</span>
                    </h3>
                    <PrintPrepGuideTooltip buttonText="استفسار: معايير ملفات التصميم والطباعة" variant="pill" />
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                      dragOver 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.ai,.psd,.eps"
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      اسحب وأفلت ملفات التصميم أو الشعارات هنا، أو <span className="text-blue-600 underline">اضغط للاختيار من جهازك</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      نقبل جميع الصيغ: صور، رسومات، لوجوهات مفرغة، ملفات توضيحية.
                    </p>
                  </div>

                  {/* Uploaded Files Preview List */}
                  {formData.attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        الملفات المرفقة ({formData.attachedFiles.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {formData.attachedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {file.previewUrl ? (
                                <img
                                  src={file.previewUrl}
                                  alt={file.name}
                                  className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                              )}
                              <div className="truncate">
                                <span className="font-semibold text-slate-800 block truncate" dir="ltr">
                                  {file.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFile(file.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="حذف الملف"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري حفظ بيانات المسودة...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال الطلب وإصدار كود التتبع الفوري</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>بعد الحفظ استخدم زر واتساب لإرسال التفاصيل. لا يتم إرسال بريد تلقائي حاليًا.</span>
                  </div>
                </div>

              </form>
            </div>

            {/* Right Side Info Bento Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Library Notice Card */}
              <div className="bg-[#0F172A] text-white rounded-[2rem] p-6 sm:p-7 border border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-3">
                  <Building className="w-4 h-4" />
                  <span>مكتبة وخدمات جمعية النعيم</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">
                  سوق القصر المركزي - الدور الميزانين
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  فريقنا المتخصص في التصميم والطباعة يراجع طلباتكم فور ورودها، ونقوم بالتواصل معكم عبر الواتساب لتأكيد البروفة والأسعار قبل البدء.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>بروفة تصميم وموافقة قبل الطباعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>معدات ليزر وماكينات عريضة حديثة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>استلام فوري من فرع الميزانين</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-7 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#25D366] border border-emerald-100 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  تفضل التواصل المباشر بالواتساب؟
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  يمكنك أيضاً إرسال استفسارك أو ملفاتك مباشرة عبر الواتساب للرد الفوري ومناقشة تفاصيل طلبك.
                </p>

                <a
                  href={`https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن خدمة وتصميم مخصص في مكتبة جمعية النعيم سوق القصر')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>محادثة واتساب: {STORE_INFO.phone}</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
