import React, { useState, useMemo } from 'react';
import { 
  FileUp, 
  FileText, 
  Trash2, 
  Check, 
  Plus, 
  Minus, 
  MessageCircle, 
  Calculator, 
  Sparkles, 
  Info, 
  Printer, 
  Copy, 
  Receipt,
  FileCheck,
  AlertCircle,
  Image as ImageIcon,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { 
  PrintOrderConfig, 
  PriceBreakdown, 
  UploadedFile, 
  ColorMode, 
  PaperSize, 
  PrintSides, 
  BindingType 
} from '../types';
import { PRICING_RATES, STORE_INFO } from '../data/servicesData';
import { createQuickPrintWhatsAppUrl, canShareFilesDirectly, shareFilesDirectly, getRawPriceBreakdownText } from '../utils/whatsapp';
import { createOrderFromQuickPrint } from '../utils/ordersStore';
import { WhatsAppFileDispatchModal } from './WhatsAppFileDispatchModal';
import { PrintPrepGuideTooltip } from './PrintPrepGuideTooltip';
import { PdfFileEditorItem } from './PdfFileEditorItem';
import { extractPdfPageCount } from '../utils/pdfHelper';

interface QuickPrintProps {
  onShowReceipt?: (config: PrintOrderConfig, breakdown: PriceBreakdown) => void;
}

export const QuickPrint: React.FC<QuickPrintProps> = ({ onShowReceipt }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageCount, setPageCount] = useState<number>(5);
  const [colorMode, setColorMode] = useState<ColorMode>('black_white');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4_standard');
  const [sides, setSides] = useState<PrintSides>('single');
  const [binding, setBinding] = useState<BindingType>('none');
  const [copies, setCopies] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('');

  // Synchronizes total order pages with the uploaded files (sum of effective pages)
  const syncTotalPages = (fileList: UploadedFile[]) => {
    if (fileList.length === 0) return;
    const total = fileList.reduce((sum, f) => {
      return sum + (f.effectivePages || f.actualPdfPages || f.pageCountEstimate || 1);
    }, 0);
    setPageCount(Math.max(1, total));
  };

  // File Upload Handlers (with real PDF page extraction)
  const handleFilesAdded = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const lowerName = f.name.toLowerCase();
      const isPdf = lowerName.endsWith('.pdf') || f.type.includes('pdf');

      let pages = 1;
      let isExact = false;

      if (isPdf) {
        const countRes = await extractPdfPageCount(f);
        pages = countRes.pageCount;
        isExact = countRes.isExact;
      } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
        pages = Math.max(1, Math.round(f.size / (50 * 1024)));
      } else if (lowerName.endsWith('.pptx') || lowerName.endsWith('.ppt')) {
        pages = Math.max(1, Math.round(f.size / (150 * 1024)));
      } else {
        pages = 1;
      }

      newFiles.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        size: f.size,
        type: f.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
        pageCountEstimate: pages,
        rawFile: f,
        previewUrl: isPdf || f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
        isPdf,
        actualPdfPages: isPdf ? pages : undefined,
        printRangeType: 'all',
        customPagesRange: '',
        effectivePages: pages,
        isExactCount: isExact,
      });
    }

    setFiles((prev) => {
      const updated = [...prev, ...newFiles];
      syncTotalPages(updated);
      return updated;
    });
  };

  // Update specific file settings (such as page count or range from PdfFileEditorItem)
  const handleUpdateFile = (updatedFile: UploadedFile) => {
    setFiles((prev) => {
      const updated = prev.map((f) => (f.id === updatedFile.id ? updatedFile : f));
      syncTotalPages(updated);
      return updated;
    });
  };

  // Replace an existing file with a new file
  const handleReplaceFile = async (id: string, newFile: File) => {
    const isPdf = newFile.name.toLowerCase().endsWith('.pdf') || newFile.type.includes('pdf');
    let pages = 1;
    let isExact = false;
    if (isPdf) {
      const res = await extractPdfPageCount(newFile);
      pages = res.pageCount;
      isExact = res.isExact;
    }

    setFiles((prev) => {
      const updated = prev.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          name: newFile.name,
          size: newFile.size,
          type: newFile.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
          rawFile: newFile,
          previewUrl: isPdf || newFile.type.startsWith('image/') ? URL.createObjectURL(newFile) : undefined,
          isPdf,
          actualPdfPages: pages,
          pageCountEstimate: pages,
          effectivePages: pages,
          printRangeType: 'all' as const,
          customPagesRange: '',
          isExactCount: isExact,
        };
      });
      syncTotalPages(updated);
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const remaining = prev.filter((f) => f.id !== id);
      if (remaining.length > 0) {
        syncTotalPages(remaining);
      }
      return remaining;
    });
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Dynamic Price Breakdown calculation
  const breakdown: PriceBreakdown = useMemo(() => {
    // 1. Base cost per page in fils
    let basePrintFils = PRICING_RATES.black_white; // 15
    if (colorMode === 'color_standard') basePrintFils = PRICING_RATES.color_standard; // 70
    if (colorMode === 'color_premium') basePrintFils = PRICING_RATES.color_premium; // 100

    // Paper addition in fils
    let paperFils = 0;
    if (paperSize === 'a4_heavy') paperFils = PRICING_RATES.paper_a4_heavy; // 25
    if (paperSize === 'a3_standard') paperFils = PRICING_RATES.paper_a3_standard; // 50
    if (paperSize === 'a3_color') paperFils = PRICING_RATES.paper_a3_color; // 150
    if (paperSize === 'glossy') paperFils = PRICING_RATES.paper_glossy; // 60

    const totalPerSheetFils = basePrintFils + paperFils;

    // 2. Physical sheets needed per copy
    // If double sided, 2 pages fit on 1 sheet
    const sheetsPerCopy = sides === 'double' ? Math.ceil(pageCount / 2) : pageCount;

    // Printing cost for 1 copy
    // Note: if double sided, printing is usually calculated per printed side (page), plus paper per physical sheet
    const printingCostPerCopy = (pageCount * basePrintFils) + (sheetsPerCopy * paperFils);

    // 3. Binding cost per copy
    let bindingFils = 0;
    if (binding === 'staple') bindingFils = PRICING_RATES.binding_staple;
    if (binding === 'spiral_plastic') bindingFils = PRICING_RATES.binding_spiral_plastic;
    if (binding === 'wire_metal') bindingFils = PRICING_RATES.binding_wire_metal;
    if (binding === 'lamination') bindingFils = PRICING_RATES.binding_lamination * sheetsPerCopy;

    const singleCopyTotalFils = printingCostPerCopy + bindingFils;
    const grandTotalFils = singleCopyTotalFils * copies;
    const grandTotalKWD = grandTotalFils / 1000;

    // Format display: e.g., 0.750 د.ك (750 فلس)
    const formattedKWD = `${grandTotalKWD.toFixed(3)} د.ك (${grandTotalFils} فلس)`;

    return {
      basePerSheetCost: totalPerSheetFils,
      paperSheetsPerCopy: sheetsPerCopy,
      printingCostPerCopy,
      bindingCostPerCopy: bindingFils,
      singleCopyTotal: singleCopyTotalFils,
      copies,
      grandTotalFils,
      grandTotalKWD,
      formattedKWD,
    };
  }, [pageCount, colorMode, paperSize, sides, binding, copies]);

  const currentConfig: PrintOrderConfig = {
    files,
    pageCount,
    colorMode,
    paperSize,
    sides,
    binding,
    copies,
    notes,
    customerName,
    customerPhone,
  };

  const handleSendToWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save order record to store for tracking
    const order = createOrderFromQuickPrint(currentConfig, breakdown);
    setActiveTrackingId(order.id);

    const rawFiles = files.map((f) => f.rawFile).filter((f): f is File => f instanceof File);
    
    // If mobile web share is supported and files are attached, try sharing directly
    if (rawFiles.length > 0 && canShareFilesDirectly(rawFiles)) {
      const msg = getRawPriceBreakdownText(currentConfig, breakdown);
      const res = await shareFilesDirectly(rawFiles, msg, 'طلب طباعة مستندات - جمعية النعيم');
      if (res.success && res.method === 'native_share') {
        return;
      }
    }

    // Show interactive file dispatch modal for desktop/web or direct WhatsApp link
    setShowDispatchModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileBadge = (file: UploadedFile) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '') || file.type.startsWith('image/')) {
      return { icon: <ImageIcon className="w-4 h-4 text-pink-600" />, label: 'صورة', bg: 'bg-pink-50 border-pink-100 text-pink-700' };
    }
    if (['pdf'].includes(ext || '') || file.type.includes('pdf')) {
      return { icon: <FileText className="w-4 h-4 text-red-600" />, label: 'PDF', bg: 'bg-red-50 border-red-100 text-red-700' };
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return { icon: <FileText className="w-4 h-4 text-blue-600" />, label: 'Word', bg: 'bg-blue-50 border-blue-100 text-blue-700' };
    }
    if (['ppt', 'pptx'].includes(ext || '')) {
      return { icon: <FileText className="w-4 h-4 text-amber-600" />, label: 'PowerPoint', bg: 'bg-amber-50 border-amber-100 text-amber-700' };
    }
    return { icon: <FileCheck className="w-4 h-4 text-emerald-600" />, label: 'مستند', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' };
  };

  return (
    <section id="quick-print" className="py-12 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-black mb-3">
            <Printer className="w-3.5 h-3.5" />
            <span>حاسبة الطباعة الفورية وإرسال الملفات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            ارفع ملفاتك واحسب تكلفة الطباعة فوراً
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            حدد خيارات الطباعة، نوع الورق والتجليد، واحصل على السعر الشفاف بدقة، ثم أرسل طلبك بنقرة واحدة عبر الواتساب للاستلام الفوري من سوق القصر بالميزانين.
          </p>
        </div>

        <form onSubmit={handleSendToWhatsApp}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: File Uploader & Options (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. File Upload Box */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                    <span>رفع المستندات والملفات (اختياري)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <PrintPrepGuideTooltip buttonText="زر الاستفسار: كيف تجهّز ملفك للطباعة؟" variant="pill" />
                  </div>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload-input"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    onChange={(e) => handleFilesAdded(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <FileUp className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                    اسحب وأفلت الملفات هنا، أو انقر للاختيار
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                    يمكنك أيضاً إرسال الملفات مباشرة عبر محادثة الواتساب بعد تحديد الخيارات.
                  </p>
                  <label
                    htmlFor="file-upload-input"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تصفح الملفات من جهازك</span>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
                      <span>الملفات المحددة للطباعة ({files.length}):</span>
                      <div className="flex items-center gap-2">
                        {files.some((f) => f.isPdf || f.name.toLowerCase().endsWith('.pdf')) && (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1 font-semibold text-[11px]">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>يمكنك تعديل صفحات ونطاق الـ PDF مباشرة</span>
                          </span>
                        )}
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">إرسال كامل للملف عبر الواتساب</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {files.map((file) => {
                        const isPdf = file.isPdf || file.name.toLowerCase().endsWith('.pdf');

                        // If PDF, render the full interactive PDF editor item
                        if (isPdf) {
                          return (
                            <PdfFileEditorItem
                              key={file.id}
                              file={file}
                              onUpdate={handleUpdateFile}
                              onRemove={removeFile}
                              onReplaceFile={handleReplaceFile}
                            />
                          );
                        }

                        // Otherwise render standard clean file badge item
                        const badge = getFileBadge(file);
                        return (
                          <div
                            key={file.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {file.previewUrl ? (
                                <img
                                  src={file.previewUrl}
                                  alt={file.name}
                                  className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                                  {badge.icon}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 truncate block">{file.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] px-2 py-0.2 rounded-md font-bold border ${badge.bg}`}>
                                    {badge.label}
                                  </span>
                                  <span className="text-slate-400 text-[10px]">({formatFileSize(file.size)})</span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="حذف الملف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Print Specifications (الخيارات والخصائص) */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</span>
                    <span>خيارات الطباعة والمواصفات</span>
                  </h3>
                  <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                    حساب فوري دقيق
                  </span>
                </div>

                {/* A. Page Count & Copies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Page Count */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700">
                        عدد الصفحات المعتمدة للطباعة:
                      </label>
                      {files.length > 0 && (
                        <button
                          type="button"
                          onClick={() => syncTotalPages(files)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          title="مطابقة إجمالي الصفحات مع ملفات الـ PDF المرفوعة"
                        >
                          مطابقة مع الـ PDF
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPageCount((p) => Math.max(1, p - 1))}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 font-bold transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={pageCount}
                        onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center font-bold text-slate-900 text-lg py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setPageCount((p) => p + 1)}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 font-bold transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {files.some((f) => f.isPdf || f.name.toLowerCase().endsWith('.pdf')) && (
                      <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>محسوب بدقة من خيارات ملفات الـ PDF المرفوعة ({pageCount} صفحة).</span>
                      </p>
                    )}
                  </div>

                  {/* Copies Count */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      عدد النسخ المطلوبة:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCopies((c) => Math.max(1, c - 1))}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 font-bold transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={copies}
                        onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center font-bold text-slate-900 text-lg py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCopies((c) => c + 1)}
                        className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 font-bold transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* B. Color Mode Selection (أسود / ملون) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    نوع ألوان الطباعة:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Black & White */}
                    <div
                      onClick={() => setColorMode('black_white')}
                      className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-center justify-between ${
                        colorMode === 'black_white'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold">طباعة أسود</span>
                        <span className={`text-xs ${colorMode === 'black_white' ? 'text-amber-300' : 'text-slate-500'}`}>
                          15 فلس / ورقة
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        colorMode === 'black_white' ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-300'
                      }`}>
                        {colorMode === 'black_white' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Color Standard */}
                    <div
                      onClick={() => setColorMode('color_standard')}
                      className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-center justify-between ${
                        colorMode === 'color_standard'
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold">ملون عادي</span>
                        <span className={`text-xs ${colorMode === 'color_standard' ? 'text-blue-100' : 'text-blue-600 font-semibold'}`}>
                          70 فلس / ورقة
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        colorMode === 'color_standard' ? 'border-white bg-white text-blue-600' : 'border-slate-300'
                      }`}>
                        {colorMode === 'color_standard' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Color Premium */}
                    <div
                      onClick={() => setColorMode('color_premium')}
                      className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-center justify-between ${
                        colorMode === 'color_premium'
                          ? 'border-indigo-700 bg-indigo-700 text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold">ملون صور فاخر</span>
                        <span className={`text-xs ${colorMode === 'color_premium' ? 'text-indigo-200' : 'text-slate-500'}`}>
                          100 فلس / ورقة
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        colorMode === 'color_premium' ? 'border-white bg-white text-indigo-700' : 'border-slate-300'
                      }`}>
                        {colorMode === 'color_premium' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* C. Print Sides (وجه / وجهين) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    نمط وجه الطباعة:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSides('single')}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                        sides === 'single'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>وجه واحد (Single-sided)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSides('double')}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                        sides === 'double'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>وجهين (Double-sided — توفير ورق)</span>
                    </button>
                  </div>
                </div>

                {/* D. Paper Type & Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    نوع وحجم الورق:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaperSize('a4_standard')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        paperSize === 'a4_standard'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">A4 عادي (80 جم)</span>
                      <span className="text-[10px] opacity-80">ورق المستندات القياسي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaperSize('a4_heavy')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        paperSize === 'a4_heavy'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">A4 مقوى (160-250 جم)</span>
                      <span className="text-[10px] opacity-80">+25 فلس / ورقة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaperSize('glossy')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        paperSize === 'glossy'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">ورق كوشيه لماع</span>
                      <span className="text-[10px] opacity-80">+60 فلس / ورقة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaperSize('a3_standard')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        paperSize === 'a3_standard'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">A3 أسود</span>
                      <span className="text-[10px] opacity-80">50 فلس / ورقة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaperSize('a3_color')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        paperSize === 'a3_color'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">A3 ملون</span>
                      <span className="text-[10px] opacity-80">150 فلس / ورقة</span>
                    </button>
                  </div>
                </div>

                {/* E. Binding & Finishing (التجليد والتغليف) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    التجليد والتغليف والتشطيب:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setBinding('none')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        binding === 'none'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">بدون تجليد</span>
                      <span className="text-[10px] opacity-80">أوراق مفروزة فقط</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBinding('staple')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        binding === 'staple'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">تدبيس زاوي</span>
                      <span className="text-[10px] opacity-80">50 فلس / نسخة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBinding('spiral_plastic')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        binding === 'spiral_plastic'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">تجليد حلزوني بلاستيك</span>
                      <span className="text-[10px] opacity-80">350 فلس (مع غلاف شفاف)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBinding('wire_metal')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        binding === 'wire_metal'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">تجليد سلك معدني فاخر</span>
                      <span className="text-[10px] opacity-80">500 فلس (للمذكرات)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBinding('lamination')}
                      className={`p-2.5 rounded-xl border font-semibold text-right transition ${
                        binding === 'lamination'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-bold">تغليف حراري لماع</span>
                      <span className="text-[10px] opacity-80">250 فلس / ورقة</span>
                    </button>
                  </div>
                </div>

                {/* F. Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    ملاحظات وتعليمات خاصة للطباعة (اختياري):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="مثال: اطبع من صفحة 5 إلى 20، غلاف أزرق شفاف، أو موعد الاستلام المطلوب..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

              </div>

              {/* 3. Customer Info */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">3</span>
                  <span>بيانات العميل للتواصل والاستلام</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكريم:</label>
                    <input
                      type="text"
                      placeholder="اسمك الكريم"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف / الواتساب:</label>
                    <input
                      type="tel"
                      placeholder="مثال: 97445151"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-right transition"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Price Calculator & Order Summary (4 cols on lg) */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              
              <div className="bg-[#0F172A] text-white rounded-[2rem] p-7 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold text-white">ملخص التكلفة التقديرية</h3>
                  </div>
                  <span className="bg-blue-600/30 text-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    حساب آلي
                  </span>
                </div>

                {/* Calculation Breakdown Lines */}
                <div className="py-4 space-y-3 text-xs border-b border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span>عدد الصفحات:</span>
                    <span className="font-bold text-white">{pageCount} صفحة</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>الوجه والورق الفعلي:</span>
                    <span className="font-bold text-white">
                      {breakdown.paperSheetsPerCopy} {sides === 'double' ? 'ورقة (وجهين)' : 'ورقة (وجه واحد)'}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>نوع الطباعة:</span>
                    <span className="font-bold text-blue-400">
                      {colorMode === 'black_white' ? 'أسود (15 فلس)' : colorMode === 'color_standard' ? 'ملون (70 فلس)' : 'ملون فاخر (100 فلس)'}
                    </span>
                  </div>

                  {breakdown.bindingCostPerCopy > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>تكلفة التجليد / التغليف:</span>
                      <span className="font-bold text-white">{breakdown.bindingCostPerCopy} فلس / نسخة</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>عدد النسخ:</span>
                    <span className="font-bold text-white">{copies} نسخة</span>
                  </div>

                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>تكلفة النسخة الواحدة:</span>
                    <span className="font-bold text-slate-200">
                      {(breakdown.singleCopyTotal / 1000).toFixed(3)} د.ك ({breakdown.singleCopyTotal} فلس)
                    </span>
                  </div>
                </div>

                {/* Grand Total Highlight */}
                <div className="pt-4 pb-2">
                  <span className="text-xs text-slate-400 block mb-1">الإجمالي الكلي للطلب:</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-blue-400 font-mono tracking-tight">
                      {breakdown.grandTotalKWD.toFixed(3)}
                    </span>
                    <span className="text-sm font-bold text-slate-200">دينار كويتي</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    يعادل <strong className="text-white">{breakdown.grandTotalFils}</strong> فلس كويتي
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 px-4 rounded-2xl text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>إرسال الملفات والطلب للواتساب الآن</span>
                  </button>

                  {onShowReceipt && (
                    <button
                      type="button"
                      onClick={() => onShowReceipt(currentConfig, breakdown)}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-2xl text-xs font-bold transition border border-slate-700"
                    >
                      <Receipt className="w-4 h-4 text-blue-400" />
                      <span>عرض وطباعة فاتورة عرض السعر</span>
                    </button>
                  )}
                </div>

                {/* Instant Store Guarantee */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400 leading-normal">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    الاستلام الفوري من فرعنا في جمعية النعيم (سوق القصر المركزي - الدور بالميزانين).
                  </span>
                </div>

              </div>

              {/* Direct Store Helpline */}
              <div className="bg-white rounded-[2rem] p-5 border border-slate-200 text-center text-xs text-slate-600 shadow-sm space-y-3">
                <div>
                  <span className="font-bold block text-slate-800 mb-1">تحتاج مساعدة أو لديك استفسار؟</span>
                  <p className="mb-2">تواصل مع موظف الطباعة والتصوير مباشرة:</p>
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                  >
                    <span dir="ltr" className="font-mono text-sm">{STORE_INFO.phone}</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-center">
                  <PrintPrepGuideTooltip buttonText="استفسار: دليل تجهيز الملفات" variant="button" align="center" />
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>

      {/* WhatsApp File Dispatch Modal */}
      {showDispatchModal && (
        <WhatsAppFileDispatchModal
          config={currentConfig}
          breakdown={breakdown}
          trackingId={activeTrackingId}
          onClose={() => setShowDispatchModal(false)}
        />
      )}
    </section>
  );
};
