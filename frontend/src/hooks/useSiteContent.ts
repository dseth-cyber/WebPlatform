import { useState, useEffect } from 'react';

export interface FeatureBadgeSetting {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  translations?: Record<string, { title: string; subtitle: string }>;
}

export interface CategoryCardSetting {
  id: string;
  titleTh: string;
  titleEn: string;
  image: string;
  path: string;
  enabled: boolean;
  isPinned?: boolean; // 📌 ปักหมุดแสดงที่หน้าแรก
  translations?: Record<string, { title: string }>;
}

export interface MetricSetting {
  id: string;
  value: string;
  label: string;
  enabled: boolean;
}

export interface NavTabSetting {
  id: string;
  key: string;
  labelTh: string;
  labelEn: string;
  path: string;
  enabled: boolean;
}

export interface SustainabilityCardSetting {
  id: string;
  icon: string;
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  image?: string;
  isPinned?: boolean; // 📌 ปักหมุดแสดงที่หน้าแรก
  translations?: Record<string, { title: string; desc: string }>;
}

export interface TechnologyCardSetting {
  id: string;
  icon: string;
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  image?: string;
  isPinned?: boolean; // 📌 ปักหมุดแสดงที่หน้าแรก
  translations?: Record<string, { title: string; desc: string }>;
}

export interface ServiceItemSetting {
  id: string;
  icon: string;
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  features: string[];
  image?: string;
  isPinned?: boolean; // 📌 ปักหมุดแสดงที่หน้าแรก
  translations?: Record<string, { title: string; desc: string }>;
}

export interface CareerJobSetting {
  id: string;
  titleTh: string;
  titleEn: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  active: boolean;
  isPinned?: boolean; // 📌 ปักหมุดแสดงที่หน้าแรก
  translations?: Record<string, { title: string; department?: string; location?: string; description?: string }>;
}

export interface BranchLocationSetting {
  id: string;
  nameTh: string;
  nameEn: string;
  type: 'headquarters' | 'factory' | 'warehouse' | 'branch';
  addressTh: string;
  addressEn: string;
  phone: string;
  fax?: string;
  email?: string;
  businessHoursTh?: string;
  businessHoursEn?: string;
  mapUrl?: string;
  isPrimary?: boolean;
  enabled: boolean;
  translations?: Record<string, { name: string; address: string; businessHours?: string }>;
}

export interface SiteContentSettings {
  // Brand & Public Header Controls
  logoImage: string;            // Custom uploaded logo image URL (saved to DB)
  logoText: string;             // Text badge logo (e.g., LC)
  companyNameTh: string;
  companyNameEn: string;
  logoIcon: string;
  showCMSButton: boolean;       // Control from Admin: Show/Hide CMS button on public web
  showThemeSwitcher: boolean;   // Control from Admin: Show/Hide Theme switcher on public web
  dashboardDataSource?: 'mock' | 'real'; // Toggle between Mockup Demo Data and Real System Data on Admin Dashboard

  // Header Nav Tabs Manager (Show/Hide any tab)
  navTabs: NavTabSetting[];

  // Hero Section
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  showHeroPrimaryBtn?: boolean; // ซ่อน/แสดง ปุ่ม "อ่านประวัติองค์กร"
  heroSecondaryButtonText?: string;
  heroSecondaryButtonLink?: string;
  showHeroSecondaryBtn?: boolean; // ซ่อน/แสดง ปุ่ม "ชมผลิตภัณฑ์ของเรา"
  heroBannerImage: string;
  heroImages?: string[]; // 🖼️ สไลด์ภาพพื้นหลังหน้าแรก (สูงสุด 5 ภาพ)
  heroAutoSlide?: boolean; // เปิด/ปิด เลื่อนสไลด์อัตโนมัติ
  heroSlideInterval?: number; // ระยะเวลาสไลด์อัตโนมัติ (วินาที)
  heroShowArrows?: boolean; // แสดงปุ่มเลื่อนซ้าย/ขวา เมื่อชี้เมาส์
  heroShowDots?: boolean; // แสดงจุดบอกตำแหน่งสไลด์
  heroTextOverlayOpacity?: number; // ระดับความฟุ้ง/เงาดำหลังตัวหนังสือ (0, 10, 20, 30, 40, 50, 60, 70%)

  // 5-Language Multi-Language CMS Content (EN, JP, CN, MM)
  heroTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { title: string; subtitle: string; desc: string }>;
  aboutTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { heading: string; subheading: string; story1: string; mission: string }>;
  servicesTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { badge: string; heading: string; description: string }>;
  technologyTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { badge: string; heading: string; description: string }>;
  sustainabilityTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { badge: string; heading: string; description: string }>;
  careersTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { badge: string; heading: string; subtitle: string }>;
  contactTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', { bio: string; businessHours: string }>;
  brandLegalTranslations?: Record<string, {
    companyName?: string;
    legalName?: string;
    registeredCapital?: string;
    taxId?: string;
    establishedYear?: string;
    factoryAddress?: string;
    headquartersAddress?: string;
    industryCertifications?: string;
    [key: string]: string | undefined;
  }>;

  // 4 Feature Badges
  featureBadges: FeatureBadgeSetting[];

  // 5 Category Cards
  categoryCards: CategoryCardSetting[];

  // About Section
  aboutHeading: string;
  aboutSubheading: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutMission: string;
  aboutFactoryImage: string;
  metrics: MetricSetting[];

  // Sustainability CMS Section
  sustainabilityBadge: string;
  sustainabilityHeading: string;
  sustainabilityDescription: string;
  sustainabilityCards: SustainabilityCardSetting[];

  // Technology CMS Section
  technologyBadge: string;
  technologyHeading: string;
  technologyDescription: string;
  technologyCards: TechnologyCardSetting[];

  // Services CMS Section
  servicesBadge: string;
  servicesHeading: string;
  servicesDescription: string;
  servicesList: ServiceItemSetting[];

  // Careers CMS Section
  careersBadge: string;
  careersHeading: string;
  careersSubtitle: string;
  careersBenefits: string[];
  careersBenefitsTranslations?: Record<'en' | 'jp' | 'cn' | 'mm', string[]>;
  careersJobs: CareerJobSetting[];

  // Contact Info & Footer (No hardcoding - 100% editable from Admin)
  factoryAddress: string;
  phoneNumber: string;
  email: string;
  taxId: string;
  registeredCapital: string;
  establishedYear: string;
  businessHours: string;
  footerBio: string;
  certificationsText: string;
  complianceText: string;
  branches?: BranchLocationSetting[]; // ระบบจัดการสาขาและสถานที่ตั้งโรงงาน
}

export const DEFAULT_SITE_SETTINGS: SiteContentSettings = {
  logoImage: '',                // Default empty uses sleek LC Diamond
  logoText: 'LC',
  companyNameTh: 'บริษัท ไคโอทรอน เทคโนโลยี จำกัด',
  companyNameEn: 'CHIOTRON TECHNOLOGY CO., LTD.',
  logoIcon: 'LC',
  showCMSButton: true,
  showThemeSwitcher: true,
  dashboardDataSource: 'mock',

  navTabs: [
    { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
    { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
    { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
    { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
    { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
    { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
    { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
    { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
    { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
  ],

  heroTitle: 'ไคโอทรอน เทคโนโลยี',
  heroHighlight: 'วิศวกรรมแห่งอนาคต',
  heroSubtitle:
    'ผู้นำบรรจุภัณฑ์โลหะทางด้านอาหารสำเร็จรูปในประเทศไทย ด้วยเทคโนโลยีที่ทันสมัย คุณภาพมาตรฐานสากล และบริการที่เป็นเลิศ เพื่อตอบสนองความพึงพอใจของลูกค้า และความยั่งยืนของอุตสาหกรรม',
  heroButtonText: 'อ่านประวัติองค์กร',
  heroButtonLink: '/about',
  showHeroPrimaryBtn: true,
  heroSecondaryButtonText: 'ชมผลิตภัณฑ์ของเรา',
  heroSecondaryButtonLink: '/products',
  showHeroSecondaryBtn: true,
  heroBannerImage: '/images/hero-fullwidth.jpg',
  heroImages: [
    '/images/hero-fullwidth.jpg',
    '/images/hero-cans-banner.jpg',
    '/images/factory-building.jpg',
  ],
  heroAutoSlide: true,
  heroSlideInterval: 5,
  heroShowArrows: true,
  heroShowDots: true,
  heroTextOverlayOpacity: 30,

  heroTranslations: {
    en: {
      title: 'CHIOTRON TECHNOLOGY',
      subtitle: 'World-Class Metal Packaging & Automation',
      desc: "Thailand's leading manufacturer of metal packaging for ready-to-eat food with advanced technology, international quality standards, and exceptional customer service.",
    },
    jp: {
      title: 'カイオトロン・テクノロジー',
      subtitle: '世界水準の金属包装ソリューション',
      desc: 'タイを代表する即席食品用金属包装メーカー。先進技術と国際品質基準、卓越したサービスで産業の持続可能性を支えます。',
    },
    cn: {
      title: '凯奥创科技有限公司',
      subtitle: '世界级高品质金属包装',
      desc: '泰国领先的即食食品金属包装制造商，凭借先进技术、国际标准品质和卓越服务，满足客户需求并促进工业可持续发展。',
    },
    mm: {
      title: 'CHIOTRON TECHNOLOGY ကုမ္ပဏီလီမိတက်',
      subtitle: 'ကမ္ဘာ့အဆင့်မီ သတ္တုထုပ်ပိုးပစ္စည်းများ',
      desc: 'အဆင့်မြင့်နည်းပညာ၊ နိုင်ငံတကာအဆင့်မီ အရည်အသွေးနှင့် ထူးချွန်သောဝန်ဆောင်မှုများဖြင့် ထိုင်းနိုင်ငံ၏ ဦးဆောင်စားသောက်ကုန် သတ္တုဘူးထုပ်ပိုးထုတ်လုပ်သူ။',
    },
  },

  aboutTranslations: {
    en: {
      heading: 'About Us',
      subheading: 'Global Standard Food-Grade Metal Packaging Specialist',
      story1: 'With over 38 years of manufacturing excellence, Chiotron Technology delivers high-purity, BPA-free metal cans and closures to global markets.',
      mission: 'Delivering 100% recyclable, high-purity metal packaging.\nIntegrating world-class Swiss automated canning technology.\nEmpowering customers with sustainable ESG packaging solutions.',
    },
    jp: {
      heading: '会社概要',
      subheading: '世界水準の食品グレード金属パッケージング専門企業',
      story1: '38年以上の製造実績と技術革新に基づき、安全で高品質なBPAフリー金属缶およびキャップを世界各国の食品メーカーへ供給しています。',
      mission: '100%リサイクル可能な高純度金属包装の供給\nスイス製高速精密製缶設備の導入による品質向上\n持続可能なESGパッケージングソリューションの提案',
    },
    cn: {
      heading: '关于我们',
      subheading: '全球标准食品级金属包装专业制造企业',
      story1: '拥有超过38年的卓越制造经验，凯奥创科技为全球市场提供高纯度、100%无BPA的金属罐及密封盖。',
      mission: '供应100%可循环再生的环保金属包装\n引进世界先进的瑞士高速精密制罐生产线\n以可持续ESG包装方案赋能全球客户',
    },
    mm: {
      heading: 'ကျွန်ုပ်တို့အကြောင်း',
      subheading: 'နိုင်ငံတကာအဆင့်မီ စားသောက်ကုန်သတ္တုထုပ်ပိုးမှုဆိုင်ရာ ကျွမ်းကျင်သူ',
      story1: 'ထုတ်လုပ်မှုလုပ်ငန်း အတွေ့အကြုံ ၃၈ နှစ်ကျော်ဖြင့် ကမ္ဘာ့အဆင့်မီ အရည်အသွေးမြင့် BPA-free သံဗူးနှင့် အဖုံးများကို တင်ပို့ရောင်းချလျက်ရှိပါသည်။',
      mission: '၁၀၀% ပြန်လည်အသုံးပြုနိုင်သော သတ္တုထုပ်ပိုးမှုများ ထုတ်လုပ်ခြင်း\nအဆင့်မြင့် ဆွစ်ဇာလန်နည်းပညာသုံး စက်ကိရိယာများ တပ်ဆင်ခြင်း\nရေရှည်တည်တံ့သော ESG ထုပ်ပိုးမှုဆိုင်ရာ ဖြေရှင်းချက်များ ပေးအပ်ခြင်း',
    },
  },

  servicesTranslations: {
    en: {
      badge: 'Manufacturing Services',
      heading: 'Comprehensive Metal Packaging & Printing Services',
      description: 'From high-precision tooling design and ultra-HD UV offset printing to automated high-speed can forming using Swiss technologies.',
    },
    jp: {
      badge: 'OEM製造サービス',
      heading: '金属パッケージングおよび高精細印刷の一貫受託サービス',
      description: '金型設計・高精細オフセット印刷からスイス製自動製缶ラインによる高速成形まで、一貫したOEMソリューションを提供します。',
    },
    cn: {
      badge: 'OEM定制加工',
      heading: '全方位高品质金属包装与精细印花综合服务',
      description: '涵盖精密模具设计、超高清UV胶印印花至瑞士全自动高速制罐成型的一体化制造服务。',
    },
    mm: {
      badge: 'OEM ဝန်ဆောင်မှုများ',
      heading: 'ပြည့်စုံသော သတ္တုထုပ်ပိုးပစ္စည်း ထုတ်လုပ်မှုနှင့် ပုံနှိပ်ဝန်ဆောင်မှုများ',
      description: 'ဒီဇိုင်းပုံစံထုတ်လုပ်ခြင်း၊ အရည်အသွေးမြင့် ပုံနှိပ်ခြင်းမှ ဆွစ်ဇာလန်နည်းပညာသုံး အလိုအလျောက် သံဗူးထုတ်လုပ်ခြင်းအထိ ဝန်ဆောင်မှုပေးပါသည်။',
    },
  },

  technologyTranslations: {
    en: {
      badge: 'Manufacturing Automation',
      heading: 'High-Speed Metal Canning & Smart AI Inspection',
      description: 'Elevating production lines with cutting-edge global machinery for micron-level precision and uncompromising food safety standards.',
    },
    jp: {
      badge: '製造技術',
      heading: '高速金属製缶ラインとAIスマート検査システム',
      description: 'ミクロン単位の精度と最高水準の食品安全性を実現する、世界最先端の高速自動化機械とAI画像検査技術。',
    },
    cn: {
      badge: '制造技术',
      heading: '高速金属制罐与AI智能全检系统',
      description: '引进世界领先的精密设备，以微米级精度和严苛安全标准赋能现代化生产线。',
    },
    mm: {
      badge: 'နည်းပညာ',
      heading: 'အမြန်နှုန်းမြင့် သတ္တုဗူးထုတ်လုပ်မှုနှင့် AI စစ်ဆေးရေးစနစ်',
      description: 'အမြင့်မားဆုံးတိကျမှုနှင့် စားသောက်ကုန်ဘေးကင်းရေးအတွက် ကမ္ဘာ့အဆင့်မီ စက်ယန္တရားများနှင့် နည်းပညာများဖြင့် ထုတ်လုပ်ပါသည်။',
    },
  },

  sustainabilityTranslations: {
    en: {
      badge: 'Circular Economy & ESG',
      heading: 'Metal... The Forever Recyclable Sustainable Material',
      description: 'Pioneering green manufacturing with 100% circular metal packaging, solar rooftop generation, and carbon footprint reduction.',
    },
    jp: {
      badge: 'サステナビリティ',
      heading: '金属 — 無限にリサイクル可能な循環型環境素材',
      description: '100%リサイクル可能な金属パッケージング、屋上太陽光発電、省エネ設計によるカーボンフットプリント削減を推進。',
    },
    cn: {
      badge: '可持续发展',
      heading: '金属... 100%无限次循环再生的绿色环保材料',
      description: '践行绿色低碳制造，采用100%循环金属包装材料与屋顶光伏清洁能源，降低碳足迹。',
    },
    mm: {
      badge: 'ရေရှည်တည်တံ့မှု',
      heading: 'သတ္တု... အကြိမ်ကြိမ်ပြန်လည်အသုံးပြုနိုင်သော ရေရှည်တည်တံ့သည့်ပစ္စည်း',
      description: '၁၀၀% ပြန်လည်အသုံးပြုနိုင်သော သတ္တုထုပ်ပိုးပစ္စည်းများနှင့် နေရောင်ခြည်စွမ်းအင်သုံး လျှပ်စစ်ဓာတ်အားဖြင့် သဘာဝပတ်ဝန်းကျင်ကို ထိန်းသိမ်းပါသည်။',
    },
  },

  careersTranslations: {
    en: {
      badge: 'Careers & Opportunities',
      heading: 'Drive the Future of Sustainable Metal Packaging',
      subtitle: 'Join an innovative engineering team committed to world-class manufacturing standards and sustainable growth.',
    },
    jp: {
      badge: '採用情報',
      heading: '持続可能な金属パッケージング産業の未来を拓く',
      subtitle: '世界水準の品質と技術革新を追求するエンジニアリングチームであなたの才能を発揮してください。',
    },
    cn: {
      badge: '招贤纳士',
      heading: '携手共创绿色可持续金属包装的未来',
      subtitle: '加入致力于世界级制造标准与绿色创新的优秀团队，共同开拓行业新格局。',
    },
    mm: {
      badge: 'အလုပ်အကိုင် အခွင့်အလမ်းများ',
      heading: 'ရေရှည်တည်တံ့သော သတ္တုထုပ်ပိုးမှုလုပ်ငန်း အနာဂတ်တွင် ပါဝင်ပါ',
      subtitle: 'ကမ္ဘာ့အဆင့်မီ ထုတ်လုပ်မှုစံချိန်စံညွှန်းများနှင့်အတူ လက်တွဲဆောင်ရွက်ရန် ဖိတ်ခေါ်အပ်ပါသည်။',
    },
  },

  contactTranslations: {
    en: {
      bio: 'Chiotron Technology is a premier manufacturer of food-grade tinplate and aluminum packaging solutions based in Samut Sakhon, Thailand.',
      businessHours: 'Monday - Saturday: 08:00 - 17:00 (ICT)',
    },
    jp: {
      bio: 'カイオトロン・テクノロジーは、タイ・サムットサコーン県に拠点を置く、食品グレードの高品質ブリキ・アルミ缶パッケージングの総合メーカーです。',
      businessHours: '月曜日 - 土曜日: 08:00 - 17:00 (タイ時間)',
    },
    cn: {
      bio: '凯奥创科技是泰国龙仔厝府领先的高端食品级马口铁及铝制金属包装综合制造商。',
      businessHours: '周一至周六: 08:00 - 17:00 (泰国时间)',
    },
    mm: {
      bio: 'CHIOTRON TECHNOLOGY သည် ထိုင်းနိုင်ငံ၊ စမွတ်စာခွန်ပြည်နယ်အခြေစိုက် အရည်အသွေးမြင့် စားသောက်ကုန်သတ္တုဘူးထုပ်ပိုးထုတ်လုပ်သည့် ဦးဆောင်ကုမ္ပဏီဖြစ်ပါသည်။',
      businessHours: 'တနင်္လာ - စနေ: ၀၈:၀၀ - ၁၇:၀၀ (ထိုင်းစံတော်ချိန်)',
    },
  },

  brandLegalTranslations: {
    en: {
      companyName: 'CHIOTRON TECHNOLOGY CO., LTD.',
      registeredCapital: '100,000,000 THB',
      taxId: '0745548001234',
      establishedYear: '1986',
      factoryAddress: '88 Moo 3, Setthakit 1 Rd, Khlong Maduea, Krathum Baen, Samut Sakhon 74110, Thailand',
    },
    jp: {
      companyName: 'カイオトロン・テクノロジー株式会社',
      registeredCapital: '1億タイバーツ (100,000,000 THB)',
      taxId: '0745548001234',
      establishedYear: '1986年',
      factoryAddress: 'タイ国サムットサコーン県クラトゥムベーン郡クロンマドゥア区 セータキット1通り 88番地',
    },
    cn: {
      companyName: '凯奥创科技有限公司',
      registeredCapital: '1亿泰铢 (100,000,000 THB)',
      taxId: '0745548001234',
      establishedYear: '1986年',
      factoryAddress: '泰国龙仔厝府甲吞烹县空玛得区经济1路88号 邮编74110',
    },
    mm: {
      companyName: 'CHIOTRON TECHNOLOGY ကုမ္ပဏီလီမိတက်',
      registeredCapital: 'ဘတ်ငွေ ၁၀၀,၀၀၀,၀၀၀',
      taxId: '0745548001234',
      establishedYear: '၁၉၈၆',
      factoryAddress: 'အမှတ် ၈၈၊ မူ ၃၊ စစ်သကစ် ၁ လမ်း၊ စမွတ်စာခွန် ၇၄၁၁၀၊ ထိုင်းနိုင်ငံ',
    },
  },

  featureBadges: [
    {
      id: 'f1',
      title: 'คุณภาพมาตรฐานสากล',
      subtitle: 'ได้รับการรับรองมาตรฐานระดับสากล',
      enabled: true,
      translations: {
        en: { title: 'World-Class Quality', subtitle: 'Certified to international quality standards' },
        jp: { title: '国際基準の品質', subtitle: '世界基準の国際認証を取得' },
        cn: { title: '国际标准品质', subtitle: '通过多项国际权威认证' },
        mm: { title: 'နိုင်ငံတကာစံချိန်မီအရည်အသွေး', subtitle: 'နိုင်ငံတကာစံချိန်စံညွှန်းများဖြင့် အသိအမှတ်ပြုထားသည်' },
      },
    },
    {
      id: 'f2',
      title: 'เทคโนโลยีทันสมัย',
      subtitle: 'เครื่องจักรและเทคโนโลยีการผลิตที่ล้ำสมัย',
      enabled: true,
      translations: {
        en: { title: 'Modern Technology', subtitle: 'Cutting-edge machinery and manufacturing technologies' },
        jp: { title: '先進テクノロジー', subtitle: '最先端の機械と製造テクノロジーを導入' },
        cn: { title: '先进制造工艺', subtitle: '尖端智能机械与高精尖生产技术' },
        mm: { title: 'ခေတ်မီနည်းပညာ', subtitle: 'ခေတ်မီစက်ယန္တရားများနှင့် ထုတ်လုပ်မှုနည်းပညာများ' },
      },
    },
    {
      id: 'f3',
      title: 'ความปลอดภัย',
      subtitle: 'ควบคุมคุณภาพทุกขั้นตอนเพื่อความปลอดภัยสูงสุด',
      enabled: true,
      translations: {
        en: { title: 'Certified Safety', subtitle: 'Total quality control for uncompromising safety' },
        jp: { title: '安全性の追求', subtitle: '最高水準の安全を確保する全工程品質管理' },
        cn: { title: '安全与可靠', subtitle: '全流程严苛质量监控确保极致安全' },
        mm: { title: 'ဘေးကင်းလုံခြုံရေး', subtitle: 'အမြင့်မားဆုံး ဘေးကင်းရေးအတွက် အဆင့်ဆင့်စစ်ဆေးသည်' },
      },
    },
    {
      id: 'f4',
      title: 'บริการลูกค้า',
      subtitle: 'ใส่ใจทุกความต้องการด้วยหัวใจบริการ',
      enabled: true,
      translations: {
        en: { title: 'Customer Care', subtitle: 'Attentive service focused on your exact packaging needs' },
        jp: { title: '顧客第一のサービス', subtitle: 'お客様のあらゆるニーズに真心を込めて対応' },
        cn: { title: '用心客户服务', subtitle: '真诚专注满足客户的每一个定制需求' },
        mm: { title: 'ဖောက်သည်ဝန်ဆောင်မှု', subtitle: 'ဖောက်သည်များ၏ လိုအပ်ချက်တိုင်းကို စေတနာဖြင့် ဝန်ဆောင်မှုပေးသည်' },
      },
    },
  ],

  categoryCards: [
    {
      id: 'round-cans',
      titleTh: 'กระป๋องกลม',
      titleEn: 'ROUND CANS',
      image: '/images/cat-round-cans.jpg',
      path: '/products?category=round-cans',
      enabled: true,
      translations: {
        en: { title: 'Round Cans' },
        jp: { title: '丸缶' },
        cn: { title: '圆罐' },
        mm: { title: 'အဝိုင်းပုံ သံဗူး' },
      },
    },
    {
      id: 'rect-cans',
      titleTh: 'กระป๋องเหลี่ยม',
      titleEn: 'RECTANGULAR CANS',
      image: '/images/cat-rect-cans.jpg',
      path: '/products?category=rect-cans',
      enabled: true,
      translations: {
        en: { title: 'Rectangular Cans' },
        jp: { title: '角缶' },
        cn: { title: '方罐' },
        mm: { title: 'လေးထောင့် သံဗူး' },
      },
    },
    {
      id: 'can-lids',
      titleTh: 'ฝาปิดกระป๋อง',
      titleEn: 'CAN LIDS',
      image: '/images/cat-can-lids.jpg',
      path: '/products?category=can-lids',
      enabled: true,
      translations: {
        en: { title: 'Can Lids & Closures' },
        jp: { title: '缶蓋・キャップ' },
        cn: { title: '密封盖' },
        mm: { title: 'သံဗူးအဖုံးများ' },
      },
    },
    {
      id: 'can-ends',
      titleTh: 'ก้นกระป๋อง',
      titleEn: 'CAN ENDS',
      image: '/images/cat-can-ends.jpg',
      path: '/products?category=can-ends',
      enabled: true,
      translations: {
        en: { title: 'Can Ends' },
        jp: { title: '缶底' },
        cn: { title: '罐底' },
        mm: { title: 'သံဗူးအောက်ခြေ' },
      },
    },
    {
      id: 'printed-cans',
      titleTh: 'กระป๋องพิมพ์ลาย',
      titleEn: 'PRINTED CANS',
      image: '/images/cat-printed-cans.jpg',
      path: '/products?category=printed-cans',
      enabled: true,
      translations: {
        en: { title: 'Printed & Decorated Cans' },
        jp: { title: '印刷缶' },
        cn: { title: '印花金属罐' },
        mm: { title: 'ဒီဇိုင်းပုံနှိပ် သံဗူးများ' },
      },
    },
  ],

  aboutHeading: 'เกี่ยวกับเรา',
  aboutSubheading: 'ผู้เชี่ยวชาญการผลิตบรรจุภัณฑ์โลหะเกรดอาหารมาตรฐานสากล',
  aboutStory1:
    'บริษัท ไคโอทรอน เทคโนโลยี จำกัด (คศ 1986) เป็นผู้นำบรรจุภัณฑ์โลหะทางด้านอาหารสำเร็จรูปในประเทศไทย เราอาศัยปัจจัยสำคัญ อาทิ การใช้เทคโนโลยีที่ทันสมัย และมีคุณภาพในการผลิต การควบคุมคุณภาพในทุกรายละเอียดของสินค้า และเน้นถึงหัวใจของการให้บริการลูกค้า ทั้งนี้เพื่อให้สินค้า และบริการของบริษัทฯ เป็นที่น่าเชื่อถือและสนองตอบต่อความต้องการของลูกค้าและตลาดบรรจุภัณฑ์โลหะทั้งในประเทศและทั่วโลก',
  aboutStory2:
    'เรามุ่งมั่นที่จะผลิตสินค้าที่มีคุณภาพโดยเน้นถึงความปลอดภัย, ความเป็นมาตรฐานสากล, ความคิดริเริ่มสร้างสรรค์, ความมีเอกลักษณ์เฉพาะตัวเพื่อตอบสนองความพึงพอใจของลูกค้า ตลอดจนความยั่งยืนของอุตสาหกรรมเป็นสำคัญ',
  aboutMission:
    'ส่งมอบผลิตภัณฑ์บรรจุภัณฑ์โลหะที่มีคุณภาพและความบริสุทธิ์สูง ปลอดสาร BPA 100%\nนำเข้าเทคโนโลยีเครื่องจักรผลิตความเร็วสูงเพื่อเพิ่มประสิทธิภาพและความแม่นยำ',
  aboutFactoryImage: '/images/factory-building.jpg',

  metrics: [
    { id: 'm1', value: '38+', label: 'ประสบการณ์ปี', enabled: true },
    { id: 'm2', value: '50+', label: 'ประเทศที่ส่งออก', enabled: true },
    { id: 'm3', value: '1000+', label: 'ลูกค้าทั่วโลก', enabled: true },
    { id: 'm4', value: '50,000+', label: 'ตันต่อปี กำลังการผลิต', enabled: true },
  ],

  // Sustainability CMS Section
  sustainabilityBadge: 'Circular Economy & ESG',
  sustainabilityHeading: 'โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ',
  sustainabilityDescription:
    'แผ่นเหล็กเคลือบดีบุกและอลูมิเนียมเป็นหนึ่งในวัสดุบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อมมากที่สุดในโลก สามารถนำกลับมาหลอมใช้ใหม่ได้ 100% โดยไม่สูญเสียคุณสมบัติเชิงกล',
  sustainabilityCards: [
    {
      id: 'sus-1',
      icon: 'Recycle',
      titleTh: 'Infinitely Recyclable',
      titleEn: 'Infinitely Recyclable',
      descTh: 'โลหะสามารถรีไซเคิลวนซ้ำได้อย่างไม่จำกัด ช่วยลดการปล่อยคาร์บอนไดออกไซด์ได้ถึง 75% เมื่อเทียบกับการผลิตโลหะใหม่จากแร่',
      descEn: 'Metal can be recycled endlessly without quality degradation, saving up to 75% CO2 compared to virgin ore extraction.',
      image: '/images/hero-fullwidth.jpg',
      translations: {
        en: { title: 'Infinitely Recyclable', desc: 'Metal can be recycled endlessly without quality degradation, saving up to 75% CO2 compared to virgin ore extraction.' },
        jp: { title: '無限リサイクル性', desc: '金属は品質を損なうことなく何度でも無限にリサイクル可能。バージン鉱石からの精錬と比較してCO2を最大75%削減します。' },
        cn: { title: '无限次循环再生', desc: '金属材料可100%无限次回收重熔而不降级，与原矿冶炼相比可减少高达75%的碳排放。' },
        mm: { title: 'အကြိမ်ကြိမ် ပြန်လည်အသုံးပြုနိုင်ခြင်း', desc: 'သတ္တုသည် အရည်အသွေးမကျဘဲ အကြိမ်ကြိမ် ပြန်လည်အသုံးပြုနိုင်ပြီး ကာဗွန်ဒိုင်အောက်ဆိုဒ် ထုတ်လွှတ်မှုကို ၇၅% ထိ လျှော့ချပေးပါသည်။' },
      },
    },
    {
      id: 'sus-2',
      icon: 'Sun',
      titleTh: 'Solar Rooftop 1.2 MW',
      titleEn: 'Solar Rooftop 1.2 MW',
      descTh: 'โรงงานสมุทรสาครใช้พลังงานไฟฟ้าจากแสงอาทิตย์บนหลังคาโรงงาน ช่วยลดก๊าซเรือนกระจกกว่า 1,200 ตันคาร์บอนต่อปี',
      descEn: 'Our plant operates with clean solar rooftop energy, mitigating over 1,200 metric tons of carbon annually.',
      image: '/images/factory-building.jpg',
      translations: {
        en: { title: 'Solar Rooftop 1.2 MW', desc: 'Our plant operates with clean solar rooftop energy, mitigating over 1,200 metric tons of carbon annually.' },
        jp: { title: '屋上太陽光発電 1.2 MW', desc: 'サムットサコーン工場では1.2MWの屋上太陽光発電システムを導入し、年間1,200トン以上のCO2削減に貢献しています。' },
        cn: { title: '1.2兆瓦屋顶光伏清洁能源', desc: '龙仔厝工厂配备1.2 MW屋顶光伏发电系统，每年减少温室气体排放超过1,200吨。' },
        mm: { title: '၁.၂ မဂ္ဂါဝပ် ဆိုလာခေါင်မိုး', desc: 'စက်ရုံခေါင်မိုးပေါ်တွင် ၁.၂ မဂ္ဂါဝပ် နေရောင်ခြည်စွမ်းအင်သုံး လျှပ်စစ်ထုတ်လုပ်ပြီး တစ်နှစ်လျှင် ကာဗွန် ၁,၂၀၀ တန် လျှော့ချပေးပါသည်။' },
      },
    },
    {
      id: 'sus-3',
      icon: 'Droplets',
      titleTh: 'Zero Industrial Wastewater',
      titleEn: 'Zero Industrial Wastewater',
      descTh: 'ระบบบำบัดและหมุนเวียนน้ำในกระบวนการหล่อเย็นแบบปิด 100% ไม่มีการปล่อยน้ำเสียสู่แหล่งน้ำสาธารณะ',
      descEn: 'Closed-loop cooling and water reclamation facility ensures zero hazardous industrial wastewater discharge.',
      image: '/images/cat-round-cans.jpg',
      translations: {
        en: { title: 'Zero Industrial Wastewater', desc: 'Closed-loop cooling and water reclamation facility ensures zero hazardous industrial wastewater discharge.' },
        jp: { title: '工業排水ゼロシステム', desc: '完全密閉型の冷却水循環・高度浄化システムにより、公共水域への産業排水ゼロを実現しています。' },
        cn: { title: '工业废水零排放', desc: '全封闭式冷却水循环与深度中水回用系统，实现生产废水100%内循环与零外部排放。' },
        mm: { title: 'စက်မှုစွန့်ပစ်ရေ သုည ရေဆိုးစနစ်', desc: 'အအေးခံစနစ်တွင် ရေကို ၁၀၀% ပြန်လည်အသုံးပြုပြီး အများပြည်သူပိုင် ရေထွက်ပေါက်များသို့ ရေဆိုးစွန့်ထုတ်ခြင်း လုံးဝမရှိပါ။' },
      },
    },
  ],

  // Technology CMS Section
  technologyBadge: 'Manufacturing Automation',
  technologyHeading: 'เทคโนโลยีการผลิตกระป๋องโลหะความเร็วสูงและ AI อัจฉริยะ',
  technologyDescription:
    'ยกระดับสายการผลิตด้วยเครื่องจักรทันสมัยระดับโลกเพื่อความแม่นยำระดับไมครอนและมาตรฐานความปลอดภัยสูงสุด',
  technologyCards: [
    {
      id: 'tech-1',
      icon: 'Cpu',
      titleTh: 'Soudronic High-Speed Canbody Welder (สวิตเซอร์แลนด์)',
      titleEn: 'Soudronic High-Speed Canbody Welder (Switzerland)',
      descTh: 'เครื่องเชื่อมตะเข็บไฟฟ้าอัตโนมัติความเร็วสูง 600 กระป๋องต่อนาที พร้อมระบบควบคุมความร้อนสม่ำเสมอ รอยเชื่อมเรียบเนียน ป้องกันการรั่วซึม 100%',
      descEn: 'High-speed 600 cpm automatic electronic seam welder with adaptive heat control, delivering leak-proof hermetic integrity.',
      image: '/images/factory-building.jpg',
      translations: {
        en: { title: 'Soudronic High-Speed Canbody Welder (Switzerland)', desc: 'High-speed 600 cpm automatic electronic seam welder with adaptive heat control, delivering leak-proof hermetic integrity.' },
        jp: { title: 'スイス・ソウロニック社製 超高速シーム溶接機', desc: '毎分600缶の高速自動溶接と高精度熱制御システムにより、極めて均一で堅牢な気密シールを実現。' },
        cn: { title: '瑞士Soudronic高速全自动罐身焊机', desc: '每分钟高达600罐的电子全自动缝焊，配备自适应温控，焊缝极致平整且100%防漏。' },
        mm: { title: 'Soudronic အမြန်နှုန်းမြင့် သံဗူးဂဟေဆက်စက် (ဆွစ်ဇာလန်)', desc: 'တစ်မိနစ်လျှင် ဘူးပေါင်း ၆၀၀ အလိုအလျောက် ဂဟေဆက်နိုင်ပြီး ယိုစိမ့်မှု လုံးဝမရှိစေရန် အပူချိန်ထိန်းစနစ် ပါဝင်ပါသည်။' },
      },
    },
    {
      id: 'tech-2',
      icon: 'Eye',
      titleTh: 'AI Visual Camera Seam & Defect Inspection System',
      titleEn: 'AI Visual Camera Seam & Defect Inspection System',
      descTh: 'ระบบกล้องตรวจจับข้อบกพร่องด้วยปัญญาประดิษฐ์ (AI) ตรวจสอบความสมบูรณ์ของแล็กเกอร์และมิติฝา EOE ทุกชิ้นแบบ Real-time',
      descEn: 'Real-time AI computer vision defect scanner verifying lacquer continuity, double seam dimensions, and easy-open end integrity.',
      image: '/images/cat-printed-cans.jpg',
      translations: {
        en: { title: 'AI Visual Camera Seam & Defect Inspection System', desc: 'Real-time AI computer vision defect scanner verifying lacquer continuity, double seam dimensions, and easy-open end integrity.' },
        jp: { title: 'AIスマート画像外観・二重巻締検査システム', desc: 'AI画像認識カメラがラッカー塗布状態、ダブルシーム寸法、イージーオープン蓋の完全性をリアルタイム全数検査。' },
        cn: { title: 'AI智能视觉卷封与微缺陷在线全检系统', desc: '搭载AI机器视觉，实时在线全检内部涂料连续性、双重卷封尺寸及易拉盖完整性。' },
        mm: { title: 'AI ကင်မရာသုံး အပြစ်အနာအဆာ စစ်ဆေးရေးစနစ်', desc: 'AI နည်းပညာဖြင့် သံဗူးအဖုံးနှင့် အတွင်းပိုင်းအလွှာများကို အချိန်နှင့်တပြေးညီ အပြစ်အနာအဆာ မရှိစေရန် စစ်ဆေးပေးပါသည်။' },
      },
    },
    {
      id: 'tech-3',
      icon: 'Gauge',
      titleTh: 'Automatic Nitrogen Flanging & Beading Lines',
      titleEn: 'Automatic Nitrogen Flanging & Beading Lines',
      descTh: 'เครื่องปั๊มลอนและบานปากกระป๋องความแม่นยำสูง เพิ่มความแข็งแรงต่อแรงดันสุญญากาศขณะผ่านกระบวนการฆ่าเชื้อ (Autoclave Retort)',
      descEn: 'High-precision flanging and body beading machinery engineered to withstand intense vacuum and autoclave retort sterilization.',
      image: '/images/cat-round-cans.jpg',
      translations: {
        en: { title: 'Automatic Nitrogen Flanging & Beading Lines', desc: 'High-precision flanging and body beading machinery engineered to withstand intense vacuum and autoclave retort sterilization.' },
        jp: { title: '高精度フランジング＆ビーディング自動ライン', desc: 'レトルト殺菌工程（オートクレーブ）における高圧・真空状態に耐えうる高強度ビード加工を実現。' },
        cn: { title: '全自动高精度翻边与压筋成型机组', desc: '高精度罐口翻边与罐身环形压筋设备，极大提升耐真空及高温高压杀菌耐抗能力。' },
        mm: { title: 'အလိုအလျောက် သံဗူးပုံစံသွင်းလိုင်းများ', desc: 'အပူချိန်မြင့် သန့်စင်သည့်လုပ်ငန်းစဉ်များတွင် ဖိအားဒဏ်ခံနိုင်စေရန် တိကျစွာ ပုံသွင်းထုတ်လုပ်ပေးပါသည်။' },
      },
    },
    {
      id: 'tech-4',
      icon: 'Zap',
      titleTh: 'Automated 6-Color UV Offset Metal Printing Press',
      titleEn: 'Automated 6-Color UV Offset Metal Printing Press',
      descTh: 'แท่นพิมพ์แผ่นโลหะระบบยูวี 6 สี ช่วยให้หมึกแห้งตัวทันที ให้ความเงางามและทนทานต่อการขูดขีดสูงสุด',
      descEn: 'Advanced 6-color ultraviolet sheet-fed offset press ensuring instantaneous ink curing, vibrant gamut, and scratch resistance.',
      image: '/images/cat-rect-cans.jpg',
      translations: {
        en: { title: 'Automated 6-Color UV Offset Metal Printing Press', desc: 'Advanced 6-color ultraviolet sheet-fed offset press ensuring instantaneous ink curing, vibrant gamut, and scratch resistance.' },
        jp: { title: '全自動6色UVオフセット金属印刷機', desc: '瞬時硬化UVインキによる高精細6色オフセット印刷。鮮やかな発色と卓越した耐摩耗性を両立。' },
        cn: { title: '全自动六色UV金属胶印机', desc: '先进的六色紫外光固化单张金属印花机，油墨瞬间固化，色彩鲜艳锐利且耐刮擦。' },
        mm: { title: '၆ ရောင်စုံ UV သတ္တုပုံနှိပ်စက်', desc: 'အရည်အသွေးမြင့် ၆ ရောင်စုံ ခရမ်းလွန်ရောင်ခြည်သုံး ပုံနှိပ်စက်ဖြစ်ပြီး အရောင်စိုပြေကာ ခြစ်ရာမထင်စေပါ။' },
      },
    },
  ],

  // Services CMS Section
  servicesBadge: 'Manufacturing Services',
  servicesHeading: 'บริการการผลิตและพิมพ์ลายบรรจุภัณฑ์โลหะครบวงจร',
  servicesDescription:
    'ตั้งแต่การออกแบบแม่พิมพ์ การพิมพ์ลายออฟเซ็ตความละเอียดสูง ไปจนถึงการขึ้นรูปกระป๋องด้วยเทคโนโลยีสวิตเซอร์แลนด์',
  servicesList: [
    {
      id: 'srv-1',
      icon: 'Layers',
      titleTh: 'OEM & ODM Can Manufacturing (รับจ้างผลิตบรรจุภัณฑ์โลหะ)',
      titleEn: 'OEM & ODM Can Manufacturing',
      descTh: 'บริการผลิตกระป๋องโลหะ 3 ชิ้น สำหรับอาหาร ถังเคมีภัณฑ์ และฝาเปิดง่าย ตามขนาดและสเปกที่ลูกค้ากำหนดอย่างแม่นยำ',
      descEn: 'Comprehensive 3-piece sanitary food can, chemical pail, and closure fabrication tailored to custom client specifications.',
      features: [
        'รองรับขนาดเส้นผ่านศูนย์กลาง 52 - 300 มม.',
        'เลือกสารเคลือบภายในตามประเภทอาหาร (BPA-NI)',
        'กำลังการผลิตสูง ส่งมอบตรงเวลา',
      ],
      image: '/images/cat-round-cans.jpg',
      translations: {
        en: { title: 'OEM & ODM Can Manufacturing', desc: 'Comprehensive 3-piece sanitary food can, chemical pail, and closure fabrication tailored to custom client specifications.' },
        jp: { title: 'OEM/ODM 金属缶受託製造サービス', desc: '食品用3ピース缶、化学品ペール缶、イージーオープン蓋など、お客様の規格に合わせた高精度な受託生産。' },
        cn: { title: 'OEM/ODM 食品与工业金属罐代工制造', desc: '为食品三片罐、化工桶及易拉盖提供全流程量身定制代工，精准匹配客户严苛规格。' },
        mm: { title: 'OEM & ODM သံဗူးထုတ်လုပ်မှု ဝန်ဆောင်မှု', desc: 'စားသောက်ကုန်သုံး ၃ ပိုင်းစပ် သံဗူးများ၊ ဓာတုဗေဒသုံး ပုံးများနှင့် အဖုံးများကို စိတ်ကြိုက်ထုတ်လုပ်ပေးပါသည်။' },
      },
    },
    {
      id: 'srv-2',
      icon: 'Printer',
      titleTh: 'High-Precision 6-Color Metal Offset Printing (บริการพิมพ์ลายบนแผ่นโลหะ)',
      titleEn: 'High-Precision 6-Color Metal Offset Printing',
      descTh: 'ระบบพิมพ์ออฟเซ็ตความละเอียดสูงบนแผ่นเหล็กเคลือบดีบุกและอลูมิเนียม สีสันสดใส คมชัด ทนความร้อนสูง',
      descEn: 'Ultra-high definition 6-color offset lithography on tinplate and aluminum sheets with high thermal endurance.',
      features: [
        'พิมพ์ได้สูงสุด 6 สี พร้อมเคลือบวานิชเงา/ด้าน',
        'หมึกพิมพ์ปลอดภัย Food Contact Grade',
        'ตรวจวัดความแม่นยำของสีด้วยระบบ Spectrophotometer',
      ],
      image: '/images/cat-printed-cans.jpg',
      translations: {
        en: { title: 'High-Precision 6-Color Metal Offset Printing', desc: 'Ultra-high definition 6-color offset lithography on tinplate and aluminum sheets with high thermal endurance.' },
        jp: { title: '高精細6色金属オフセット印刷', desc: 'ブリキおよびアルミシートへの超高精細6色オフセット印刷。耐熱性・耐薬品性に優れた食品安全インキ使用。' },
        cn: { title: '高精度六色金属薄板平版胶印', desc: '采用食品接触级安全环保油墨，在马口铁及铝板上呈现超高清六色图案，耐高温灭菌。' },
        mm: { title: '၆ ရောင်စုံ တိကျသော သတ္တုပုံနှိပ်ဝန်ဆောင်မှု', desc: 'စားသောက်ကုန်အဆင့်မီ ဘေးကင်းသော ဆေးရည်များဖြင့် သံပြားပေါ်တွင် ပုံနှိပ်ပေးပါသည်။' },
      },
    },
    {
      id: 'srv-3',
      icon: 'Wrench',
      titleTh: 'Tooling & Engineering Support (ออกแบบและพัฒนาแม่พิมพ์)',
      titleEn: 'Tooling & Engineering Support',
      descTh: 'ทีมวิศวกรผู้เชี่ยวชาญให้คำปรึกษา ออกแบบโครงสร้างกระป๋อง ปรับปรุงแม่พิมพ์เพื่อความแน่นหนาของตะเข็บ',
      descEn: 'Dedicated engineering consultancy, precision seamer chuck/roll tooling optimization, and seam cross-section analysis.',
      features: [
        'วิเคราะห์ความแข็งแรงต่อแรงดันสุญญากาศ',
        'ให้คำแนะนำการปรับจูนเครื่อง Seamer ของลูกค้า',
        'บริการตรวจวัด Double Seam หน้างาน',
      ],
      image: '/images/cat-can-lids.jpg',
      translations: {
        en: { title: 'Tooling & Engineering Support', desc: 'Dedicated engineering consultancy, precision seamer chuck/roll tooling optimization, and seam cross-section analysis.' },
        jp: { title: '金型設計・エンジニアリング技術支援', desc: '巻締ロール・チャック工具の最適化、二重巻締断面解析、お客様の巻締機アライメント調整を技術支援。' },
        cn: { title: '精密模具设计与卷封技术工程支持', desc: '专业工程师团队提供全方位咨询、罐型结构优化、封罐机滚轮模具调校及卷封切片分析。' },
        mm: { title: 'ဒီဇိုင်းနှင့် အင်ဂျင်နီယာဆိုင်ရာ အကူအညီ', desc: 'သံဗူးဖွဲ့စည်းပုံဒီဇိုင်းနှင့် စက်ယန္တရားများ ချိန်ညှိမှုအတွက် ကျွမ်းကျင်အင်ဂျင်နီယာများမှ အကြံဉာဏ်ပေးပါသည်။' },
      },
    },
  ],

  // Careers CMS Section
  careersBadge: 'Careers & Opportunities',
  careersHeading: 'ร่วมเป็นส่วนหนึ่งของการขับเคลื่อนอุตสาหกรรมบรรจุภัณฑ์สู่อนาคต',
  careersSubtitle: 'สร้างสรรค์นวัตกรรม เติบโตไปพร้อมกับทีมงานมืออาชีพในสภาพแวดล้อมที่ทันสมัย ปลอดภัย และมั่นคง',
  careersBenefits: [
    'โบนัสประจำปีและโบนัสผลงาน',
    'กองทุนสำรองเลี้ยงชีพ (Provident Fund)',
    'ประกันสุขภาพกลุ่มและตรวจสุขภาพประจำปี',
    'เบี้ยขยันและค่าทำงานล่วงเวลา (OT)',
    'ชุดยูนิฟอร์มและอุปกรณ์ PPE ความปลอดภัยมาตรฐานสากล',
    'โอกาสฝึกอบรมและดูงานเทคโนโลยีต่างประเทศ',
  ],
  careersBenefitsTranslations: {
    en: [
      'Annual Performance Bonuses',
      'Provident Fund Scheme',
      'Group Health Insurance & Annual Check-up',
      'Attendance Allowance & Overtime Pay (OT)',
      'Uniforms & Safety PPE to International Standards',
      'Overseas Technical Training & Factory Visits',
    ],
    jp: [
      '年次業績賞与・インセンティブ',
      '確定拠出年金・積立基金制度',
      '団体医療保険および年次定期健康診断',
      '精勤手当および時間外勤務手当（残業手当）',
      '国際安全基準ユニフォーム＆保護具（PPE）支給',
      '海外技術研修・最新製缶技術視察機会',
    ],
    cn: [
      '年终绩效奖金与业绩分红',
      '公积金/养老保障计划',
      '团体商业医疗保险与年度健康体检',
      '全勤奖及合规加班补助 (OT)',
      '国际标准劳保工装与安全PPE装备',
      '海外先进制造技术培训与进修机会',
    ],
    mm: [
      'နှစ်စဉ် လုပ်ငန်းစွမ်းဆောင်ရည် ဘောနပ်စ်',
      'အရန်ငွေစု ရန်ပုံငွေ အစီအစဉ်',
      'အဖွဲ့လိုက် ကျန်းမာရေးအာမခံနှင့် နှစ်စဉ် ကျန်းမာရေးစစ်ဆေးမှု',
      'ရက်မှန်ကြေးနှင့် အချိန်ပိုလုပ်ခ (OT)',
      'နိုင်ငံတကာစံချိန်မီ ယူနီဖောင်းနှင့် လုံခြုံရေးအကာအကွယ်ပစ္စည်းများ',
      'ပြည်ပနည်းပညာ လေ့လာသင်တန်း အခွင့်အလမ်းများ',
    ],
  },
  careersJobs: [
    {
      id: 'job-1',
      titleTh: 'วิศวกรควบคุมสายการผลิตเครื่องเชื่อมความเร็วสูง (Production Engineer)',
      titleEn: 'Production Engineer (High-Speed Can Welding)',
      department: 'ฝ่ายผลิตและวิศวกรรม (Production & Engineering)',
      type: 'งานประจำ (Full-Time)',
      location: 'โรงงานกระทุ่มแบน จ.สมุทรสาคร',
      experience: '2 - 5 ปี',
      description: 'ควบคุมและปรับจูนเครื่องจักร Soudronic ควบคุมมาตรฐานตะเข็บกระป๋อง และประสานงานทีมซ่อมบำรุง',
      requirements: [
        'ปริญญาตรี สาขาวิศวกรรมเครื่องกล, อุตสาหการ หรือไฟฟ้า',
        'มีประสบการณ์ในโรงงานขึ้นรูปโลหะหรือกระป๋องอาหารพิจารณาเป็นพิเศษ',
        'สามารถทำงานเป็นกะได้',
      ],
      salaryRange: '30,000 - 45,000 บาท/เดือน',
      active: true,
      translations: {
        en: { title: 'Production Engineer (High-Speed Can Welding)', department: 'Production & Engineering', location: 'Samut Sakhon Plant', description: 'Operate and tune Soudronic high-speed seam welders, oversee canbody integrity, and collaborate with maintenance engineering.' },
        jp: { title: '高速製缶溶接ライン製造エンジニア', department: '製造・エンジニアリング部門', location: 'タイ・サムットサコーン工場', description: 'スイス・ソウロニック高速製缶ラインの運転調整、溶接シーム品質管理、設備保全の統括。' },
        cn: { title: '高速焊接生产线工程师 (Production Engineer)', department: '生产工程部', location: '龙仔厝府工厂', description: '负责Soudronic高速罐身焊机操控与工艺调校，监控焊缝卷封质量，配合设备维护。' },
        mm: { title: 'ထုတ်လုပ်မှု အင်ဂျင်နီယာ (ဂဟေဆက်လိုင်း)', department: 'ထုတ်လုပ်မှုနှင့် အင်ဂျင်နီယာဌာန', location: 'စမွတ်စာခွန် စက်ရုံ', description: 'Soudronic အမြန်နှုန်းမြင့် စက်များကို ထိန်းချုပ်မောင်းနှင်ပြီး ထုတ်လုပ်မှုအရည်အသွေးကို စစ်ဆေးရမည်။' },
      },
    },
    {
      id: 'job-2',
      titleTh: 'เจ้าหน้าที่ควบคุมคุณภาพและแล็บวิเคราะห์ (QA/QC Specialist)',
      titleEn: 'QA/QC Specialist (Food Packaging Standards)',
      department: 'ฝ่ายประกันคุณภาพ (Quality Assurance)',
      type: 'งานประจำ (Full-Time)',
      location: 'โรงงานกระทุ่มแบน จ.สมุทรสาคร',
      experience: '1 - 3 ปี',
      description: 'ตรวจสอบความสมบูรณ์ของ Double Seam ทดสอบแรงดึง แรงต้านความดัน และตรวจสอบแล็กเกอร์เคลือบภายใน',
      requirements: [
        'ปริญญาตรี สาขาวิทยาศาสตร์, เทคโนโลยีอาหาร, เคมี หรือสาขาที่เกี่ยวข้อง',
        'เข้าใจระบบ FSSC 22000, HACCP, GMP และข้อกำหนดบรรจุภัณฑ์อาหาร',
      ],
      salaryRange: '24,000 - 35,000 บาท/เดือน',
      active: true,
      translations: {
        en: { title: 'QA/QC Specialist (Food Packaging Standards)', department: 'Quality Assurance', location: 'Samut Sakhon Plant', description: 'Inspect double seam integrity, tensile and pressure resistance, internal lacquer continuity, and manage FSSC 22000 audits.' },
        jp: { title: '品質保証・分析スペシャリスト (QA/QC)', department: '品質保証部門', location: 'タイ・サムットサコーン工場', description: '二重巻締寸法測定、耐圧・引張強度試験、内面ラッカー通電検査、FSSC 22000監査対応。' },
        cn: { title: '质量控制与化验专员 (QA/QC Specialist)', department: '品质保障部', location: '龙仔厝府工厂', description: '执行双重卷封检测、耐压/拉力试验、内部耐腐蚀涂膜测试及FSSC 22000食品安全体系审核。' },
        mm: { title: 'အရည်အသွေးထိန်းသိမ်းရေး ကျွမ်းကျင်သူ (QA/QC)', department: 'အရည်အသွေးအာမခံဌာန', location: 'စမွတ်စာခွန် စက်ရုံ', description: 'သံဗူးလုံခြုံမှု၊ ဖိအားဒဏ်ခံနိုင်မှုနှင့် အတွင်းပိုင်းအလွှာများကို FSSC 22000 စံချိန်စံညွှန်းဖြင့် စစ်ဆေးရမည်။' },
      },
    },
    {
      id: 'job-3',
      titleTh: 'เจ้าหน้าที่ฝ่ายขายและการตลาดต่างประเทศ (Overseas Sales Executive)',
      titleEn: 'Overseas Sales Executive (International B2B)',
      department: 'ฝ่ายขายและการตลาด (Sales & Business Development)',
      type: 'งานประจำ (Full-Time)',
      location: 'สำนักงานใหญ่ / Hybrid',
      experience: '2 ปีขึ้นไป',
      description: 'ดูแลและขยายฐานลูกค้าอุตสาหกรรมอาหารแปรรูปและส่งออกในภูมิภาคเอเชีย ยุโรป และตะวันออกกลาง',
      requirements: [
        'ปริญญาตรี ทุกสาขา มีทักษะการสื่อสารภาษาอังกฤษดีเยี่ยม (หากได้ภาษาญี่ปุ่นหรือจีนจะได้รับพิจารณาเป็นพิเศษ)',
        'มีใจรักงานบริการ บุคลิกภาพดี มีทักษะการเจรจาต่อรองแบบ B2B',
      ],
      salaryRange: '35,000 - 60,000 บาท/เดือน + ค่าคอมมิชชัน',
      active: true,
      translations: {
        en: { title: 'Overseas Sales Executive (International B2B)', department: 'Sales & Business Development', location: 'Head Office (Bangkok) / Hybrid', description: 'Cultivate and manage export accounts for food and industrial metal packaging across Asia, Europe, and Middle East.' },
        jp: { title: '海外営業・アカウントエグゼクティブ', department: '海外営業・事業開発部', location: 'バンコク本社 / ハイブリッド勤務', description: 'アジア・欧州・中東市場に向けた食品加工メーカー向け金属パッケージングの海外B2B営業展開。' },
        cn: { title: '海外业务经理 (Overseas Sales Executive)', department: '海外销售与业务拓展部', location: '曼谷总部 / 混合办公', description: '负责亚洲、欧美及中东食品加工巨头与跨国客户的B2B金属包装出口拓展与客户维护。' },
        mm: { title: 'နိုင်ငံတကာ အရောင်းအရာရှိ (Overseas Sales)', department: 'အရောင်းနှင့် စီးပွားရေးဌာန', location: 'ရုံးချုပ် (ဘန်ကောက်) / Hybrid', description: 'အာရှနှင့် ဥရောပရှိ စားသောက်ကုန်လုပ်ငန်းကြီးများသို့ သတ္တုထုပ်ပိုးပစ္စည်းများ တင်ပို့ရောင်းချမှုကို တာဝန်ယူရမည်။' },
      },
    },
  ],

  factoryAddress: '88 หมู่ 3 ถนนเศรษฐกิจ 1 ตำบลคลองมะเดื่อ อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110',
  phoneNumber: '+66 (0) 34 878 999',
  email: 'sales@lohakit.co.th',
  taxId: '0745548001234',
  registeredCapital: '100,000,000 บาท',
  establishedYear: '1986',
  businessHours: 'จันทร์ - เสาร์ 08:00 - 17:00',
  footerBio:
    'ผู้นำนวัตกรรมผลิตกระป๋องอาหารสำเร็จรูป ถังเคมีภัณฑ์ และฝาเปิดง่าย EOE มาตรฐานส่งออกสากล ด้วยเครื่องจักรอัตโนมัติความเร็วสูง',
  certificationsText: 'ISO 9001:2015 | FSSC 22000 | HACCP & GMP Certified',
  complianceText:
    'BPA-NI Food Contact Compliant • UN Packaging Certified (Dangerous Goods) • 100% Infinitely Recyclable Steel',

  branches: [
    {
      id: 'branch-hq',
      nameTh: 'สำนักงานใหญ่ (Head Office)',
      nameEn: 'Head Office & Commercial Center',
      type: 'headquarters',
      addressTh: '123/45 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120',
      addressEn: '123/45 South Sathon Road, Yannawa, Sathon, Bangkok 10120, Thailand',
      phone: '+66 (0) 2 123 4567',
      fax: '+66 (0) 2 123 4568',
      email: 'contact@chiotron.co.th',
      businessHoursTh: 'จันทร์ - ศุกร์: 08:30 - 17:30 น. (หยุดเสาร์ - อาทิตย์)',
      businessHoursEn: 'Mon - Fri: 08:30 - 17:30 (Closed Sat - Sun)',
      mapUrl: 'https://maps.google.com/?q=Sathon+Bangkok',
      isPrimary: true,
      enabled: true,
      translations: {
        en: { name: 'Head Office & Commercial Center', address: '123/45 South Sathon Road, Yannawa, Sathon, Bangkok 10120, Thailand', businessHours: 'Mon - Fri: 08:30 - 17:30 (Closed Sat - Sun)' },
        jp: { name: '本社（バンコク・サトーン）', address: 'タイ国バンコク都サトーン区ヤンナワー サトーン南通り 123/45', businessHours: '月〜金: 08:30 - 17:30（土日祝 休）' },
        cn: { name: '曼谷总部（Head Office）', address: '泰国曼谷沙吞区严那瓦南沙吞路123/45号 邮编10120', businessHours: '周一至周五: 08:30 - 17:30（周末休息）' },
        mm: { name: 'ရုံးချုပ် (ဘန်ကောက်)', address: '၁၂၃/၄၅ တောင်ဆာသွန်လမ်း၊ ယာနဝါ၊ ဆာသွန်၊ ဘန်ကောက် ၁၀၁၂၀၊ ထိုင်းနိုင်ငံ', businessHours: 'တနင်္လာ - သောကြာ: ၀၈:၃၀ - ၁၇:၃၀' },
      },
    },
    {
      id: 'branch-plant-1',
      nameTh: 'โรงงานสมุทรสาคร (Samut Sakhon Manufacturing Plant)',
      nameEn: 'Samut Sakhon Smart Plant & Operations',
      type: 'factory',
      addressTh: '88/9 หมู่ 4 นิคมอุตสาหกรรมสมุทรสาคร ตำบลบางกระเจ้า อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
      addressEn: '88/9 Moo 4, Samut Sakhon Industrial Estate, Bang Krachao, Mueang, Samut Sakhon 74000, Thailand',
      phone: '+66 (0) 34 890 123',
      fax: '+66 (0) 34 890 124',
      email: 'factory@chiotron.co.th',
      businessHoursTh: 'จันทร์ - เสาร์: 08:00 - 17:00 น. (ฝ่ายผลิต 24 ชั่วโมง)',
      businessHoursEn: 'Mon - Sat: 08:00 - 17:00 (Operations 24/7)',
      mapUrl: 'https://maps.google.com/?q=Samut+Sakhon+Industrial+Estate',
      isPrimary: false,
      enabled: true,
      translations: {
        en: { name: 'Samut Sakhon Smart Plant & Operations', address: '88/9 Moo 4, Samut Sakhon Industrial Estate, Bang Krachao, Mueang, Samut Sakhon 74000, Thailand', businessHours: 'Mon - Sat: 08:00 - 17:00 (Operations 24/7)' },
        jp: { name: 'サムットサコーン製造工場', address: 'タイ国サムットサコーン県ムアン郡バーンクラチャオ サムットサコーン工業団地 88/9', businessHours: '月〜土: 08:00 - 17:00（製造ライン 24時間稼働）' },
        cn: { name: '龙仔厝智能制造工厂', address: '泰国龙仔厝府直辖县曼卡超区龙仔厝工业区88/9号 邮编74000', businessHours: '周一至周六: 08:00 - 17:00（车间24小时运转）' },
        mm: { name: 'စမွတ်စာခွန် စက်ရုံ', address: '၈၈/၉ မူ ၄၊ စမွတ်စာခွန် စက်မှုဇုန်၊ စမွတ်စာခွန် ၇၄၀၀၀၊ ထိုင်းနိုင်ငံ', businessHours: 'တနင်္လာ - စနေ: ၀၈:၀၀ - ၁၇:၀၀' },
      },
    },
    {
      id: 'branch-logistics',
      nameTh: 'ศูนย์กระจายสินค้าและคลังสินค้าชลบุรี (Eastern Distribution Hub)',
      nameEn: 'Chonburi Eastern Logistics Hub',
      type: 'warehouse',
      addressTh: '45/12 หมู่ 7 ตำบลบ่อวิน อำเภอศรีราชา จังหวัดชลบุรี 20230 (ใกล้ท่าเรือแหลมฉบัง)',
      addressEn: '45/12 Moo 7, Bowin, Si Racha, Chonburi 20230, Thailand (Near Laem Chabang Port)',
      phone: '+66 (0) 38 456 789',
      email: 'logistics@chiotron.co.th',
      businessHoursTh: 'จันทร์ - เสาร์: 08:00 - 18:00 น.',
      businessHoursEn: 'Mon - Sat: 08:00 - 18:00',
      mapUrl: 'https://maps.google.com/?q=Laem+Chabang+Port',
      isPrimary: false,
      enabled: true,
      translations: {
        en: { name: 'Chonburi Eastern Logistics Hub', address: '45/12 Moo 7, Bowin, Si Racha, Chonburi 20230, Thailand (Near Laem Chabang Port)', businessHours: 'Mon - Sat: 08:00 - 18:00' },
        jp: { name: 'チョンブリー物流センター', address: 'タイ国チョンブリー県シラチャ郡ボーウィン 45/12（レムチャバン港至近）', businessHours: '月〜土: 08:00 - 18:00' },
        cn: { name: '春武里东部物流集散中心', address: '泰国春武里府是拉差县波温区45/12号（毗邻廉差邦深水港）', businessHours: '周一至周六: 08:00 - 18:00' },
        mm: { name: 'ချွန်းဘူရီ ထောက်ပံ့ပို့ဆောင်ရေးဂိုဒေါင်', address: '၄၅/၁၂ မူ ၇၊ ဘိုဝင်း၊ သီရာချာ၊ ချွန်းဘူရီ ၂၀၂၃၀၊ ထိုင်းနိုင်ငံ', businessHours: 'တနင်္လာ - စနေ: ၀၈:၀၀ - ၁၈:၀၀' },
      },
    },
  ],
};

const STORAGE_KEY = 'lohakit_site_content_settings';

const mergeCards = <T extends { id: string; translations?: any }>(
  saved: T[] | undefined,
  defaults: T[]
): T[] => {
  if (!saved || saved.length === 0) return defaults;
  return saved.map((card) => {
    const def = defaults.find((d) => d.id === card.id);
    if (!def) return card;
    return {
      ...card,
      translations: {
        ...(def.translations || {}),
        ...(card.translations || {}),
      },
    };
  });
};

export const updateBrowserFavicon = (
  iconUrl?: string,
  logoText?: string,
  companyNameEn?: string,
  companyNameTh?: string
) => {
  try {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (iconUrl) {
      link.href = iconUrl;
    } else {
      const text = (logoText || 'LC').slice(0, 4);
      // SVG dynamic diamond favicon data URI
      link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="%2304070C" stroke="%2338BDF8" stroke-width="8"/><text x="50" y="62" font-size="34" font-family="sans-serif" font-weight="900" fill="%2338BDF8" text-anchor="middle">${text}</text></svg>`;
    }

    if (companyNameEn || companyNameTh) {
      const parts = [companyNameEn, companyNameTh].filter(Boolean);
      document.title = parts.join(' | ');
    }
  } catch (e) {}
};

export const useSiteContent = () => {
  const [settings, setSettings] = useState<SiteContentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        updateBrowserFavicon(
          parsed.logoImage,
          parsed.logoText,
          parsed.companyNameEn,
          parsed.companyNameTh
        );
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          navTabs: parsed.navTabs && parsed.navTabs.length > 0 ? parsed.navTabs : DEFAULT_SITE_SETTINGS.navTabs,
          categoryCards: mergeCards(parsed.categoryCards, DEFAULT_SITE_SETTINGS.categoryCards),
          sustainabilityCards: mergeCards(parsed.sustainabilityCards, DEFAULT_SITE_SETTINGS.sustainabilityCards),
          technologyCards: mergeCards(parsed.technologyCards, DEFAULT_SITE_SETTINGS.technologyCards),
          servicesList: mergeCards(parsed.servicesList, DEFAULT_SITE_SETTINGS.servicesList),
          careersJobs: mergeCards(parsed.careersJobs, DEFAULT_SITE_SETTINGS.careersJobs),
          careersBenefits: parsed.careersBenefits || DEFAULT_SITE_SETTINGS.careersBenefits,
          careersBenefitsTranslations: parsed.careersBenefitsTranslations || DEFAULT_SITE_SETTINGS.careersBenefitsTranslations,
          heroImages: parsed.heroImages || DEFAULT_SITE_SETTINGS.heroImages,
          heroTranslations: parsed.heroTranslations || DEFAULT_SITE_SETTINGS.heroTranslations,
          aboutTranslations: parsed.aboutTranslations || DEFAULT_SITE_SETTINGS.aboutTranslations,
          servicesTranslations: parsed.servicesTranslations || DEFAULT_SITE_SETTINGS.servicesTranslations,
          technologyTranslations: parsed.technologyTranslations || DEFAULT_SITE_SETTINGS.technologyTranslations,
          sustainabilityTranslations: parsed.sustainabilityTranslations || DEFAULT_SITE_SETTINGS.sustainabilityTranslations,
          careersTranslations: parsed.careersTranslations || DEFAULT_SITE_SETTINGS.careersTranslations,
          contactTranslations: parsed.contactTranslations || DEFAULT_SITE_SETTINGS.contactTranslations,
          brandLegalTranslations: parsed.brandLegalTranslations || DEFAULT_SITE_SETTINGS.brandLegalTranslations,
          featureBadges: mergeCards(parsed.featureBadges, DEFAULT_SITE_SETTINGS.featureBadges),
          branches: mergeCards(parsed.branches, DEFAULT_SITE_SETTINGS.branches || []),
        };
      }
    } catch (e) {}
    updateBrowserFavicon(
      DEFAULT_SITE_SETTINGS.logoImage,
      DEFAULT_SITE_SETTINGS.logoText,
      DEFAULT_SITE_SETTINGS.companyNameEn,
      DEFAULT_SITE_SETTINGS.companyNameTh
    );
    return DEFAULT_SITE_SETTINGS;
  });

  // Fetch settings from Central Backend Database on initialization
  useEffect(() => {
    const fetchRemoteSettings = async () => {
      try {
        const res = await fetch('/api/v1/public/settings');
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            let remoteSettings: Partial<SiteContentSettings> = {};
            if (json.data.site_content) {
              remoteSettings = json.data.site_content;
            } else if (json.data['company.name.th']) {
              // Map individual keys if present
              remoteSettings = {
                companyNameTh: json.data['company.name.th'],
                companyNameEn: json.data['company.name.en'],
                factoryAddress: json.data['company.address.th'],
                phoneNumber: json.data['company.phone'],
                email: json.data['company.email'],
              };
            }

            if (Object.keys(remoteSettings).length > 0) {
              setSettings((prev) => {
                const merged = {
                  ...DEFAULT_SITE_SETTINGS,
                  ...prev,
                  ...remoteSettings,
                  navTabs: remoteSettings.navTabs || prev.navTabs || DEFAULT_SITE_SETTINGS.navTabs,
                  categoryCards: mergeCards(remoteSettings.categoryCards || prev.categoryCards, DEFAULT_SITE_SETTINGS.categoryCards),
                  sustainabilityCards: mergeCards(remoteSettings.sustainabilityCards || prev.sustainabilityCards, DEFAULT_SITE_SETTINGS.sustainabilityCards),
                  technologyCards: mergeCards(remoteSettings.technologyCards || prev.technologyCards, DEFAULT_SITE_SETTINGS.technologyCards),
                  servicesList: mergeCards(remoteSettings.servicesList || prev.servicesList, DEFAULT_SITE_SETTINGS.servicesList),
                  careersJobs: mergeCards(remoteSettings.careersJobs || prev.careersJobs, DEFAULT_SITE_SETTINGS.careersJobs),
                  careersBenefits: remoteSettings.careersBenefits || prev.careersBenefits || DEFAULT_SITE_SETTINGS.careersBenefits,
                  careersBenefitsTranslations: remoteSettings.careersBenefitsTranslations || prev.careersBenefitsTranslations || DEFAULT_SITE_SETTINGS.careersBenefitsTranslations,
                  heroImages: remoteSettings.heroImages || prev.heroImages || DEFAULT_SITE_SETTINGS.heroImages,
                  heroTranslations: remoteSettings.heroTranslations || prev.heroTranslations || DEFAULT_SITE_SETTINGS.heroTranslations,
                  aboutTranslations: remoteSettings.aboutTranslations || prev.aboutTranslations || DEFAULT_SITE_SETTINGS.aboutTranslations,
                  servicesTranslations: remoteSettings.servicesTranslations || prev.servicesTranslations || DEFAULT_SITE_SETTINGS.servicesTranslations,
                  technologyTranslations: remoteSettings.technologyTranslations || prev.technologyTranslations || DEFAULT_SITE_SETTINGS.technologyTranslations,
                  sustainabilityTranslations: remoteSettings.sustainabilityTranslations || prev.sustainabilityTranslations || DEFAULT_SITE_SETTINGS.sustainabilityTranslations,
                  careersTranslations: remoteSettings.careersTranslations || prev.careersTranslations || DEFAULT_SITE_SETTINGS.careersTranslations,
                  contactTranslations: remoteSettings.contactTranslations || prev.contactTranslations || DEFAULT_SITE_SETTINGS.contactTranslations,
                  brandLegalTranslations: remoteSettings.brandLegalTranslations || prev.brandLegalTranslations || DEFAULT_SITE_SETTINGS.brandLegalTranslations,
                  featureBadges: mergeCards(remoteSettings.featureBadges || prev.featureBadges, DEFAULT_SITE_SETTINGS.featureBadges),
                  branches: mergeCards(remoteSettings.branches || prev.branches, DEFAULT_SITE_SETTINGS.branches || []),
                };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch (e) {
                  console.warn('localStorage quota reached, continuing with memory state');
                }
                updateBrowserFavicon(
                  merged.logoImage,
                  merged.logoText,
                  merged.companyNameEn,
                  merged.companyNameTh
                );
                return merged;
              });
            }
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };

    fetchRemoteSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteContentSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage quota reached, skipping local storage write');
    }
    updateBrowserFavicon(
      updated.logoImage,
      updated.logoText,
      updated.companyNameEn,
      updated.companyNameTh
    );
    window.dispatchEvent(new Event('lohakit_settings_updated'));

    // Synchronize to Central PostgreSQL Database
    try {
      const csrfToken = localStorage.getItem('csrf_token') || '';
      const authToken = localStorage.getItem('auth_token') || '';
      const payload = JSON.stringify({
        group: 'general',
        key: 'site_content',
        value: updated,
        isPublic: true,
        description: 'Global Site Branding & Content Configuration',
      });

      // Try public settings route first (guaranteed 200 without 401 cookie blocks)
      const res = await fetch('/api/v1/public/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: payload,
      });

      if (!res.ok) {
        await fetch('/api/v1/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          credentials: 'include',
          body: payload,
        });
      }
    } catch (err) {
      console.warn('Failed to sync settings to database:', err);
    }

    return updated;
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
    updateBrowserFavicon();
    window.dispatchEvent(new Event('lohakit_settings_updated'));
  };

  // Listen to cross-component updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...parsed });
          updateBrowserFavicon(parsed.logoImage);
        }
      } catch (e) {}
    };

    window.addEventListener('lohakit_settings_updated', handleUpdate);
    return () => window.removeEventListener('lohakit_settings_updated', handleUpdate);
  }, []);

  return { settings, updateSettings, resetToDefault };
};
