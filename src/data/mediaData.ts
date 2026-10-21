// Generated asset images
import heroInteriorImg from '../assets/images/print_center_hero_1788375262943.jpg';
import giftsAwardsImg from '../assets/images/gifts_and_trophies_1788375278744.jpg';
import digitalLaserImg from '../assets/images/digital_laser_printing_1788375291672.jpg';
import bannersStickersImg from '../assets/images/banners_and_stickers_1788375305929.jpg';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: 'printing' | 'gifts' | 'banners' | 'laser' | 'student';
  categoryLabel: string;
  src: string;
  thumbnail: string;
  description: string;
  duration?: string; // For videos
  badge?: string;
  relatedServiceId?: string;
}

export const MEDIA_ASSETS = {
  hero: heroInteriorImg,
  giftsAndTrophies: giftsAwardsImg,
  digitalLaser: digitalLaserImg,
  bannersAndStickers: bannersStickersImg
};

export const GALLERY_ITEMS: MediaItem[] = [
  // 1. Featured Videos
  {
    id: 'vid-digital-press',
    type: 'video',
    title: 'مكائن الطباعة الرقمية والإنتاج السريع',
    category: 'printing',
    categoryLabel: 'طباعة رقمية ليزر',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-laser-cutting-machine-cutting-paper-42203-large.mp4',
    thumbnail: digitalLaserImg,
    description: 'مقطع توضيحي من مصدر خارجي لعمليات تجهيز المواد؛ لا يوثق معدات أو إنتاج فرع الاماسي.',
    duration: '0:35',
    badge: 'مثال توضيحي',
    relatedServiceId: 'research-reports'
  },
  {
    id: 'vid-laser-acrylic',
    type: 'video',
    title: 'قص وحفر الليزر على الأكريليك والخشب',
    category: 'laser',
    categoryLabel: 'قص وحفر ليزر',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-laser-cutting-machine-working-on-wood-42205-large.mp4',
    thumbnail: giftsAwardsImg,
    description: 'تفصيل وقص دقيق للدروع التذكارية، لوحات المكاتب، استاندات الأكريليك، وتوزيعات المناسبات بالليزر.',
    duration: '0:42',
    badge: 'مثال توضيحي',
    relatedServiceId: 'acrylic-laser-cut'
  },
  {
    id: 'vid-craft-sublimation',
    type: 'video',
    title: 'طباعة السبلميشن الحراري على الأكواب والهدايا',
    category: 'gifts',
    categoryLabel: 'هدايا ومناسبات',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: giftsAwardsImg,
    description: 'عملية الكبس الحراري لطباعة الصور والشعارات على الأكواب السيراميك والمخدات والتيشرتات بألوان زاهية ومقاومة للغسيل.',
    duration: '0:28',
    badge: 'مثال توضيحي',
    relatedServiceId: 'mugs-tshirts'
  },

  // 2. High-res Photo Gallery
  {
    id: 'img-store-interior',
    type: 'image',
    title: 'تصور توضيحي لمساحة خدمات الطباعة',
    category: 'printing',
    categoryLabel: 'فرع المكتبة',
    src: heroInteriorImg,
    thumbnail: heroInteriorImg,
    description: 'صورة توضيحية ولا تمثل صورة موثقة للفرع الفعلي. تُراجع بيانات العنوان ضمن صفحة الاتصال.',
    badge: 'صورة توضيحية'
  },
  {
    id: 'img-digital-print-quality',
    type: 'image',
    title: 'طباعة وتجليد البحوث والمشاريع المدرسية والجامعية',
    category: 'student',
    categoryLabel: 'خدمات طلابية',
    src: digitalLaserImg,
    thumbnail: digitalLaserImg,
    description: 'أوراق فاخرة 80-300 جم، تجليد سلك معدني وحلزوني، وتغليف حراري واقٍ للشهادات والمستندات.',
    badge: 'ابتداءً من 15 فلس',
    relatedServiceId: 'research-reports'
  },
  {
    id: 'img-custom-trophies',
    type: 'image',
    title: 'دروع تكريم كريستال وخشب مع باجات وأكواب مطبوعة',
    category: 'gifts',
    categoryLabel: 'هدايا وتكريم',
    src: giftsAwardsImg,
    thumbnail: giftsAwardsImg,
    description: 'تشكيلة راقية من دروع الشكر والتقدير للمدارس والجهات الحكومية والشركات مع علب مخملية فاخرة.',
    badge: 'دروع ملكية',
    relatedServiceId: 'trophies-shields-badges'
  },
  {
    id: 'img-banner-production',
    type: 'image',
    title: 'طباعة رول أب واستاندات إعلانية واستكرات لاصقة',
    category: 'banners',
    categoryLabel: 'دعاية وإعلان',
    src: bannersStickersImg,
    thumbnail: bannersStickersImg,
    description: 'طباعة خامات قماش أصلية وقواعد ألومنيوم متينة للرول أب وبوسترات واستكرات فينيل ضد الماء والحرارة.',
    badge: 'مثال توضيحي',
    relatedServiceId: 'rollup-banners'
  }
];
