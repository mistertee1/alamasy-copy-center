import { PrintOrderConfig, PriceBreakdown, ServiceItem } from '../types';
import { STORE_INFO } from '../data/servicesData';

export function getRawPriceBreakdownText(config: PrintOrderConfig, breakdown: PriceBreakdown): string {
  const colorText =
    config.colorMode === 'black_white'
      ? 'أسود (15 فلس/ورقة)'
      : config.colorMode === 'color_standard'
      ? 'ملون عادي (70 فلس/ورقة)'
      : 'ملون فاخر/صور (100 فلس/ورقة)';

  const sidesText = config.sides === 'single' ? 'وجه واحد' : 'وجهين (توفير ورق)';

  const paperText =
    config.paperSize === 'a4_standard'
      ? 'A4 عادي (80 جم)'
      : config.paperSize === 'a4_heavy'
      ? 'A4 مقوى (160-250 جم)'
      : config.paperSize === 'a3_standard'
      ? 'A3 أسود'
      : config.paperSize === 'a3_color'
      ? 'A3 ملون'
      : 'ورق كوشيه لماع';

  const bindingText =
    config.binding === 'none'
      ? 'بدون تجليد'
      : config.binding === 'spiral_plastic'
      ? 'تجليد حلزوني بلاستيك'
      : config.binding === 'wire_metal'
      ? 'تجليد سلك معدني'
      : config.binding === 'lamination'
      ? 'تغليف حراري (Lamination)'
      : 'تدبيس';

  const fileLines =
    config.files.length > 0
      ? config.files
          .map((f) => {
            if (f.printRangeType === 'custom' && f.customPagesRange) {
              return `${f.name} (صفحات محددة: ${f.customPagesRange} - المعتمد: ${f.effectivePages || f.pageCountEstimate} صفحة من أصل ${f.actualPdfPages || f.pageCountEstimate})`;
            }
            return `${f.name} (${f.effectivePages || f.actualPdfPages || f.pageCountEstimate || 1} صفحة)`;
          })
          .join('\n- ')
      : '';

  return `السلام عليكم ورحمة الله،
أود طلب خدمة طباعة مستند من مكتبة جمعية النعيم (سوق القصر المركزي بالميزانين):

📋 *تفاصيل طلب الطباعة:*
👤 *اسم العميل:* ${config.customerName || 'عميل محترم'}
📱 *رقم الهاتف:* ${config.customerPhone || 'مرفق عبر الواتساب'}
📁 *الملفات المرفقة:* ${fileLines ? `\n- ${fileLines}` : 'مرفقة بالرسالة'}
📄 *عدد الصفحات المعتمد للطباعة:* ${config.pageCount} صفحة
🔢 *عدد النسخ:* ${config.copies} نسخة
🎨 *نوع الطباعة:* ${colorText}
📑 *نمط الوجه:* ${sidesText}
📐 *نوع الورق:* ${paperText}
📚 *التجليد والتغليف:* ${bindingText}
${config.notes ? `📝 *ملاحظات خاصة:* ${config.notes}\n` : ''}💰 *إجمالي التكلفة التقديرية:* ${breakdown.formattedKWD}

يرجى تأكيد استلام الملفات والطلب والبدء بالتجهيز. شكراً لكم!`;
}

export function formatPriceBreakdown(config: PrintOrderConfig, breakdown: PriceBreakdown): string {
  const text = getRawPriceBreakdownText(config, breakdown);
  return encodeURIComponent(text);
}

export function createQuickPrintWhatsAppUrl(config: PrintOrderConfig, breakdown: PriceBreakdown): string {
  const message = formatPriceBreakdown(config, breakdown);
  return `https://wa.me/965${STORE_INFO.phone}?text=${message}`;
}

/**
 * Checks if the browser supports sharing files natively (e.g. mobile Safari / Chrome)
 */
export function canShareFilesDirectly(files: (File | undefined)[]): boolean {
  const validFiles = files.filter((f): f is File => f instanceof File);
  if (validFiles.length === 0) return false;
  if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
    try {
      return navigator.canShare({ files: validFiles });
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Attempts to share real files directly to WhatsApp via Web Share API
 */
export async function shareFilesDirectly(
  files: (File | undefined)[], 
  text: string, 
  title: string = 'طلب طباعة مستندات - جمعية النعيم'
): Promise<{ success: boolean; method: 'native_share' | 'whatsapp_link'; error?: string }> {
  const validFiles = files.filter((f): f is File => f instanceof File);
  
  if (validFiles.length > 0 && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: validFiles })) {
        await navigator.share({
          files: validFiles,
          title,
          text
        });
        return { success: true, method: 'native_share' };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'native_share', error: 'User cancelled share' };
      }
      console.warn('Native share failed, falling back to WhatsApp link:', err);
    }
  }

  // Fallback: Open WhatsApp URL
  return { success: true, method: 'whatsapp_link' };
}

/**
 * Tries copying an image or text to clipboard for instant pasting (Ctrl+V) into WhatsApp
 */
export async function copyFileOrTextToClipboard(
  files: (File | undefined)[], 
  text: string
): Promise<{ copiedImage: boolean; copiedText: boolean }> {
  let copiedImage = false;
  let copiedText = false;

  const validFiles = files.filter((f): f is File => f instanceof File);
  const imageFile = validFiles.find((f) => f.type.startsWith('image/'));

  if (imageFile && typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      // Direct write image blob to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [imageFile.type]: imageFile,
        }),
      ]);
      copiedImage = true;
    } catch (e) {
      console.warn('Could not copy image directly to clipboard:', e);
    }
  }

  if (!copiedImage && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      copiedText = true;
    } catch (e) {
      console.warn('Could not copy text to clipboard:', e);
    }
  }

  return { copiedImage, copiedText };
}

export function formatClearanceServiceWhatsAppMessage(config: {
  orderId: string;
  serviceName: string;
  categoryName: string;
  officialEntity: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  paciNumber?: string;
  residencyArticle?: string;
  renewalDuration?: string;
  civilIdNumber?: string;
  companyType?: string;
  companySuggestedName?: string;
  portType?: string;
  shipmentType?: string;
  policyNumber?: string;
  paymentMethod: 'knet_paid' | 'knet_link' | 'branch_pay';
  knetReference?: string;
  attachedFiles: { name: string; type?: string; size?: number; label?: string }[];
  notes?: string;
}): string {
  const paymentText =
    config.paymentMethod === 'knet_paid'
      ? `✅ تم الدفع مسبقاً عبر K-Net (رقم المرجع: ${config.knetReference || 'مرفق'})`
      : config.paymentMethod === 'knet_link'
      ? `💳 طلب إرسال رابط دفع K-Net بعد مراجعة الأوراق`
      : `🏢 سداد نقدي / K-Net عند المراجعة بالفرع`;

  let specificDetails = '';
  if (config.residencyArticle) {
    specificDetails += `\n📌 *نوع الإقامة:* ${config.residencyArticle}`;
  }
  if (config.renewalDuration) {
    specificDetails += `\n⏳ *مدة التجديد:* ${config.renewalDuration}`;
  }
  if (config.civilIdNumber) {
    specificDetails += `\n🆔 *الرقم المدني / الموحد:* ${config.civilIdNumber}`;
  }
  if (config.companyType) {
    specificDetails += `\n🏢 *الشكل القانوني للشركة:* ${config.companyType}`;
  }
  if (config.companySuggestedName) {
    specificDetails += `\n📝 *الاسم التجاري المقترح:* ${config.companySuggestedName}`;
  }
  if (config.portType) {
    specificDetails += `\n🚢 *المنفذ الجمركي:* ${config.portType}`;
  }
  if (config.shipmentType) {
    specificDetails += `\n📦 *نوع البضاعة / الشحنة:* ${config.shipmentType}`;
  }
  if (config.policyNumber) {
    specificDetails += `\n📄 *رقم البوليصة / البيان:* ${config.policyNumber}`;
  }

  const filesList =
    config.attachedFiles.length > 0
      ? config.attachedFiles.map((f) => `- ${f.label ? `[${f.label}] ` : ''}${f.name}`).join('\n')
      : 'سيتم إرسال المستندات في هذه المحادثة مباشرة';

  return `السلام عليكم ورحمة الله،
أود تقديم طلب معاملة رسمية عبر مكتبة وخدمات جمعية النعيم (سوق القصر المركزي بالميزانين):

🔖 *رقم الطلب المرجعي:* ${config.orderId}
🌟 *الخدمة المطلوبة:* ${config.serviceName}
🏛️ *الجهة المختصة:* ${config.officialEntity}
📂 *القسم:* ${config.categoryName}
${specificDetails}

👤 *بيانات العميل:*
• *الاسم الكامل:* ${config.customerName}
• *رقم الهاتف / الواتساب:* ${config.customerPhone}
${config.customerAddress ? `• *العنوان:* ${config.customerAddress}` : ''}
${config.paciNumber ? `• *الرقم الآلي للعنوان (PACI):* ${config.paciNumber}` : ''}

📁 *المستندات والمرفقات المرفوعة:*
${filesList}

💰 *طريقة الدفع:*
${paymentText}
${config.notes ? `\n📝 *ملاحظات إضافية:* ${config.notes}` : ''}

يرجى تأكيد استلام الطلب وبدء المتابعة وإرسال التحديثات. شكراً لكم!`;
}

export function createClearanceServiceWhatsAppUrl(message: string): string {
  return `https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent(message)}`;
}

export function createServiceInquiryWhatsAppUrl(service: ServiceItem, customNotes?: string): string {
  const text = `السلام عليكم ورحمة الله،
أود الاستفسار وطلب خدمة من مكتبة جمعية النعيم (سوق القصر المركزي - بالميزانين):

🌟 *الخدمة المطلوبة:* ${service.title}
📁 *القسم:* ${service.categoryName}
${customNotes ? `📝 *ملاحظاتي / متطلباتي:* ${customNotes}\n` : ''}
أرجو تزويدي بالأسعار والتفاصيل ووقت التجهيز. شكراً جزيلاً!`;

  return `https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent(text)}`;
}

export function createGeneralWhatsAppUrl(message?: string): string {
  const defaultText = `السلام عليكم، أود الاستفسار عن خدمات الطباعة والتصوير في جمعية النعيم (سوق القصر المركزي بالميزانين).`;
  const text = encodeURIComponent(message || defaultText);
  return `https://wa.me/965${STORE_INFO.phone}?text=${text}`;
}

export function checkStoreOpenStatus(): { isOpen: boolean; message: string; subMessage: string } {
  // Check Kuwait time (UTC+3)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kuwaitDate = new Date(utc + 3600000 * 3);
  
  const day = kuwaitDate.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  const hours = kuwaitDate.getHours();
  const minutes = kuwaitDate.getMinutes();
  const currentDecimalTime = hours + minutes / 60;

  let isOpen = false;

  if (day === 5) {
    // Friday: 4:00 PM - 10:30 PM (16:00 to 22.5)
    if (currentDecimalTime >= 16 && currentDecimalTime <= 22.5) {
      isOpen = true;
    }
  } else {
    // Saturday to Thursday: 8:00 AM - 1:00 PM OR 4:00 PM - 10:30 PM
    if (
      (currentDecimalTime >= 8 && currentDecimalTime <= 13) ||
      (currentDecimalTime >= 16 && currentDecimalTime <= 22.5)
    ) {
      isOpen = true;
    }
  }

  if (isOpen) {
    return {
      isOpen: true,
      message: 'مفتوح الآن لاستقبالكم والطباعة الفورية',
      subMessage: 'سوق القصر المركزي - الميزانين'
    };
  } else {
    return {
      isOpen: false,
      message: 'المحل مغلق حالياً - نستقبل طلباتكم عبر الواتساب على مدار الساعة',
      subMessage: 'سيبدأ العمل في الفترة القادمة'
    };
  }
}
