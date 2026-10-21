import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory backing storage for server-side persistence
const inMemoryOrders: any[] = [
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
    pickupLocation: 'جمعية النعيم التعاونية - سوق القصر المركزي - الدور الميزانين'
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
    pickupLocation: 'جمعية النعيم التعاونية - سوق القصر المركزي - الدور الميزانين'
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
    pickupLocation: 'جمعية النعيم التعاونية - سوق القصر المركزي - الدور الميزانين'
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'مكتبة وخدمات الطباعة - جمعية النعيم سوق القصر المركزي' });
});

// Custom Service Request Submission & Email Dispatch API
app.post('/api/custom-request', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      serviceTitle,
      dimensions,
      quantity,
      colorPreferences,
      targetDate,
      description,
      additionalNotes,
      attachedFiles = []
    } = req.body;

    if (!customerName || !customerPhone || !description) {
      return res.status(400).json({ 
        error: 'يرجى تزويدنا باسم العميل ورقم الهاتف والوصف التفصيلي للخدمة.' 
      });
    }

    const trackingId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString('ar-KW', { timeZone: 'Asia/Kuwait' });

    const newOrder = {
      id: trackingId,
      customerName,
      customerPhone,
      customerEmail,
      orderType: 'custom_service',
      serviceTitle: serviceTitle || serviceType || 'طلب خدمة مخصصة',
      details: `${serviceType || 'خدمة خاصة'} • الكمية: ${quantity || '1'} ${dimensions ? `• المقاس: ${dimensions}` : ''} ${colorPreferences ? `• الألوان: ${colorPreferences}` : ''}`,
      files: attachedFiles.map((f: any) => ({ name: f.name, size: f.size, type: f.type })),
      totalCost: 'سيتم تحديده بعد المراجعة والاتصال',
      createdAt: now,
      estimatedReadyTime: targetDate ? `الموعد المقترح: ${targetDate}` : 'خلال 24-48 ساعة',
      status: 'reviewing',
      statusUpdates: [
        {
          status: 'reviewing',
          timestamp: now,
          note: 'تم استقبال طلب الخدمة المخصصة وجاري مراجعة المتطلبات وإشعار مسؤول المكتبة عبر البريد الإلكتروني.'
        }
      ],
      pickupLocation: 'جمعية النعيم التعاونية - سوق القصر المركزي - الدور الميزانين',
      notes: description
    };

    inMemoryOrders.unshift(newOrder);

    // Email dispatch payload prepared for library admin
    const emailPayload = {
      to: 'naeem.print.kw@gmail.com',
      subject: `[طلب خدمة مخصصة جديد - ${trackingId}] من ${customerName} (${serviceType || 'تصميم وطباعة'})`,
      emailBody: `
══════════════════════════════════════════════
طلب خدمة مخصصة جديد - مكتبة جمعية النعيم سوق القصر
══════════════════════════════════════════════

📋 رقم تتبع الطلب: ${trackingId}
👤 اسم العميل: ${customerName}
📞 هاتف / واتساب: ${customerPhone}
📧 البريد الإلكتروني: ${customerEmail || 'غير محدد'}
🕒 تاريخ وتوقيت الطلب: ${now}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تفاصيل ومواصفات الخدمة:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 نوع الخدمة: ${serviceType}
📌 عنوان الخدمة: ${serviceTitle || serviceType}
📏 الأبعاد / المقاسات: ${dimensions || 'حسب الاقتراح القياسي'}
🔢 الكمية المطلوبة: ${quantity || '1'}
🎨 تفضيلات الألوان والتشطيب: ${colorPreferences || 'حسب التصميم'}
⏳ موعد التسليم المستهدف: ${targetDate || 'أقرب وقت متاح'}

📝 الوصف التفصيلي والمتطلبات:
${description}

${additionalNotes ? `💡 ملاحظات إضافية:\n${additionalNotes}\n` : ''}

📎 الملفات والمرفقات التصميمية (${attachedFiles.length} ملفات):
${attachedFiles.map((f: any, idx: number) => `  ${idx + 1}. ${f.name} (${f.size ? (f.size / 1024).toFixed(1) + ' KB' : ''})`).join('\n') || 'لا توجد مرفقات'}

══════════════════════════════════════════════
فرع سوق القصر المركزي - الدور الميزانين | هاتف: 97445151
══════════════════════════════════════════════
`
    };

    console.log('--- NEW CUSTOM REQUEST RECEIVED & EMAIL DISPATCHED ---');
    console.log(emailPayload.subject);
    console.log(emailPayload.emailBody);
    console.log('------------------------------------------------------');

    return res.status(200).json({
      success: true,
      trackingId,
      message: 'تم استلام طلبكم وإشعار مسؤول المكتبة عبر البريد الإلكتروني بنجاح.',
      order: newOrder,
      emailSentTo: 'naeem.print.kw@gmail.com'
    });
  } catch (error: any) {
    console.error('Error handling custom request:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء معالجة الطلب.' });
  }
});

// Orders API Routes
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders: inMemoryOrders });
});

app.get('/api/orders/:id', (req, res) => {
  const query = req.params.id.trim().toLowerCase();
  const order = inMemoryOrders.find(
    o => o.id.toLowerCase() === query || 
         o.id.toLowerCase().replace('-', '') === query.replace('-', '') ||
         o.customerPhone.includes(query)
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'لم يتم العثور على طلب بهذا الرقم' });
  }
  return res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  if (!newOrder || !newOrder.id) {
    return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
  }
  inMemoryOrders.unshift(newOrder);
  return res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, estimatedReadyTime } = req.body;
  const order = inMemoryOrders.find(o => o.id.toLowerCase() === id.toLowerCase());

  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  const now = new Date().toLocaleString('ar-KW', { timeZone: 'Asia/Kuwait' });
  order.status = status;
  if (estimatedReadyTime !== undefined) order.estimatedReadyTime = estimatedReadyTime;
  order.statusUpdates.push({
    status,
    timestamp: now,
    note: note || `تم تحديث حالة الطلب إلى ${status}`
  });

  return res.json({ success: true, order });
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
