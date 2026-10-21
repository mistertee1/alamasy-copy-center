import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  ExternalLink,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Eye
} from 'lucide-react';
import { UploadedFile } from '../types';
import { parsePageRange } from '../utils/pdfHelper';

interface PdfFileEditorItemProps {
  file: UploadedFile;
  onUpdate: (updatedFile: UploadedFile) => void;
  onRemove: (id: string) => void;
  onReplaceFile: (id: string, newFile: File) => void;
}

export const PdfFileEditorItem: React.FC<PdfFileEditorItemProps> = ({
  file,
  onUpdate,
  onRemove,
  onReplaceFile,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);

  const totalPages = file.actualPdfPages || file.pageCountEstimate || 1;
  const isCustomRange = file.printRangeType === 'custom';
  const rangeString = file.customPagesRange || '';

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Change total pages
  const handleTotalPagesChange = (newCount: number) => {
    const validCount = Math.max(1, newCount);
    let effective = validCount;

    if (isCustomRange && rangeString) {
      const parsed = parsePageRange(rangeString, validCount);
      effective = parsed.count;
    }

    onUpdate({
      ...file,
      actualPdfPages: validCount,
      pageCountEstimate: validCount,
      effectivePages: effective,
      isExactCount: true,
    });
  };

  // Toggle range type
  const handleToggleRangeType = (type: 'all' | 'custom') => {
    if (type === 'all') {
      onUpdate({
        ...file,
        printRangeType: 'all',
        customPagesRange: '',
        effectivePages: totalPages,
      });
    } else {
      const defaultRange = `1-${Math.min(totalPages, 5)}`;
      const parsed = parsePageRange(defaultRange, totalPages);
      onUpdate({
        ...file,
        printRangeType: 'custom',
        customPagesRange: defaultRange,
        effectivePages: parsed.count,
      });
    }
  };

  // Update custom range string
  const handleRangeTextChange = (text: string) => {
    const parsed = parsePageRange(text, totalPages);
    onUpdate({
      ...file,
      customPagesRange: text,
      effectivePages: text.trim() ? parsed.count : totalPages,
    });
  };

  // Apply Quick Range Preset
  const applyPreset = (presetType: 'odd' | 'even' | 'first5' | 'all') => {
    if (presetType === 'all') {
      handleToggleRangeType('all');
      return;
    }

    let pages: number[] = [];
    if (presetType === 'odd') {
      for (let i = 1; i <= totalPages; i += 2) pages.push(i);
    } else if (presetType === 'even') {
      for (let i = 2; i <= totalPages; i += 2) pages.push(i);
    } else if (presetType === 'first5') {
      const limit = Math.min(5, totalPages);
      for (let i = 1; i <= limit; i++) pages.push(i);
    }

    const rangeStr = pages.join(', ');
    handleRangeTextChange(rangeStr);
  };

  // Handle open preview
  const handleOpenPreview = () => {
    if (file.previewUrl) {
      window.open(file.previewUrl, '_blank');
    } else if (file.rawFile) {
      const url = URL.createObjectURL(file.rawFile);
      window.open(url, '_blank');
    }
  };

  // Replace file handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onReplaceFile(file.id, e.target.files[0]);
    }
  };

  const parsedRange = parsePageRange(rangeString, totalPages);
  const effectiveCount = file.effectivePages || (isCustomRange ? parsedRange.count : totalPages);

  return (
    <div className="bg-white rounded-2xl border-2 border-red-100 hover:border-red-200 transition-all shadow-xs overflow-hidden">
      {/* Hidden input for replacing the file */}
      <input
        type="file"
        ref={replaceInputRef}
        accept=".pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main Header Row */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-50/50 via-white to-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0 text-right">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs block" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                PDF
              </span>
              {file.isExactCount && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تم الكشف التلقائي</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-500 font-medium">
              <span>{formatSize(file.size)}</span>
              <span>•</span>
              <span className="text-slate-800 font-bold">
                الإجمالي: {totalPages} صفحة
              </span>
              <span>•</span>
              <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                المعتمد للطباعة: {effectiveCount} صفحة
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Preview Button */}
          <button
            type="button"
            onClick={handleOpenPreview}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
            title="معاينة ملف الـ PDF"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">معاينة</span>
          </button>

          {/* Toggle Expand Editor */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              isExpanded
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={isExpanded ? 'طي تفاصيل التعديل' : 'تعديل خيارات وصفحات الـ PDF'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تعديل الـ PDF</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="حذف الملف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable PDF Adjustment Drawer */}
      {isExpanded && (
        <div className="p-4 bg-slate-50/80 border-t border-red-100 space-y-4 text-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Layers className="w-4 h-4 text-red-500" />
              <span>خيارات وتعديل صفحات ملف الـ PDF:</span>
            </span>

            {/* Replace File Button */}
            <button
              type="button"
              onClick={() => replaceInputRef.current?.click()}
              className="text-[11px] font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg px-2.5 py-1 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-blue-500" />
              <span>استبدال ملف الـ PDF بآخر</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Edit Total Pages Count */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700">
                  إجمالي عدد صفحات الملف:
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  (يمكنك تعديله يدوياً)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTotalPagesChange(totalPages - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={totalPages}
                  onChange={(e) => handleTotalPagesChange(parseInt(e.target.value) || 1)}
                  className="w-full text-center font-black text-slate-900 text-base py-1 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleTotalPagesChange(totalPages + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Print Range Selection (كل الصفحات أم صفحات مخصصة) */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="font-bold text-slate-700 block mb-2">
                نطاق الصفحات المطلوب طباعتها:
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRangeType('all')}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition border text-center ${
                    !isCustomRange
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  كامل الملف ({totalPages} صفحة)
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleRangeType('custom')}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition border text-center ${
                    isCustomRange
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  تحديد صفحات معينة
                </button>
              </div>
            </div>

          </div>

          {/* If Custom Range is Active: Custom Inputs & Presets */}
          {isCustomRange && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-blue-900 block text-xs">
                    اكتب أرقام ونطاقات الصفحات المطلوبة:
                  </span>
                  <span className="text-[11px] text-blue-700">
                    مثال: <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-blue-800">1-5, 8, 12-15</code> أو <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-blue-800">1, 3, 5</code>
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-[11px] font-bold text-blue-900 bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs inline-block">
                    المحدد: {effectiveCount} صفحة
                  </span>
                </div>
              </div>

              <input
                type="text"
                value={rangeString}
                onChange={(e) => handleRangeTextChange(e.target.value)}
                placeholder={`أدخل الصفحات (من 1 إلى ${totalPages})`}
                dir="ltr"
                className="w-full text-right px-3 py-2 bg-white border border-blue-300 rounded-lg text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-bold">اختيارات سريعة:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('odd')}
                  className="px-2 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold border border-blue-200 transition"
                >
                  الصفحات الفردية (1, 3, 5...)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('even')}
                  className="px-2 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold border border-blue-200 transition"
                >
                  الصفحات الزوجية (2, 4, 6...)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('first5')}
                  className="px-2 py-1 bg-white hover:bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold border border-blue-200 transition"
                >
                  أول {Math.min(5, totalPages)} صفحات
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('all')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold border border-slate-200 transition"
                >
                  إعادة تعيين للكل
                </button>
              </div>

              {parsedRange.hasError && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>تأكد من إدخال أرقام صفحات صحيحة لا تتجاوز إجمالي صفحات الملف ({totalPages}).</span>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Notice */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>يتم احتساب تكلفة الطباعة تلقائياً بناءً على ({effectiveCount}) صفحة لهذا الملف.</span>
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
