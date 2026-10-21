"""Render the approved Alamasy brand operating manual as a landscape PDF.

Usage: PYTHONPATH=/tmp/alamasy-pdf-deps python brand/build_manual_pdf.py
Requires: reportlab, arabic-reshaper, python-bidi.
"""

from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand" / "Alamasy-Brand-Operating-Manual-v1.1.pdf"
LOGO = ROOT / "public" / "alamasy-approved-logo.png"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
pdfmetrics.registerFont(TTFont("Arabic", FONT))
pdfmetrics.registerFont(TTFont("Arabic-Bold", FONT_BOLD))

W, H = landscape(A4)
INK = HexColor("#0F172A")
NAVY = HexColor("#142C35")
BLUE = HexColor("#1D4ED8")
TEAL = HexColor("#0D797B")
PAPER = HexColor("#F8FAFC")
LINE = HexColor("#D9E3EC")
MUTED = HexColor("#526174")
WHITE = HexColor("#FFFFFF")
GOLD = HexColor("#FBBF24")


def ar(value):
    return get_display(arabic_reshaper.reshape(value))


def right(c, value, x, y, size=11, bold=False, color=INK):
    c.setFont("Arabic-Bold" if bold else "Arabic", size)
    c.setFillColor(color)
    c.drawRightString(x, y, ar(value))


def left(c, value, x, y, size=10, bold=False, color=INK):
    c.setFont("Arabic-Bold" if bold else "Arabic", size)
    c.setFillColor(color)
    c.drawString(x, y, value)


def wrapped(c, value, x, y, max_width, size=10.1, line_height=19, color=INK):
    words = str(value).split()
    lines, chunk = [], ""
    for word in words:
        next_chunk = (chunk + " " + word).strip()
        if chunk and pdfmetrics.stringWidth(ar(next_chunk), "Arabic", size) > max_width:
            lines.append(chunk)
            chunk = word
        else:
            chunk = next_chunk
    if chunk:
        lines.append(chunk)
    for text in lines:
        right(c, text, x, y, size, color=color)
        y -= line_height
    return y


def background(c, number, kicker, title, subtitle=""):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(TEAL)
    c.rect(0, H - 9, W, 9, stroke=0, fill=1)
    left(c, "ALAMASY  /  BRAND OPERATING MANUAL  /  V1.1", 39, H - 42, 8, color=MUTED)
    right(c, "مكتبة الأماسي", W - 40, H - 42, 10.5, True, NAVY)
    c.setStrokeColor(LINE)
    c.line(39, H - 55, W - 39, H - 55)
    right(c, kicker, W - 40, H - 82, 9.5, False, TEAL)
    right(c, title, W - 40, H - 114, 21, True, NAVY)
    if subtitle:
        right(c, subtitle, W - 40, H - 137, 9.5, False, MUTED)
    c.line(39, 41, W - 39, 41)
    left(c, "21 OCT 2026  •  APPROVED MARK / CONTROLLED SPEC", 39, 23, 7.5, color=MUTED)
    left(c, f"{number:02d} / 12", W - 82, 23, 8.5, True, TEAL)


def card(c, x, top, width, height, heading, rows, bg=WHITE, accent=TEAL, font_size=9.6):
    y0 = top - height
    c.setFillColor(bg)
    c.setStrokeColor(LINE)
    c.roundRect(x, y0, width, height, 12, fill=1, stroke=1)
    c.setFillColor(accent)
    c.roundRect(x + width - 8, y0 + 14, 3, height - 28, 1, fill=1, stroke=0)
    right(c, heading, x + width - 24, top - 32, 13, True, NAVY)
    y = top - 55
    for item in rows:
        c.setFillColor(accent)
        c.circle(x + width - 26, y + 4, 2.4, stroke=0, fill=1)
        y = wrapped(c, item, x + width - 39, y, width - 68, font_size, 18)
        y -= 8
        if y < y0 + 11:
            raise ValueError(f"Card overflow: {heading}, {item!r}")


def twin(c, left_title, left_rows, right_title, right_rows, height=362, font_size=9.5):
    gap = 18
    col_w = (W - 78 - gap) / 2
    card(c, 39, H - 171, col_w, height, left_title, left_rows, font_size=font_size)
    card(c, 39 + col_w + gap, H - 171, col_w, height, right_title, right_rows, font_size=font_size)


def approved_logo(c, x, y, width, visible_height):
    """Clip transparent padding in the PDF layout; leave PNG pixels intact."""
    bbox = (100, 376, 1172, 945)
    scale = width / (bbox[2] - bbox[0])
    image_x = x - bbox[0] * scale
    image_y = y - (1254 - bbox[3]) * scale
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, width, visible_height)
    c.clipPath(p, fill=0, stroke=0)
    c.drawImage(ImageReader(str(LOGO)), image_x, image_y, 1254 * scale, 1254 * scale, mask="auto")
    c.restoreState()


def cover(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(TEAL)
    c.rect(0, H - 10, W, 10, fill=1, stroke=0)
    left(c, "ALAMASY  /  BRAND OPERATING MANUAL", 46, H - 53, 10, color=HexColor("#90BFC1"))
    right(c, "المرجع التنفيذي الرسمي للهوية", W - 45, H - 53, 11, color=WHITE)
    c.setStrokeColor(HexColor("#36535C"))
    c.line(46, H - 67, W - 46, H - 67)
    right(c, "مكتبة الأماسي", W - 45, H - 147, 32, True, WHITE)
    right(c, "دليل تشغيل الهوية البصرية والتجربة", W - 45, H - 184, 16, color=HexColor("#D9E4E6"))
    right(c, "قواعد جاهزة للتصميم والتطوير والطباعة والتواصل", W - 45, H - 212, 10.5, color=HexColor("#AFC7CB"))
    c.setFillColor(HexColor("#0C2027"))
    c.roundRect(52, 156, 405, 222, 18, stroke=0, fill=1)
    approved_logo(c, 76, 173, 356, 189)
    c.setFillColor(TEAL)
    c.roundRect(W - 322, 189, 275, 66, 9, stroke=0, fill=1)
    right(c, "شعار الكتاب المفتوح: نسخة المالك المعتمدة", W - 61, 228, 10, True, WHITE)
    right(c, "لا تعديل في الرسم أو اللون أو حروف الاسم", W - 61, 207, 8.5, color=WHITE)
    left(c, "V1.1  /  21 OCT 2026", 46, 52, 10.5, True, WHITE)
    right(c, "مشروع مستقل — الأماسي فقط", W - 46, 52, 10.5, color=WHITE)
    c.showPage()


def color_chip(c, x, y, label, color, use, light=False):
    c.setFillColor(HexColor(color))
    c.roundRect(x, y, 108, 60, 10, stroke=0, fill=1)
    left(c, color, x + 11, y + 20, 10, True, INK if light else WHITE)
    right(c, label, x + 109, y - 18, 9.2, True, NAVY)
    right(c, use, x + 109, y - 35, 8.1, color=MUTED)


def page(c, number, kicker, heading, left_title, left_rows, right_title, right_rows, subtitle="", height=361, font_size=9.5):
    background(c, number, kicker, heading, subtitle)
    twin(c, left_title, left_rows, right_title, right_rows, height, font_size)
    c.showPage()


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("مكتبة الأماسي — Brand Operating Manual v1.1")
    c.setAuthor("Alamasy Copy Center")
    cover(c)

    page(c, 2, "01 / BRAND FOUNDATION", "القرارات الحاكمة للعلامة",
         "ثوابت معتمدة", [
             "الاسم داخل الأصل المصور: مكتبة الأماسي، دون إعادة كتابة حروفه بخط بديل.",
             "النشاط في الواجهة: طباعة ونسخ وطلبات مخصصة، حسب الخدمات المنشورة فعلًا.",
             "العلامة مشروع تجاري مستقل؛ خدمات المعاملات ليست صادرة عن جهة حكومية.",
             "علامة Alamasy التقنية ليست تفويضًا باستخدام تهجئة لاتينية على لافتة.",
         ], "قواعد القرار والرفض", [
             "ترتيب الرسالة: الاسم، الخدمة، المطلوب من العميل، وسيلة الإجراء.",
             "تُعرض أوقات العمل والعناوين والأسعار من مصدر موثّق واحد فقط.",
             "صحيح: «أرسل ملفك لطلب تسعير». خطأ: «طباعة فورية مضمونة» بلا إثبات.",
             "مالك العلامة يوافق على الشعار والوعود؛ مسؤول التشغيل يعتمد بيانات المتجر.",
         ], height=358)

    background(c, 3, "02 / SIGNATURE SYSTEM", "نظام الشعار المعتمد", "الأصل محفوظ كما هو: PNG شفاف بقياس 1254 × 1254 بكسل")
    c.setFillColor(NAVY)
    c.roundRect(40, 179, 407, 235, 14, stroke=0, fill=1)
    approved_logo(c, 57, 203, 368, 192)
    right(c, "تطبيق على أرضية كحلية", 428, 162, 9.4, color=MUTED)
    card(c, 469, 422, 333, 281, "الضبط الإلزامي", [
        "الأصل: public/alamasy-approved-logo.png.",
        "قص الفراغ الشفاف داخل إطار العرض فقط؛ لا تعديل على الصورة الأصلية.",
        "حماية لا تقل عن 10% من العرض المرئي، وعرض رقمي لا يقل عن 160px.",
        "ممنوع: تغيير لون الرمادي، التمديد، الميل، الظل، فصل الكتاب عن النص.",
        "الطباعة الكبيرة: يلزم أصل متجهي مطابق يوافق عليه المالك قبل الإنتاج.",
    ], font_size=9.0)
    right(c, "المقياس والإظهار يتبعان حجم الرسم المرئي وليس مربع PNG الشفاف.", W - 42, 111, 9.5, color=TEAL)
    c.showPage()

    background(c, 4, "03 / COLOR & TYPOGRAPHY", "اللون والخطوط")
    color_chip(c, 45, 373, "الأزرق الأساسي", "#1D4ED8", "إجراءات", False)
    color_chip(c, 173, 373, "الكحلي", "#0F172A", "حبر وأرضية", False)
    color_chip(c, 301, 373, "السطح", "#F1F5F9", "خلفيات", True)
    color_chip(c, 429, 373, "الكهرماني", "#FBBF24", "تنبيه محدود", True)
    color_chip(c, 557, 373, "حواف", "#CBD5E1", "حدود", True)
    card(c, 45, 306, 365, 153, "قواعد اللون", [
        "70% ألوان محايدة، 25% أزرق وكحلي، بحد أقصى 5% كهرماني.",
        "تباين النص العادي ≥ 4.5:1 والعناصر الكبيرة والوظيفية ≥ 3:1.",
        "ممنوع النص الأبيض الصغير على الأصفر؛ لون الشعار من الصورة الأصلية.",
    ], font_size=9.1)
    card(c, 430, 306, 365, 153, "قواعد الكتابة الرقمية", [
        "Cairo / Tajawal / sans-serif؛ الأوزان 400 و600 و700 و800.",
        "عنوان 40/32/24px، متن 16px مع تباعد 1.6، لا يقل عن 14px أساسيًا.",
        "الأرقام والهواتف ومعرفات الطلبات تُعزل اتجاهيًا LTR داخل صفحة RTL.",
    ], font_size=9.1)
    c.showPage()

    page(c, 5, "04 / DESIGN SYSTEM", "الشبكات والعناصر والمكوّنات",
         "الشبكة والتجاوب", [
             "وحدة التباعد 4px: 4، 8، 12، 16، 24، 32، 48، 64.",
             "عرض المحتوى الأقصى 1280px، وهوامش 16/24/32px حسب الشاشة.",
             "نقاط القطع 320–639 و640–1023 و1024px فأعلى.",
             "زوايا 12px للحقول، 16px للبطاقات؛ مساحة اللمس ≥ 44×44px.",
             "صحيح: عمود واحد للنموذج على الهاتف. خطأ: ثلاث خانات ضيقة متجاورة.",
         ], "الأيقونات والأنماط", [
             "أيقونات Lucide بقياس 24px وسمك خط 2px؛ 16px في التفاصيل.",
             "الأيقونة تساند النص ولا تستبدله، خاصة الحالات والإشعارات.",
             "رسوم وظيفية لقياسات الورق والقص والنزف وتجهيز المستندات فقط.",
             "نمط حدود الورق/القص مسموح في خلفية الإعلان حتى 10% من المساحة.",
             "ممنوع ماكينة أو فرع متخيّل يوحي بوجود تجهيزات غير موثقة.",
         ], height=362)

    page(c, 6, "05 / ASSETS & MOTION", "التصوير والرسوم والحركة",
         "مكتبة الصور والحقوق", [
             "استخدم منتجات مطبوعة حقيقية، ثم خامات وتشطيبات موثقة.",
             "صور الفرع والموظفين والعملاء تستلزم إذنًا وحقوق استخدام واضحة.",
             "لكل أصل: معرّف ومصدر وحقوق وموافقات وتاريخ وصفي بديل.",
             "ممنوع إظهار رقم مدني أو ملفات خاصة ضمن مثال تسويقي.",
             "الصور المخزنية أو المولدة توضع في خانة «توضيحية» ولا تُنسب للفرع.",
         ], "الحركة والفيديو", [
             "التحويم والتركيز 150ms؛ الحوارات 250ms كحد أعلى.",
             "prefers-reduced-motion يزيل الزخارف الحركية غير الضرورية.",
             "شريط التقدم يعكس عملية رفع حقيقية، لا عدّادًا محليًا مصطنعًا.",
             "الفيديو يعرض عمليات حقيقية أو شرحًا واضحًا للملف.",
             "ممنوع عرض «تمت الطباعة» قبل تحديث الحالة من مصدر تشغيلي.",
         ], height=362)

    page(c, 7, "06 / PRODUCT EXPERIENCE", "الموقع ونظام الطلبات",
         "مكتبة المكونات", [
             "زر رئيسي واحد بحسب المرحلة: «احسب التكلفة» أو «أرسل الطلب».",
             "كل حقل بعنوان ظاهر ورسالة خطأ مجاورة وتركيز واضح.",
             "رفع الملفات يوضح النوع والحجم والعدد والحذف وإعادة المحاولة.",
             "التقدير يبين الكمية والخامة والتشطيب ويظل «تقديريًا» حتى المراجعة.",
             "الحوار يستجيب لـ Esc وTab ويعيد التركيز عند الإغلاق.",
         ], "بوابة قبول الواجهة", [
             "اختبار شاشة 320px وتكبير 200% واتجاه RTL ولوحة المفاتيح.",
             "الأزرار تتبع أفعالًا فعلية؛ فتح واتساب لا يعني إرسال الرسالة.",
             "حالات كل إجراء: انتظار، تحميل، خطأ، نجاح، إلغاء عند الحاجة.",
             "الشاشة الفارغة تعرض السبب والخطوة التالية دون نجاح وهمي.",
             "المعنى لا يعتمد على لون الشارة وحده؛ يرافقه نص مفهوم.",
         ], height=362)

    page(c, 8, "07 / SERVICE JOURNEY", "الحالات والإيصالات والتسليم",
         "مسار العمل الملزم", [
             "اختيار الخدمة ← رفع الملف ← المواصفات ← تقدير السعر ← المراجعة ← الطلب.",
             "reviewing: قيد المراجعة؛ processing: قيد التنفيذ.",
             "ready_for_pickup: جاهز للاستلام؛ completed: مكتمل؛ cancelled: ملغي.",
             "يُعرض «جاهز» بعد تسجيل الجاهزية الواقعية فقط.",
             "نسخة المعاينة موسومة «معاينة للاعتماد» ورقم إصدار عند التعديل.",
         ], "مستندات المعاملة", [
             "الإيصال يحتوي المرجع والتاريخ والكمية وبند الخدمة والإجمالي وحالة الدفع.",
             "الأسعار بدينار كويتي وثلاث منازل عشرية عند الحاجة؛ لا تخمين للضرائب.",
             "بطاقة التسليم برقم طلب كبير وحالة واضحة واسم مختصر عند الضرورة.",
             "يُحظر وضع العلامة مائية على أصل ملف العميل أو وثيقة حكومية.",
             "غلاف التسليم والإيصال يمكن أن يحملا العلامة دون مساس بالمستند.",
         ], height=362)

    page(c, 9, "08 / LANGUAGE & TRUST", "لغة التواصل ورسائل العملاء",
         "قواعد الكتابة", [
             "عبارات واضحة ومباشرة بلا تفخيم أو وعود سرعة غير مثبتة.",
             "كل رسالة تتضمن حالة الطلب، المطلوب، والخطوة اللاحقة عند توفرها.",
             "سياقات منفصلة: استفسار، تسعير، معاينة، اعتماد، قبول، تأخير، استلام، إلغاء.",
             "خدمات المعاملات تحمل «خدمة خاصة غير تابعة لأي جهة حكومية».",
             "فصل رسوم الأماسي عن رسوم الجهات؛ استعمال لغة عربية بسيطة منضبطة.",
         ], "نماذج صحيح / خطأ", [
             "صحيح: «استلمنا طلب التسعير وبنراجع تفاصيل الملف».",
             "خطأ: «طلبك اتنفذ» إذا كان ما حدث مجرد فتح رابط واتساب.",
             "صحيح: «السعر النهائي بعد مراجعة المقاس والعدد والخامة».",
             "خطأ: «موافقة حكومية مضمونة» أو «تسليم فوري» بلا دليل.",
             "لا تُرسل بيانات عميل إلى قناة أخرى دون موافقة أو مقتضى واضح.",
         ], height=362)

    page(c, 10, "09 / CAMPAIGNS", "الإعلانات وقنوات التواصل",
         "قالب الإعلان", [
             "خدمة واحدة + أصل مرئي مُجاز + منفعة قابلة للتحقق + دعوة واحدة.",
             "المنشور 1080×1350؛ القصة 1080×1920 مع فحص مناطق الأمان.",
             "الفئات: مستندات، مشاريع طلاب، مطبوعات دعائية، هدايا، معاملات.",
             "العرض السعري يوضح الشروط وتاريخ الانتهاء والقيود.",
             "ممنوع «الأرخص والأسرع في الكويت» من دون إثبات قابل للمراجعة.",
         ], "إعداد الحملة ومراجعتها", [
             "النسخة الأولى للشاشات الصغيرة؛ نص قليل وشعار ضمن منطقة آمنة.",
             "افصل الكابشن عن الصورة، وتحقق من صلاحية الروابط ورقم التواصل.",
             "لا تُعرض صورة عميل أو ملفه أو شهادته دون موافقة موثقة.",
             "قبل النشر: تدقيق الادعاءات، المواعيد، الصور، الأحجام، CTA.",
             "قِس النقرات وطلبات التسعير الفعلية، لا المشاهدات وحدها.",
         ], height=362)

    page(c, 11, "10 / PHYSICAL EXPERIENCE", "المطبوعات والفرع والتغليف",
         "المخرجات الورقية", [
             "بطاقة عمل، إيصال، ورقة معاينة، بطاقة سعر، ملصق طلب، غلاف حماية.",
             "ملف PDF/X بحسب المورد، صور 300ppi بمقاسها، نزف 3mm عند الحاجة.",
             "هامش أمان 3mm للصغير و5mm فأعلى للأكبر، مع تضمين الخطوط.",
             "لا طباعة إنتاجية دون بروفة خامة ولون ومقاس وموافقة موثقة.",
             "تغليف الطلب يحمي المستندات ويبيّن الرقم ولا يكشف بيانات العميل.",
         ], "الفرع والعينات", [
             "لوحة الوجهة: الشعار أولًا ثم وصف الخدمة؛ الاتجاهات بلوحة منفصلة.",
             "مناطق واضحة: استعلام، إرسال ملفات، معاينة، دفع، استلام.",
             "عينة المنتج تحمل الورق/الجرام/التشطيب/المقاس والسعر إن كان معتمدًا.",
             "لا يُنفذ نظام مركبات أو معارض قبل وجود أصل تشغيلي فعلي.",
             "اللافتات الكبيرة تنتظر إصدارًا متجهيًا مطابقًا وموافقًا عليه.",
         ], height=362)

    page(c, 12, "11 / DELIVERY & GOVERNANCE", "التنفيذ والحوكمة وبوابة الإصدار",
         "مصدر الحقيقة والتنفيذ", [
             "الملف الحاكم: BRAND-OPERATING-MANUAL.md؛ الألوان: alamasy-tokens.json.",
             "التطبيق: BrandLogo، Header، Hero، نماذج الطلب، الحالات، الإيصالات.",
             "تسمية الأصول: alamasy_[asset]_[variant]_[locale]_[version].",
             "لكل تغيير: سبب، ملفات متأثرة، اختبار، نتيجة، موافقة، تاريخ.",
             "مراجعة المطور: التباين والتجاوب وRTL وحقيقة الرسائل والروابط.",
         ], "فحوص قبل اعتماد النسخة", [
             "الشعار الرقمي الأصلي مُركّب؛ الأصل المتجهي الطباعي لم يُقدّم بعد.",
             "لا تزال بيانات العنوان والدوام والأسعار تحتاج مراجعة تشغيلية.",
             "اختبارات 320px وتكبير 200% والحقوق البصرية يجب توثيق نتائجها.",
             "مراجعة المورد اللونية ICC والبروفة ضرورية للمواد المطبوعة.",
             "لا تُعلن العناصر غير المتحقق منها كأنها مُعتمدة أو مكتملة.",
         ], height=362)

    c.save()
    print(f"Created {OUT}")


if __name__ == "__main__":
    main()
