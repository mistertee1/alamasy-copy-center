import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Share2, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Smartphone
} from 'lucide-react';
import { UploadedFile, PrintOrderConfig, PriceBreakdown } from '../types';
import { STORE_INFO } from '../data/servicesData';
import { 
  getRawPriceBreakdownText, 
  createQuickPrintWhatsAppUrl, 
  shareFilesDirectly, 
  canShareFilesDirectly,
  copyFileOrTextToClipboard 
} from '../utils/whatsapp';

interface WhatsAppFileDispatchModalProps {
  config: PrintOrderConfig;
  breakdown: PriceBreakdown;
  trackingId?: string;
  onClose: () => void;
}

export const WhatsAppFileDispatchModal: React.FC<WhatsAppFileDispatchModalProps> = ({
  config,
  breakdown,
  trackingId,
  onClose
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'shared' | 'opened_chat'>('idle');

  const rawFiles = config.files.map((f) => f.rawFile).filter((f): f is File => f instanceof File);
  const isWebShareAvailable = canShareFilesDirectly(rawFiles);
  const rawMessage = getRawPriceBreakdownText(config, breakdown);

  const getFileIcon = (file: UploadedFile) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext || '') || file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-pink-500" />;
    }
    if (['pdf'].includes(ext || '') || file.type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSendDirectly = async () => {
    setShareStatus('sharing');

    // 1. If Web Share with files is supported (e.g. mobile)
    if (isWebShareAvailable) {
      const res = await shareFilesDirectly(rawFiles, rawMessage, 'طلب طباعة من مركز جمعية النعيم');
      if (res.success && res.method === 'native_share') {
        setShareStatus('shared');
        return;
      }
    }

    // 2. Try copying image or text to clipboard
    const clipRes = await copyFileOrTextToClipboard(rawFiles, rawMessage);
    if (clipRes.copiedImage) setCopiedImage(true);
    if (clipRes.copiedText) setCopiedText(true);

    // 3. Open WhatsApp Web / App chat with the branch
    const url = createQuickPrintWhatsAppUrl(config, breakdown);
    window.open(url, '_blank');
    setShareStatus('opened_chat');
  };

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(rawMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadFile = (file: UploadedFile) => {
    if (file.rawFile) {
      const url = URL.createObjectURL(file.rawFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center p-3 border border-[#25D366]/30">
            <MessageCircle className="w-7 h-7 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block mb-1">
              إرسال الملفات للواتساب مباشرة
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              إرسال ملفك إلى واتساب المكتبة
            </h3>
          </div>
        </div>

        {/* Uploaded Files Preview Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3">
            <span>الملفات الجاهزة للإرسال ({config.files.length}):</span>
            <span className="text-blue-600 font-mono text-[11px]">
              {config.files.some(f => f.name.endsWith('.pdf')) ? 'PDF جاهز للطباعة' : 'مستندات وصور'}
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {config.files.map((file) => (
              <div 
                key={file.id} 
                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 mt-0.5">
                      <span>{formatFileSize(file.size)}</span>
                      {file.isPdf || file.name.toLowerCase().endsWith('.pdf') ? (
                        <>
                          <span>•</span>
                          <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {file.printRangeType === 'custom' && file.customPagesRange
                              ? `صفحات محددة: ${file.customPagesRange} (${file.effectivePages} صفحة)`
                              : `${file.effectivePages || file.actualPdfPages || file.pageCountEstimate || 1} صفحة`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">{file.type || 'ملف جاهز'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {file.rawFile && (
                  <button
                    onClick={() => handleDownloadFile(file)}
                    title="تحميل الملف"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Primary Call to Action Button */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleSendDirectly}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>
              {isWebShareAvailable 
                ? 'مشاركة الملفات ومواصفات الطلب عبر الواتساب'
                : 'فتح محادثة الواتساب مع الفرع وإرسال الملف'}
            </span>
          </button>

          {isWebShareAvailable && (
            <button
              onClick={() => {
                const url = createQuickPrintWhatsAppUrl(config, breakdown);
                window.open(url, '_blank');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>أو فتح محادثة الواتساب المباشرة ({STORE_INFO.phone})</span>
            </button>
          )}
        </div>

        {/* Step-by-step guidance tabs for Desktop / Mobile */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs space-y-3">
          <div className="font-bold text-blue-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>كيف يصل الملف كما هو إلى موظف الطباعة؟</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Mobile guide */}
            <div className="bg-white p-3 rounded-xl border border-blue-100/80">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>عبر الهاتف (مشاركة مباشرة):</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                يتم إرفاق ملف الـ PDF أو الوورد أو الصورة مباشرة داخل محادثة الواتساب مع كتابة مواصفات الطلب بالكامل.
              </p>
            </div>

            {/* Desktop guide */}
            <div className="bg-white p-3 rounded-xl border border-blue-100/80">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <Laptop className="w-4 h-4 text-blue-600" />
                <span>عبر الكمبيوتر (واتساب ويب):</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                تفتح المحادثة تلقائياً مع الرسالة. يمكنك سحب ملفك وإفلاته داخل المحادثة أو لصق الصورة مباشرة (<kbd className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">Ctrl+V</kbd>).
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Quick Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>الإجمالي التقديري: <strong className="text-slate-900 font-mono">{breakdown.formattedKWD}</strong></span>
          </div>

          <button
            onClick={handleCopyMessage}
            className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'تم نسخ الرسالة' : 'نسخ نص الطلب'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
