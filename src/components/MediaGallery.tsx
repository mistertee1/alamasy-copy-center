import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Sparkles, 
  Printer, 
  Video as VideoIcon, 
  Image as ImageIcon, 
  Layers, 
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
  Share2,
  FileUp,
  Tag
} from 'lucide-react';
import { GALLERY_ITEMS, MediaItem } from '../data/mediaData';
import { STORE_INFO } from '../data/servicesData';
import { ActiveTab } from '../types';

interface MediaGalleryProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onQuickPrintClick?: () => void;
  onCustomRequestClick?: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  setActiveTab,
  onQuickPrintClick,
  onCustomRequestClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const categories = [
    { id: 'all', label: 'كافة الأعمال والوسائط', count: GALLERY_ITEMS.length },
    { id: 'video', label: 'فيديوهات التشغيل الحية', count: GALLERY_ITEMS.filter(i => i.type === 'video').length },
    { id: 'printing', label: 'الطباعة والتجليد', count: GALLERY_ITEMS.filter(i => i.category === 'printing' || i.category === 'student').length },
    { id: 'gifts', label: 'الدروع والهدايا', count: GALLERY_ITEMS.filter(i => i.category === 'gifts').length },
    { id: 'banners', label: 'البنرات وقص الليزر', count: GALLERY_ITEMS.filter(i => i.category === 'banners' || i.category === 'laser').length },
  ];

  const filteredItems = GALLERY_ITEMS.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'video') return item.type === 'video';
    if (selectedCategory === 'printing') return item.category === 'printing' || item.category === 'student';
    if (selectedCategory === 'gifts') return item.category === 'gifts';
    if (selectedCategory === 'banners') return item.category === 'banners' || item.category === 'laser';
    return true;
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleOpenMedia = (item: MediaItem) => {
    setActiveMedia(item);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const handleCloseModal = () => {
    setActiveMedia(null);
  };

  const handleWhatsAppInquiry = (media: MediaItem) => {
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته، أرغب بالاستفسار عن خدمة: "${media.title}" المعروضة في معرض الوسائط والفيديوهات بموقعكم.`
    );
    window.open(`https://wa.me/965${STORE_INFO.phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-blue-950 to-indigo-950 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-4">
            <VideoIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>معرض توضيحي للخدمات والخامات</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
            جولة بصرية في <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">نماذج الطباعة والتجهيز</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            الصور والفيديوهات أمثلة توضيحية لفئات الخدمات وليست توثيقًا لمكائن أو أعمال منفذة في فرع الاماسي. تُحدد مواصفات التنفيذ عند طلب عرض السعر.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onQuickPrintClick ? onQuickPrintClick() : (setActiveTab && setActiveTab('quick-print'))}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center gap-2 active:scale-95"
            >
              <FileUp className="w-4 h-4" />
              <span>ارفع ملفك للطباعة الآن</span>
            </button>

            <button
              onClick={() => onCustomRequestClick ? onCustomRequestClick() : (setActiveTab && setActiveTab('custom-request'))}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>طلب تصميم أو درع مخصص</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isVideo = item.type === 'video';

          return (
            <div
              key={item.id}
              onClick={() => handleOpenMedia(item)}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Tag */}
                {item.badge && (
                  <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{item.badge}</span>
                  </div>
                )}

                {/* Video Play Trigger / Image Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideo ? (
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/90 group-hover:bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-all backdrop-blur-sm">
                      <Play className="w-6 h-6 fill-current translate-x-[-1px]" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-black/40 group-hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Duration / Type indicator */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  {isVideo ? (
                    <div className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/10">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span>{item.duration || 'فيديو'}</span>
                    </div>
                  ) : (
                    <div className="bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/10">
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>صورة عالية الدقة</span>
                    </div>
                  )}
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-[11px] font-medium text-slate-200 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                    {item.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-blue-600 font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                    <span>{isVideo ? 'مشاهدة الفيديو' : 'عرض الصورة وتفاصيل الخدمة'}</span>
                    <span>←</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppInquiry(item);
                    }}
                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>استفسار</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-white animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {activeMedia.title}
                </h3>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Content */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              {activeMedia.type === 'video' ? (
                <div className="relative w-full h-full group">
                  <video
                    ref={videoRef}
                    src={activeMedia.src}
                    poster={activeMedia.thumbnail}
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />

                  {/* On-screen controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-600/90 text-white font-bold px-2.5 py-1 rounded-md">
                        {activeMedia.categoryLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                      </div>

                      <span className="text-xs font-mono text-slate-300">
                        {activeMedia.duration || '0:35'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer & Description */}
            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {activeMedia.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>متوفر للتنفيذ الفوري بمقر جمعية النعيم (سوق القصر - الميزانين)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsAppInquiry(activeMedia)}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>طلب هذه الخدمة عبر الواتساب</span>
                  </button>

                  <button
                    onClick={() => {
                      handleCloseModal();
                      if (onQuickPrintClick) {
                        onQuickPrintClick();
                      } else if (setActiveTab) {
                        setActiveTab('quick-print');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة سريعة</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
