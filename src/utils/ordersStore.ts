import { TrackableOrder, OrderStatus, CustomServiceRequestData, PrintOrderConfig, PriceBreakdown } from '../types';
import { STORE_INFO } from '../data/servicesData';

const STORAGE_KEY = 'alamasy_order_drafts_v1';

// Initial pre-seeded demo orders representing various realistic states
const SEED_ORDERS: TrackableOrder[] = [
  {
    id: 'ORD-7104',
    customerName: 'فهد الشمري',
    customerPhone: '99881122',
    customerEmail: 'fahad.alshammar@example.com',
    orderType: 'quick_print',
    serviceTitle: 'طباعة وتجليد مذكرة تخرج وبحوث جامعية',
    details: '45 صفحة • طباعة ملونة ليزر • ورق 80 جم • تجليد سلك معدني فاخر • عدد 2 نسخة',
    files: [
      { name: 'Research_Graduation_Final_2026.pdf', size: 4200000, type: 'application/pdf' },
      { name: 'Appendix_Survey_Forms.docx', size: 1100000, type: 'application/docx' }
    ],
    totalCost: '7.300 د.ك',
    createdAt: '2026-09-02 09:15 ص',
    estimatedReadyTime: 'جاهز للاستلام الفوري الآن',
    status: 'ready_for_pickup',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: '2026-09-02 09:15 ص',
        note: 'تم استلام الملفات والتحقق من جودة الخطوط وهوامش الطباعة.'
      },
      {
        status: 'processing',
        timestamp: '2026-09-02 10:30 ص',
        note: 'تمت الطباعة الليزرية الملونة بنجاح، وجاري التجليد السلك المعدني.'
      },
      {
        status: 'ready_for_pickup',
        timestamp: '2026-09-02 11:15 ص',
        note: 'تم تجهيز وتغليف المذكرات ووضعها في قسم الاستلام بفرع الميزانين بسوق القصر.'
      }
    ],
    pickupLocation: STORE_INFO.location,
    notes: 'يرجى إبراز رقم الطلب (ORD-7104) عند المحاسبة أو الاستلام.'
  },
  {
    id: 'REQ-5291',
    customerName: 'سارة المطيري',
    customerPhone: '97112233',
    customerEmail: 'sarah.m@example.com',
    orderType: 'custom_service',
    serviceTitle: 'تصميم وطباعة بنر رول أب وقاعدة ألومنيوم لمعرض مدرسي',
    details: 'مقاس 85×200 سم • خامة قماش أصلية مقاومة للشمس • مع حقيبة حمل وقاعدة ألومنيوم • عدد 1',
    files: [
      { name: 'School_Science_Fair_Logo.png', size: 2800000, type: 'image/png' },
      { name: 'Banner_Text_Copy_Guidelines.pdf', size: 850000, type: 'application/pdf' }
    ],
    totalCost: '7.500 د.ك',
    createdAt: '2026-09-02 08:30 ص',
    estimatedReadyTime: 'اليوم خلال الفترة المسائية (بين 5:00 - 7:00 م)',
    status: 'processing',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: '2026-09-02 08:30 ص',
        note: 'تم استلام طلب التصميم والملفات ومطابقتها للمقاس المطلوب.'
      },
      {
        status: 'processing',
        timestamp: '2026-09-02 10:00 ص',
        note: 'المصمم يعمل على بروفة التصميم النهائية وإرسالها لماكينة الطباعة العريضة.'
      }
    ],
    pickupLocation: STORE_INFO.location,
    notes: 'سيتم إرسال رسالة واتساب للعميل فور اكتمال التجهيز.'
  },
  {
    id: 'ORD-3810',
    customerName: 'مبارك الظفيري',
    customerPhone: '94556677',
    customerEmail: 'mubarak.dhafiri@example.com',
    orderType: 'quick_print',
    serviceTitle: 'طباعة معاملات ديوان الخدمة المدنية والسيرة الذاتية',
    details: '12 صفحة • أسود وأبيض • ورق عادي 80 جم • تدبيس وتجهيز مغلف رسمي',
    files: [
      { name: 'Civil_Service_Application.pdf', size: 750000, type: 'application/pdf' },
      { name: 'Updated_CV_Arabic.pdf', size: 450000, type: 'application/pdf' }
    ],
    totalCost: '0.650 د.ك',
    createdAt: '2026-09-02 11:20 ص',
    estimatedReadyTime: 'خلال 20 دقيقة',
    status: 'reviewing',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: '2026-09-02 11:20 ص',
        note: 'تم استقبال الطلب من الموقع وهو في قائمة الانتظار للمراجعة السريعة.'
      }
    ],
    pickupLocation: STORE_INFO.location,
    notes: 'جاهزية سريعة خلال دقائق.'
  },
  {
    id: 'REQ-1902',
    customerName: 'د. خالد العنزي',
    customerPhone: '98774411',
    orderType: 'custom_service',
    serviceTitle: 'تصنيع دروع تكريم كريستال مع حفر ليزر وعلبة مخمل',
    details: 'عدد 3 دروع كريستال فاخرة مع شعار المدرسة واسم المعلم المتميز مع علبة قطيفة كحلية',
    totalCost: '18.000 د.ك',
    createdAt: '2026-09-01 04:30 م',
    status: 'completed',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: '2026-09-01 04:30 م',
        note: 'تم استلام وتأكيد النصوص والأسماء المراد حفرها.'
      },
      {
        status: 'processing',
        timestamp: '2026-09-01 06:15 م',
        note: 'تم الحفر بالليزر على الكريستال وتجهيز العلب.'
      },
      {
        status: 'ready_for_pickup',
        timestamp: '2026-09-01 08:30 م',
        note: 'تم إشعار العميل بالجاهزية.'
      },
      {
        status: 'completed',
        timestamp: '2026-09-01 09:45 م',
        note: 'تم استلام الطلب من الفرع وسداد المبلغ بالكامل. شكراً لكم.'
      }
    ],
    pickupLocation: STORE_INFO.location
  }
];

// Helper to load all orders
export function getAllOrders(): TrackableOrder[] {
  const initialOrders = import.meta.env.DEV ? SEED_ORDERS : [];
  if (typeof window === 'undefined') return initialOrders;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load orders from storage', err);
    return initialOrders;
  }
}

// Helper to save all orders
export function saveOrders(orders: TrackableOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to storage', err);
  }
}

// Search order by exact ID or phone number
export function findOrder(query: string): TrackableOrder | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  const orders = getAllOrders();
  
  // Try matching ID exactly or without hyphens
  const byId = orders.find(o => 
    o.id.toLowerCase() === clean || 
    o.id.toLowerCase().replace('-', '') === clean.replace('-', '')
  );
  if (byId) return byId;

  // Try matching phone (contains or ends with)
  const byPhone = orders.find(o => {
    const cleanPhone = o.customerPhone.replace(/\D/g, '');
    const cleanQ = clean.replace(/\D/g, '');
    return cleanQ && (cleanPhone === cleanQ || cleanPhone.includes(cleanQ));
  });

  return byPhone || null;
}

// Generate human-friendly timestamp
function formatNow(): string {
  const d = new Date();
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 || 12;
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${displayHours}:${minutes} ${period}`;
}

// Create a new Trackable Order from Custom Request
export function createOrderFromCustomRequest(request: CustomServiceRequestData): TrackableOrder {
  const id = request.id || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = formatNow();

  const newOrder: TrackableOrder = {
    id,
    customerName: request.customerName,
    customerPhone: request.customerPhone,
    customerEmail: request.customerEmail,
    orderType: 'custom_service',
    serviceTitle: request.serviceTitle || request.serviceType,
    details: `${request.serviceType} • الكمية: ${request.quantity} ${request.dimensions ? `• المقاس: ${request.dimensions}` : ''} ${request.colorPreferences ? `• الألوان: ${request.colorPreferences}` : ''}`,
    files: request.attachedFiles.map(f => ({ name: f.name, size: f.size, type: f.type, previewUrl: f.previewUrl })),
    totalCost: 'سيتم تحديده بعد المراجعة والاتصال',
    createdAt: now,
    estimatedReadyTime: request.targetDate ? `الموعد المقترح: ${request.targetDate}` : 'خلال 24-48 ساعة',
    status: 'reviewing',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: now,
        note: 'تم استقبال طلب الخدمة المخصصة وجاري مراجعة المتطلبات والملفات المرفقة.'
      }
    ],
    pickupLocation: STORE_INFO.location,
    notes: request.description
  };

  const existing = getAllOrders();
  const updated = [newOrder, ...existing];
  saveOrders(updated);
  return newOrder;
}

// Create a new Trackable Order from Kuwait Government Clearance Request
export function createOrderFromClearanceRequest(request: {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceTitle: string;
  officialEntity: string;
  details: string;
  files: { name: string; size?: number; type?: string; previewUrl?: string }[];
  totalCost?: string;
  estimatedTime?: string;
  notes?: string;
  paymentMethod: 'knet_paid' | 'knet_link' | 'branch_pay';
  knetReference?: string;
}): TrackableOrder {
  const id = request.id || `KW-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = formatNow();

  const paymentNote =
    request.paymentMethod === 'knet_paid'
      ? `تم الدفع مسبقاً عبر K-Net (مرجع: ${request.knetReference || 'ناجح'})`
      : request.paymentMethod === 'knet_link'
      ? 'بانتظار إرسال رابط دفع K-Net بعد تدقيق الأوراق'
      : 'سداد نقدي / K-Net عند المراجعة بالفرع';

  const newOrder: TrackableOrder = {
    id,
    customerName: request.customerName,
    customerPhone: request.customerPhone,
    customerEmail: request.customerEmail,
    orderType: 'custom_service',
    serviceTitle: request.serviceTitle,
    details: `${request.details} • الجهة: ${request.officialEntity} • الدفع: ${paymentNote}`,
    files: request.files,
    totalCost: request.totalCost || 'حسب الرسوم الرسمية وتدقيق المعاملة',
    createdAt: now,
    estimatedReadyTime: request.estimatedTime || 'خلال 24-48 ساعة',
    status: 'reviewing',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: now,
        note: `تم استقبال طلب المعاملة عبر البوابة الإلكترونية. ${paymentNote}. جاري تدقيق المستندات بواسطة قسم التعقيب الحكومي.`,
      },
    ],
    pickupLocation: `${STORE_INFO.location} (أو تسليم إلكتروني / توصيل حسب الخدمة)`,
    notes: request.notes,
  };

  const existing = getAllOrders();
  const updated = [newOrder, ...existing];
  saveOrders(updated);
  return newOrder;
}

// Create a new Trackable Order from Quick Print configuration
export function createOrderFromQuickPrint(config: PrintOrderConfig, breakdown: PriceBreakdown): TrackableOrder {
  const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = formatNow();

  const colorMap = {
    black_white: 'أسود وأبيض',
    color_standard: 'ألوان ليزر واضحة',
    color_premium: 'ألوان فاخرة صور'
  };

  const sidesMap = {
    single: 'وجه واحد',
    double: 'وجهين (دوبلكس)'
  };

  const bindingMap = {
    none: 'بدون تجليد',
    spiral_plastic: 'تجليد حلزوني بلاستيك',
    wire_metal: 'تجليد سلك معدني',
    lamination: 'تغليف حراري',
    staple: 'تدبيس وتجهيز'
  };

  const newOrder: TrackableOrder = {
    id,
    customerName: config.customerName || 'عميل محترم',
    customerPhone: config.customerPhone || STORE_INFO.phone,
    orderType: 'quick_print',
    serviceTitle: `طباعة مستندات (${config.pageCount} صفحة)`,
    details: `${colorMap[config.colorMode]} • ${sidesMap[config.sides]} • ${bindingMap[config.binding]} • عدد ${config.copies} نسخة`,
    files: config.files.map(f => ({ name: f.name, size: f.size, type: f.type })),
    totalCost: breakdown.formattedKWD,
    createdAt: now,
    estimatedReadyTime: 'خلال 15 - 30 دقيقة',
    status: 'reviewing',
    statusUpdates: [
      {
        status: 'reviewing',
        timestamp: now,
        note: 'تم إرسال ملفات الطباعة بنجاح وهي قيد الإعداد في ماكينات الطباعة الليزرية.'
      }
    ],
    pickupLocation: STORE_INFO.location,
    notes: config.notes || undefined
  };

  const existing = getAllOrders();
  const updated = [newOrder, ...existing];
  saveOrders(updated);
  return newOrder;
}

// Update order status with a new status log
export function updateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus, 
  note?: string,
  estimatedReadyTime?: string
): TrackableOrder | null {
  const orders = getAllOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const now = formatNow();
  const defaultNotes: Record<OrderStatus, string> = {
    reviewing: 'تم وضع الطلب في مرحلة المراجعة والتدقيق الفني.',
    processing: 'جاري تنفيذ وطباعة الطلب على المعدات والمكائن الخاصة بالفرع.',
    ready_for_pickup: 'طلبكم جاهز الآن للاستلام من فرعنا بالميزانين بسوق القصر المركزي.',
    completed: 'تم تسليم الطلب للعميل بنجاح.',
    cancelled: 'تم إلغاء الطلب بناءً على رغبة العميل أو عدم توفر المواد.'
  };

  const statusNote = note || defaultNotes[newStatus];

  const updatedOrder: TrackableOrder = {
    ...orders[index],
    status: newStatus,
    estimatedReadyTime: estimatedReadyTime !== undefined ? estimatedReadyTime : orders[index].estimatedReadyTime,
    statusUpdates: [
      ...orders[index].statusUpdates,
      {
        status: newStatus,
        timestamp: now,
        note: statusNote
      }
    ]
  };

  orders[index] = updatedOrder;
  saveOrders(orders);
  return updatedOrder;
}

// Generate the WhatsApp notification URL for the customer
export function generateCustomerWhatsAppNotificationUrl(order: TrackableOrder): string {
  const statusLabels: Record<OrderStatus, string> = {
    reviewing: '🔍 قيد المراجعة والتدقيق',
    processing: '🖨️ قيد التنفيذ والطباعة حالياً',
    ready_for_pickup: '✅ جاهز للاستلام الآن بالميزانين',
    completed: '🎉 تم الاستلام بنجاح',
    cancelled: '❌ تم الإلغاء'
  };

  let actionAdvice = '';
  if (order.status === 'ready_for_pickup') {
    actionAdvice = `📍 *مكان الاستلام:* ${STORE_INFO.location}\n🕒 *أوقات العمل:* 8:00 ص - 1:00 ظ | 4:00 ع - 10:30 م\n💳 *المبلغ المطلوب:* ${order.totalCost || 'يرجى مراجعة الفرع'}\n\nيرجى إبراز رقم الطلب (*${order.id}*) عند المحاسبة لتسليمك فوراً.`;
  } else if (order.status === 'processing') {
    actionAdvice = `⏳ *الموعد المتوقع للجاهزية:* ${order.estimatedReadyTime || 'قريباً'}\nسنقوم بإشعاركم فور تجهيز الطلب بالكامل.`;
  } else if (order.status === 'reviewing') {
    actionAdvice = `فريق المكتبة يقوم حالياً بتدقيق الملفات وإعدادها.`;
  } else if (order.status === 'completed') {
    actionAdvice = `نشكركم على ثقتكم الغالية ونتشرف بخدمتكم دائماً في مكتبة جمعية النعيم!`;
  }

  const message = `*مكتبة وخدمات الطباعة - جمعية النعيم سوق القصر المركزي*
━━━━━━━━━━━━━━━━━━━━━
مرحباً أستاذ/ة *${order.customerName}* المحترم/ة 🌸

نود إبلاغكم بآخر تحديث لحالة طلبكم:

📋 *رقم الطلب:* ${order.id}
📌 *الخدمة:* ${order.serviceTitle}
📊 *الحالة الحالية:* ${statusLabels[order.status]}

${actionAdvice}

━━━━━━━━━━━━━━━━━━━━━
💬 *لأي استفسار أو تعديل، يمكنك الرد على هذه الرسالة مباشرة.*
📍 فرع جمعية النعيم التعاونية - سوق القصر المركزي (الدور الميزانين)`;

  // Clean phone number (add Kuwait prefix 965 if 8 digits)
  let phone = order.customerPhone.replace(/\D/g, '');
  if (phone.length === 8) {
    phone = '965' + phone;
  }

  const encodedMsg = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${encodedMsg}` : `https://wa.me/965${STORE_INFO.phone}?text=${encodedMsg}`;
}

export const ORDER_STATUS_DETAILS: Record<OrderStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  stepIndex: number;
}> = {
  reviewing: {
    label: 'قيد المراجعة والتدقيق',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    description: 'تم استلام الملفات والبيانات وجاري التحقق منها وتجهيزها للطباعة.',
    stepIndex: 1
  },
  processing: {
    label: 'قيد التنفيذ والطباعة',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    description: 'الطلب قيد الطباعة والقص والتجليد في ماكيناتنا المتطورة.',
    stepIndex: 2
  },
  ready_for_pickup: {
    label: 'جاهز للاستلام بالميزانين',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    description: 'تم تجهيز الطلب بالكامل وهو بانتظاركم في سوق القصر المركزي - الدور الميزانين.',
    stepIndex: 3
  },
  completed: {
    label: 'مكتمل وتم الاستلام',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    description: 'تم تسليم الطلب للعميل بنجاح.',
    stepIndex: 4
  },
  cancelled: {
    label: 'تم الإلغاء',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    description: 'تم إلغاء هذا الطلب.',
    stepIndex: 0
  }
};
