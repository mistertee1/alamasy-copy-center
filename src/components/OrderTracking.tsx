import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Phone, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  SlidersHorizontal,
  Navigation,
  Copy,
  Check,
  Building,
  Sparkles,
  Volume2,
  VolumeX,
  BellRing,
  Play,
  ArrowLeft,
  Store,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { TrackableOrder, OrderStatus } from '../types';
import { 
  getAllOrders, 
  findOrder, 
  updateOrderStatus, 
  generateCustomerWhatsAppNotificationUrl,
  ORDER_STATUS_DETAILS 
} from '../utils/ordersStore';
import { 
  playNotificationSound, 
  isSoundNotificationEnabled, 
  setSoundNotificationEnabled 
} from '../utils/soundEffects';
import { STORE_INFO } from '../data/servicesData';

interface OrderTrackingProps {
  initialOrderId?: string;
  onNavigateToQuickPrint?: () => void;
  onNavigateToCustomRequest?: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  initialOrderId,
  onNavigateToQuickPrint,
  onNavigateToCustomRequest
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<TrackableOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentOrders, setRecentOrders] = useState<TrackableOrder[]>([]);
  
  // Sound Notification state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundPlayingAnimation, setSoundPlayingAnimation] = useState(false);
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'ready' | 'info';
  } | null>(null);

  // Staff Admin Mode
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Track previous status to detect transitions (especially reviewing -> ready_for_pickup)
  const prevStatusRef = useRef<OrderStatus | null>(null);

  useEffect(() => {
    setSoundEnabled(isSoundNotificationEnabled());
    const orders = getAllOrders();
    setRecentOrders(orders.slice(0, 5));

    if (initialOrderId) {
      const found = findOrder(initialOrderId);
      if (found) {
        setCurrentOrder(found);
        prevStatusRef.current = found.status;
        setHasSearched(true);
      }
    } else {
      // Default to showing the first active order as a live demo
      if (orders.length > 0) {
        setCurrentOrder(orders[0]);
        prevStatusRef.current = orders[0].status;
        setSearchQuery(orders[0].id);
      }
    }
  }, [initialOrderId]);

  // Handle toggling sound
  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    setSoundNotificationEnabled(newState);
    if (newState) {
      triggerSound('test');
    }
  };

  // Trigger sound effect with visual wave animation
  const triggerSound = (type: 'ready_for_pickup' | 'processing' | 'reviewing' | 'completed' | 'test') => {
    if (!soundEnabled) return;
    setSoundPlayingAnimation(true);
    playNotificationSound(type);
    setTimeout(() => {
      setSoundPlayingAnimation(false);
    }, 1500);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    const found = findOrder(searchQuery);
    if (found) {
      setCurrentOrder(found);
      prevStatusRef.current = found.status;
    } else {
      setCurrentOrder(null);
    }
  };

  const handleSelectSample = (orderId: string) => {
    setSearchQuery(orderId);
    const found = findOrder(orderId);
    if (found) {
      setCurrentOrder(found);
      prevStatusRef.current = found.status;
      setHasSearched(true);
      // If sample is ready, show quick notification
      if (found.status === 'ready_for_pickup') {
        showReadyNotification(found, false);
      }
    }
  };

  const showReadyNotification = (order: TrackableOrder, playAudio = true) => {
    setNotificationToast({
      show: true,
      title: '🎉 طلبك جاهز للاستلام الآن بالميزانين!',
      message: `الطلب رقم (${order.id}) الخاص بـ ${order.customerName} تم تجهيزه وتغليفه بالكامل وهو بانتظاركم في فرع سوق القصر.`,
      type: 'ready'
    });
    if (playAudio) {
      triggerSound('ready_for_pickup');
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!currentOrder) return;
    const oldStatus = currentOrder.status;
    setIsUpdatingStatus(true);
    
    setTimeout(() => {
      const updated = updateOrderStatus(currentOrder.id, newStatus, adminNote || undefined);
      if (updated) {
        setCurrentOrder(updated);
        // Refresh recent list
        setRecentOrders(getAllOrders().slice(0, 5));
        setAdminNote('');

        // Trigger Audio & Visual Notification
        if (newStatus === 'ready_for_pickup') {
          showReadyNotification(updated, true);
        } else if (newStatus === 'processing') {
          setNotificationToast({
            show: true,
            title: '🖨️ الطلب قيد التنفيذ والطباعة',
            message: `تم البدء في طباعة وتجهيز طلبك (${updated.id}) في الماكينات المخصصة.`,
            type: 'info'
          });
          triggerSound('processing');
        } else if (newStatus === 'completed') {
          triggerSound('completed');
          setNotificationToast({
            show: true,
            title: '✅ تم تسليم الطلب بنجاح',
            message: `شكراً لتعاملكم مع مكتبة جمعية النعيم سوق القصر.`,
            type: 'info'
          });
        }
        prevStatusRef.current = newStatus;
      }
      setIsUpdatingStatus(false);
    }, 200);
  };

  // Simulation: Transition from 'جاري المراجعة' to 'جاهز للاستلام' with sound alert
  const handleSimulateStatusFlow = () => {
    if (!currentOrder) return;
    setIsSimulating(true);

    // Step 1: Set to Reviewing first
    const step1 = updateOrderStatus(
      currentOrder.id, 
      'reviewing', 
      'محاكاة: الطلب في مرحلة التدقيق الأولي والمراجعة الفنية للملفات.'
    );
    if (step1) setCurrentOrder(step1);

    setNotificationToast({
      show: true,
      title: '⏳ المرحلة 1: جاري المراجعة والتدقيق',
      message: 'الطلب قيد التحقق من المقاسات والهوامش ومطابقة المستندات...',
      type: 'info'
    });

    // Step 2: After 1.6s, move to Processing
    setTimeout(() => {
      const step2 = updateOrderStatus(
        currentOrder.id,
        'processing',
        'محاكاة: تمت الموافقة على الملفات والطلب الآن على ماكينات الطباعة الليزرية والتجليد.'
      );
      if (step2) setCurrentOrder(step2);
      triggerSound('processing');

      setNotificationToast({
        show: true,
        title: '🖨️ المرحلة 2: قيد التنفيذ والطباعة',
        message: 'تمت الطباعة بنجاح وجاري التجليد والتغليف الفاخر...',
        type: 'info'
      });

      // Step 3: After another 2.2s, reach READY FOR PICKUP with celebratory chime
      setTimeout(() => {
        const step3 = updateOrderStatus(
          currentOrder.id,
          'ready_for_pickup',
          'محاكاة: اكتمل الطلب بالكامل ووضع في صندوق الاستلام بالميزانين بفرع جمعية النعيم سوق القصر.'
        );
        if (step3) {
          setCurrentOrder(step3);
          setRecentOrders(getAllOrders().slice(0, 5));
          showReadyNotification(step3, true);
        }
        setIsSimulating(false);
      }, 2200);
    }, 1800);
  };

  const handleCopyNotificationText = (order: TrackableOrder) => {
    const url = generateCustomerWhatsAppNotificationUrl(order);
    const textParam = new URL(url).searchParams.get('text') || '';
    navigator.clipboard.writeText(textParam);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const statusInfo = currentOrder ? ORDER_STATUS_DETAILS[currentOrder.status] : null;

  // Stepper steps configuration
  const stepperSteps = [
    { 
      key: 'reviewing', 
      title: 'جاري المراجعة', 
      subtitle: 'تدقيق المستندات والملفات', 
      icon: Clock,
      stepNumber: 1 
    },
    { 
      key: 'processing', 
      title: 'قيد التنفيذ', 
      subtitle: 'الطباعة والتجهيز الفني', 
      icon: RefreshCw,
      stepNumber: 2 
    },
    { 
      key: 'ready_for_pickup', 
      title: 'جاهز للاستلام', 
      subtitle: 'بالميزانين بسوق القصر', 
      icon: Store,
      stepNumber: 3 
    },
    { 
      key: 'completed', 
      title: 'تم الاستلام', 
      subtitle: 'تسليم العميل النهائي', 
      icon: ShieldCheck,
      stepNumber: 4 
    },
  ];

  const currentStepNumber = statusInfo ? statusInfo.stepIndex : 1;
  const progressPercent = Math.max(0, Math.min(100, ((currentStepNumber - 1) / (stepperSteps.length - 1)) * 100));

  return (
    <section id="order-tracking" className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-black mb-3 shadow-xs">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>نظام تتبع حالة المعاملات والطباعة الفورية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            تتبع حالة طلبك خطوة بخطوة مع التنبيه الصوتي
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تعرف على المرحلة الدقيقة لطلبك لحظة بلحظة مع <span className="text-emerald-700 font-bold">رنة تنبيه صوتية فورية</span> فور اكتمال التجهيز وجاهزية الطلب للاستلام بفرع الميزانين بسوق القصر.
          </p>

          {/* Sound Controls Header Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100' 
                  : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
              }`}
              title="تفعيل أو كتم التنبيهات الصوتية للطلبات"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>التنبيه الصوتي: مفعل 🔔</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span>التنبيه الصوتي: صامت 🔕</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => triggerSound('ready_for_pickup')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-xs transition active:scale-95"
              title="سماع نغمة الجاهزية للاستلام"
            >
              <BellRing className={`w-3.5 h-3.5 ${soundPlayingAnimation ? 'text-amber-500 animate-bounce' : 'text-blue-600'}`} />
              <span>تجربة نغمة الإشعار 🎵</span>
            </button>

            {/* Sound Wave Animation Visualizer */}
            {soundPlayingAnimation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-mono text-amber-800 animate-pulse">
                <span className="w-1.5 h-3 bg-amber-500 rounded-full animate-ping" />
                <span>جاري تشغيل التنبيه...</span>
              </span>
            )}
          </div>
        </div>

        {/* Global Toast / Notification Alert Box */}
        {notificationToast && notificationToast.show && (
          <div className="max-w-4xl mx-auto mb-6 transition-all duration-300 transform">
            <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              notificationToast.type === 'ready'
                ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white border-emerald-400/40 shadow-emerald-900/20'
                : 'bg-slate-900 text-white border-blue-500/40 shadow-slate-900/20'
            }`}>
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notificationToast.type === 'ready' ? 'bg-emerald-500 text-white animate-bounce' : 'bg-blue-600 text-white'
                }`}>
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black tracking-tight">{notificationToast.title}</h3>
                    {notificationToast.type === 'ready' && (
                      <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                        تنبيه بالصوت 🔔
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">{notificationToast.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => triggerSound('ready_for_pickup')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>إعادة النغمة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationToast(null)}
                  className="px-2.5 py-1.5 bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bento Top: Search & Quick Pickers */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ابحث برقم الطلب أو رقم الهاتف المسجل:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="مثال: ORD-7104 أو REQ-5291 أو 97445151..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  dir="auto"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>استعلام عن الطلب</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Sample Pills & Staff Toggle */}
          <div className="mt-6 pt-6 border-t border-slate-100 max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{import.meta.env.DEV ? 'نماذج لتجربة التتبع:' : 'مسودات هذا الجهاز (ليست تتبعًا سحابيًا):'}</span>
              </span>
              
              {/* Staff Mode Toggle */}
              {import.meta.env.DEV && <button
                type="button"
                onClick={() => setIsStaffMode(!isStaffMode)}
                className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  isStaffMode 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{isStaffMode ? 'لوحة الموظف (نشطة)' : 'لوحة تحكم وتحديث الحالة'}</span>
              </button>}
            </div>

            <div className="flex flex-wrap gap-2">
              {recentOrders.map((ord) => {
                const isSelected = currentOrder?.id === ord.id;
                const statusMeta = ORDER_STATUS_DETAILS[ord.status];
                return (
                  <button
                    key={ord.id}
                    onClick={() => handleSelectSample(ord.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-mono transition flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold">{ord.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : `${statusMeta.badgeBg} ${statusMeta.badgeText}`}`}>
                      {statusMeta.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Simulation Banner Button */}
            {import.meta.env.DEV && currentOrder && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50/60 to-emerald-50/60 p-3.5 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>
                    تجربة فورية: محاكاة انتقال الطلب الحالي من <strong>جاري المراجعة</strong> إلى <strong>جاهز للاستلام</strong> مع رنة التنبيه.
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulateStatusFlow}
                  className={`text-xs font-black px-4 py-2 rounded-xl text-white shadow-xs transition flex items-center gap-1.5 active:scale-95 ${
                    isSimulating 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري المحاكاة والتحديث...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>بدء محاكاة التحديث الصوتي 🔔</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Result Area */}
        {currentOrder ? (
          <div className="space-y-6">
            
            {/* Order Status Bento Banner */}
            <div className="bg-[#0F172A] text-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              {currentOrder.status === 'ready_for_pickup' && (
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              )}
              
              <div className="relative z-10">
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
                        {currentOrder.id}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(currentOrder.id)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                        title="نسخ رقم الطلب"
                      >
                        {copiedOrderId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedOrderId ? 'تم النسخ' : 'نسخ'}</span>
                      </button>
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full">
                        {currentOrder.orderType === 'quick_print' ? 'طباعة مستندات' : 'خدمة مخصصة'}
                      </span>
                      {currentOrder.status === 'ready_for_pickup' && (
                        <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                          <BellRing className="w-3.5 h-3.5" />
                          <span>جاهز للاستلام الفوري بالميزانين</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      صاحب الطلب: <strong className="text-white">{currentOrder.customerName}</strong> • هاتف: <span dir="ltr" className="font-mono text-emerald-400">{currentOrder.customerPhone}</span>
                    </p>
                  </div>

                  {/* Status Badge & Readiness Time */}
                  <div className="flex flex-col sm:items-end">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border ${
                      currentOrder.status === 'ready_for_pickup'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/30'
                        : currentOrder.status === 'processing'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : currentOrder.status === 'completed'
                        ? 'bg-slate-700 text-slate-200 border-slate-600'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {currentOrder.status === 'ready_for_pickup' && <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
                      {currentOrder.status === 'processing' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                      {currentOrder.status === 'reviewing' && <Clock className="w-4 h-4 text-amber-400" />}
                      {currentOrder.status === 'completed' && <ShieldCheck className="w-4 h-4 text-slate-300" />}
                      <span>{statusInfo?.label}</span>
                    </span>

                    {currentOrder.estimatedReadyTime && (
                      <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>الموعد المتوقع: <span className="text-slate-200 font-semibold">{currentOrder.estimatedReadyTime}</span></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Stepper Visualizer (نظام إشعارات يعرض حالة الطلب الحالية بشكل مرئي Progress Stepper) */}
                <div className="pt-8 pb-4">
                  {/* Stepper Progress Bar Track (Desktop & Tablet) */}
                  <div className="relative mb-8 px-2 hidden sm:block">
                    {/* Background line */}
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-2 bg-slate-800 rounded-full" />
                    
                    {/* Active progress fill */}
                    <div 
                      className="absolute top-1/2 right-8 -translate-y-1/2 h-2 bg-gradient-to-l from-blue-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm shadow-blue-500/40"
                      style={{ width: `${progressPercent}%`, left: 'auto' }}
                    />

                    {/* Stepper Node Points */}
                    <div className="relative flex justify-between items-center z-10">
                      {stepperSteps.map((step) => {
                        const isPast = step.stepNumber < currentStepNumber;
                        const isCurrent = step.stepNumber === currentStepNumber;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div 
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                                isCurrent
                                  ? step.key === 'ready_for_pickup'
                                    ? 'bg-emerald-500 border-white text-white shadow-lg shadow-emerald-500/50 scale-110 ring-4 ring-emerald-500/30 animate-pulse'
                                    : 'bg-blue-600 border-white text-white shadow-lg shadow-blue-600/50 scale-110 ring-4 ring-blue-500/30'
                                  : isPast
                                  ? 'bg-emerald-600 border-emerald-400 text-white'
                                  : 'bg-slate-900 border-slate-700 text-slate-500'
                              }`}
                            >
                              {isPast ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stepper Step Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stepperSteps.map((step) => {
                      const isPast = step.stepNumber < currentStepNumber;
                      const isCurrent = step.stepNumber === currentStepNumber;
                      const StepIcon = step.icon;

                      // Find timestamp for this step if exists in history
                      const updateRecord = currentOrder.statusUpdates.find(u => u.status === step.key);

                      return (
                        <div 
                          key={step.key} 
                          className={`p-4 rounded-2xl border transition-all duration-300 ${
                            isCurrent
                              ? step.key === 'ready_for_pickup'
                                ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/80 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-500'
                                : 'bg-gradient-to-b from-blue-950/80 to-slate-900 border-blue-500 text-white shadow-lg shadow-blue-950/50 ring-1 ring-blue-500'
                              : isPast
                              ? 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? step.key === 'ready_for_pickup'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-blue-500 text-white'
                                : isPast
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isPast ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                            </span>

                            {isCurrent && (
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                step.key === 'ready_for_pickup'
                                  ? 'bg-emerald-500 text-white animate-pulse'
                                  : 'bg-blue-500 text-white animate-pulse'
                              }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                <span>المرحلة الحالية</span>
                              </span>
                            )}
                            {isPast && (
                              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>تم الإنجاز</span>
                              </span>
                            )}
                          </div>

                          <h4 className={`text-xs font-bold mb-1 ${
                            isCurrent 
                              ? step.key === 'ready_for_pickup' ? 'text-emerald-300' : 'text-blue-300' 
                              : isPast ? 'text-white' : 'text-slate-500'
                          }`}>
                            {step.stepNumber}. {step.title}
                          </h4>
                          <p className="text-[11px] text-slate-400">{step.subtitle}</p>

                          {/* Step history timestamp if logged */}
                          {updateRecord && (
                            <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{updateRecord.timestamp}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Ready for pickup special highlight notice */}
                  {currentOrder.status === 'ready_for_pickup' && (
                    <div className="mt-5 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-200 text-xs">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-white block font-bold">طلبك جاهز بالميزانين بفرع جمعية النعيم سوق القصر المركزي!</strong>
                          <span>يمكنك التوجه مباشرة للاستلام من الموظف وإبراز رقم الطلب ({currentOrder.id}).</span>
                        </div>
                      </div>
                      <a
                        href={STORE_INFO.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 self-end sm:self-center shadow-xs active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>فتح موقع الفرع بالخريطة</span>
                      </a>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Bento Grid 2: Order Details & Pickup Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Details (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Service Specs Card */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>مواصفات وتفاصيل الطلب</span>
                  </h3>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">عنوان الخدمة:</span>
                      <span className="font-bold text-slate-900">{currentOrder.serviceTitle}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">التفاصيل والخيارات:</span>
                      <span className="font-semibold text-slate-800 text-left max-w-[65%]">{currentOrder.details}</span>
                    </div>

                    {currentOrder.totalCost && (
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500">التكلفة الإجمالية:</span>
                        <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg font-mono">
                          {currentOrder.totalCost}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">تاريخ ووقت الإنشاء:</span>
                      <span className="text-slate-700 font-mono">{currentOrder.createdAt}</span>
                    </div>

                    {currentOrder.notes && (
                      <div className="pt-2">
                        <span className="text-slate-500 block mb-1">ملاحظات العميل:</span>
                        <div className="bg-slate-50 p-3 rounded-xl text-slate-700 text-xs leading-relaxed border border-slate-100">
                          {currentOrder.notes}
                        </div>
                      </div>
                    )}

                    {/* Attached files */}
                    {currentOrder.files && currentOrder.files.length > 0 && (
                      <div className="pt-3">
                        <span className="text-slate-500 block mb-2">الملفات المرفقة ({currentOrder.files.length}):</span>
                        <div className="space-y-2">
                          {currentOrder.files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="font-semibold text-slate-800 truncate" dir="ltr">{f.name}</span>
                              </div>
                              {f.size && (
                                <span className="text-slate-400 font-mono shrink-0 mr-2">
                                  {(f.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline History Card */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>سجل تحديثات ومراحل الطلب المكتملة</span>
                  </h3>

                  <div className="relative pl-2 pr-4 space-y-6 before:absolute before:right-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {currentOrder.statusUpdates.map((update, idx) => {
                      const meta = ORDER_STATUS_DETAILS[update.status];
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center shrink-0 z-10 ${
                            idx === currentOrder.statusUpdates.length - 1 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-400'
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <div className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                                {meta.label}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">{update.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed mt-1">
                              {update.note}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Actions, Pickup & WhatsApp Notifications (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* WhatsApp Notification Dispatch Card */}
                <div className="bg-white rounded-[2rem] p-6 sm:p-7 border border-slate-200 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] border border-emerald-100 flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 fill-current" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">إشعار العميل عبر الواتساب</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    إرسال رسالة واتساب منسقة ومباشرة إلى رقم العميل ({currentOrder.customerPhone}) تتضمن رابط وتفاصيل الجاهزية.
                  </p>

                  <div className="space-y-3">
                    <a
                      href={generateCustomerWhatsAppNotificationUrl(currentOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md transition active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>إرسال إشعار الواتساب للعميل</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyNotificationText(currentOrder)}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition"
                    >
                      {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedNotification ? 'تم نسخ نص الإشعار بنجاح!' : 'نسخ نص الرسالة الجاهزة'}</span>
                    </button>
                  </div>
                </div>

                {/* Pickup Location Bento Box */}
                <div className="bg-[#0F172A] text-white rounded-[2rem] p-6 sm:p-7 border border-slate-800 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-3">
                    <Building className="w-4 h-4" />
                    <span>مقر ومكان استلام الطلب</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    جمعية النعيم التعاونية - سوق القصر المركزي
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    الدور الميزانين فوق السوبرماركت مباشرة (بجانب السلم الكهربائي).
                  </p>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1.5 mb-4 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">السبت - الخميس:</span>
                      <span className="text-blue-300 font-mono">8:00 ص - 1:00 ظ | 4:00 ع - 10:30 م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">الجمعة:</span>
                      <span className="text-blue-300 font-mono">4:00 عصراً - 10:30 مساءً</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={STORE_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-xl text-xs transition active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>اتجاهات الخريطة</span>
                    </a>
                    <a
                      href={`tel:${STORE_INFO.phone}`}
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs border border-slate-700 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>اتصال</span>
                    </a>
                  </div>
                </div>

                {/* Staff / Admin Management Box (When toggled) */}
                {import.meta.env.DEV && isStaffMode && (
                  <div className="bg-amber-50/90 border-2 border-amber-300 rounded-[2rem] p-6 shadow-md">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-900 mb-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>لوحة تحكم وتحديث الحالة (خاصة بالفرع)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mb-4">
                      يمكن للموظف تغيير حالة الطلب فورياً وسيتم تشغيل التنبيه الصوتي المناسب وتوليد إشعار الواتساب التلقائي للعميل.
                    </p>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-800">
                        تغيير الحالة بنقرة واحدة:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['reviewing', 'processing', 'ready_for_pickup', 'completed'] as OrderStatus[]).map((st) => {
                          const isCurrent = currentOrder.status === st;
                          const stMeta = ORDER_STATUS_DETAILS[st];
                          return (
                            <button
                              key={st}
                              type="button"
                              disabled={isUpdatingStatus}
                              onClick={() => handleStatusChange(st)}
                              className={`p-2.5 rounded-xl text-xs font-bold border transition text-center flex items-center justify-center gap-1.5 ${
                                isCurrent
                                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500'
                                  : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100/50'
                              }`}
                            >
                              <span>{stMeta.label}</span>
                              {st === 'ready_for_pickup' && <BellRing className="w-3 h-3 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mt-3 mb-1">
                          ملاحظة توضيحية للعميل (اختياري):
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: تم تجهيز الكروت وتغليفها مع علبة هدية..."
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : (
          hasSearched && (
            <div className="bg-white rounded-[2rem] p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">لم يتم العثور على طلب بهذا الرقم</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                تأكد من كتابة رقم الطلب بشكل صحيح (مثال: ORD-7104) أو ابحث برقم هاتفك المسجل عند تقديم الطلب.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectSample('ORD-7104')}
                  className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-blue-700 transition"
                >
                  تجربة طلب تجريبي جاهز (ORD-7104)
                </button>
                <a
                  href={`https://wa.me/965${STORE_INFO.phone}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن حالة طلبي في مكتبة جمعية النعيم سوق القصر')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#20bd5a] transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>مراسلة الفرع عبر الواتساب</span>
                </a>
              </div>
            </div>
          )
        )}

        {/* Bottom CTA to Create New Requests */}
        <div className="mt-12 bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              تريد تقديم طلب جديد والحصول على كود تتبع فوري؟
            </h3>
            <p className="text-xs text-slate-500">
              يمكنك رفع ملفات الطباعة السريعة أو تقديم طلب خدمة مخصصة (تصاميم، دروع، أختام، بنرات، معاملات حكومية).
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0">
            {onNavigateToQuickPrint && (
              <button
                type="button"
                onClick={onNavigateToQuickPrint}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition active:scale-95"
              >
                طباعة ملفات سريعة
              </button>
            )}
            {onNavigateToCustomRequest && (
              <button
                type="button"
                onClick={onNavigateToCustomRequest}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition active:scale-95"
              >
                طلب خدمة وتصميم مخصص
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
