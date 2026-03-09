// src/lib/i18n.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ru" | "uz";

const translations: Record<string, Record<Language, string>> = {
  // Nav
  "nav.creators": { en: "Creators", ru: "Креаторы", uz: "Kreatorlar" },
  "nav.jobs": { en: "Jobs", ru: "Вакансии", uz: "Ishlar" },
  "nav.library": { en: "Content Library", ru: "Библиотека", uz: "Kontent kutubxonasi" },
  "nav.login": { en: "Log In", ru: "Войти", uz: "Kirish" },
  "nav.signup": { en: "Get Started", ru: "Начать", uz: "Boshlash" },
  // Hero
  "hero.badge": { en: "🇺🇿 #1 UGC Marketplace in Uzbekistan", ru: "🇺🇿 #1 UGC Маркетплейс в Узбекистане", uz: "🇺🇿 O'zbekistondagi #1 UGC Marketplace" },
  "hero.title1": { en: "Connect Brands with", ru: "Соединяем Бренды с", uz: "Brendlarni" },
  "hero.title2": { en: "UGC Creators", ru: "UGC Креаторами", uz: "UGC Kreatorlar" },
  "hero.title3": { en: " ", ru: " ", uz: "bilan bog'laymiz" },
  "hero.subtitle": { en: "Find talented content creators or get hired by top brands. The easiest way to produce authentic user-generated content for TikTok, Instagram Reels, and more.", ru: "Найдите талантливых контент-мейкеров или получите заказ от топ-брендов. Самый простой способ создать UGC-контент для TikTok, Instagram Reels и других платформ.", uz: "Iste'dodli kontent yaratuvchilarni toping yoki top brendlardan buyurtma oling. TikTok, Instagram Reels va boshqa platformalar uchun UGC-kontent yaratishning eng oson yo'li." },
  "hero.cta.brand": { en: "I'm a Brand", ru: "Я Бренд", uz: "Men Brendman" },
  "hero.cta.creator": { en: "I'm a Creator", ru: "Я Креатор", uz: "Men Kreatorman" },
  "hero.stats.creators": { en: "Active Creators", ru: "Активных Креаторов", uz: "Faol Kreatorlar" },
  "hero.stats.brands": { en: "Brands", ru: "Брендов", uz: "Brendlar" },
  "hero.stats.videos": { en: "Videos Delivered", ru: "Видео Доставлено", uz: "Video Yetkazildi" },
  // How it works
  "how.title": { en: "How It Works", ru: "Как Это Работает", uz: "Qanday Ishlaydi" },
  "how.subtitle": { en: "Get started in 3 simple steps", ru: "Начните за 3 простых шага", uz: "3 oddiy qadamda boshlang" },
  "how.step1.title": { en: "Create Your Profile", ru: "Создайте Профиль", uz: "Profil Yarating" },
  "how.step1.desc": { en: "Sign up as a brand or creator and set up your profile with your portfolio or campaign needs.", ru: "Зарегистрируйтесь как бренд или креатор и настройте профиль.", uz: "Brend yoki kreator sifatida ro'yxatdan o'ting va profilingizni sozlang." },
  "how.step2.title": { en: "Find & Connect", ru: "Найдите и Свяжитесь", uz: "Toping va Bog'laning" },
  "how.step2.desc": { en: "Browse creators or post jobs. Send proposals and start collaborating.", ru: "Ищите креаторов или размещайте заказы. Отправляйте предложения.", uz: "Kreatorlarni ko'ring yoki ish joylashtiring. Takliflar yuboring." },
  "how.step3.title": { en: "Deliver & Get Paid", ru: "Доставьте и Получите Оплату", uz: "Topshiring va Pul Oling" },
  "how.step3.desc": { en: "Upload content, get approval, and receive payment securely through the platform.", ru: "Загрузите контент, получите одобрение и оплату через платформу.", uz: "Kontentni yuklang, tasdiqlang va platforma orqali to'lov oling." },
  // Benefits
  "benefits.brands.title": { en: "For Brands", ru: "Для Брендов", uz: "Brendlar Uchun" },
  "benefits.brands.1": { en: "Access vetted local UGC creators", ru: "Доступ к проверенным креаторам", uz: "Tekshirilgan mahalliy kreatorlarga kirish" },
  "benefits.brands.2": { en: "Post campaigns & receive proposals", ru: "Размещайте кампании и получайте предложения", uz: "Kampaniyalar joylashtiring va takliflar oling" },
  "benefits.brands.3": { en: "Buy ready-made UGC content", ru: "Покупайте готовый UGC-контент", uz: "Tayyor UGC-kontent sotib oling" },
  "benefits.brands.4": { en: "Secure payments & content delivery", ru: "Безопасные платежи и доставка контента", uz: "Xavfsiz to'lovlar va kontent yetkazish" },
  "benefits.creators.title": { en: "For Creators", ru: "Для Креаторов", uz: "Kreatorlar Uchun" },
  "benefits.creators.1": { en: "Get discovered by top brands", ru: "Будьте найдены топ-брендами", uz: "Top brendlar tomonidan topiling" },
  "benefits.creators.2": { en: "Browse and apply to paid jobs", ru: "Находите и откликайтесь на заказы", uz: "Pulli ishlarga murojaat qiling" },
  "benefits.creators.3": { en: "Sell your UGC videos directly", ru: "Продавайте свои видео напрямую", uz: "Videolaringizni to'g'ridan-to'g'ri soting" },
  "benefits.creators.4": { en: "Build your portfolio & reputation", ru: "Создайте портфолио и репутацию", uz: "Portfolio va obro'ingizni yarating" },
  // CTA
  "cta.title": { en: "Ready to Start?", ru: "Готовы Начать?", uz: "Boshlashga Tayyormisiz?" },
  "cta.subtitle": { en: "Join the fastest-growing UGC marketplace in Uzbekistan", ru: "Присоединяйтесь к самому быстрорастущему UGC маркетплейсу в Узбекистане", uz: "O'zbekistondagi eng tez rivojlanayotgan UGC marketpleysiga qo'shiling" },
  "cta.button": { en: "Join UGC Market", ru: "Присоединиться", uz: "Qo'shilish" },
  // Footer
  "footer.description": { en: "The premier UGC marketplace connecting brands and content creators in Uzbekistan.", ru: "Премиум UGC маркетплейс, соединяющий бренды и контент-мейкеров в Узбекистане.", uz: "O'zbekistondagi brendlar va kontent yaratuvchilarni bog'laydigan premium UGC marketplace." },
  "footer.platform": { en: "Platform", ru: "Платформа", uz: "Platforma" },
  "footer.company": { en: "Company", ru: "Компания", uz: "Kompaniya" },
  "footer.about": { en: "About Us", ru: "О Нас", uz: "Biz Haqimizda" },
  "footer.contact": { en: "Contact", ru: "Контакты", uz: "Aloqa" },
  "footer.privacy": { en: "Privacy Policy", ru: "Политика Конфиденциальности", uz: "Maxfiylik Siyosati" },
  "footer.terms": { en: "Terms of Service", ru: "Условия Использования", uz: "Foydalanish Shartlari" },
  "footer.rights": { en: "All rights reserved.", ru: "Все права защищены.", uz: "Barcha huquqlar himoyalangan." },
  // Featured
  "featured.title": { en: "Featured Creators", ru: "Лучшие Креаторы", uz: "Taniqli Kreatorlar" },
  "featured.subtitle": { en: "Top-rated creators ready to bring your brand to life", ru: "Лучшие креаторы, готовые оживить ваш бренд", uz: "Brendingizni jonlantirish uchun tayyor top kreatorlar" },
  "featured.viewall": { en: "View All Creators", ru: "Смотреть Всех", uz: "Barchasini Ko'rish" },
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};


const SUPPORTED_LANGUAGES: Language[] = ["uz", "ru", "en"];
const DEFAULT_LANGUAGE: Language = "ru";

const I18nContext = createContext<I18nContextType>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (key: string) => key,
});

function getInitialLang(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ugcmarket_lang");
    if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
      return stored as Language;
    }
    // Optionally, detect browser language here
  }
  return DEFAULT_LANGUAGE;
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(getInitialLang());
  const t = (key: string) => translations[key]?.[lang] || key;

  // Store language in localStorage and update <html lang>
  const setLang = (newLang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setLangState(newLang);
      if (typeof window !== "undefined") {
        localStorage.setItem("ugcmarket_lang", newLang);
        document.documentElement.lang = newLang;
      }
    }
  };

  // On mount, set <html lang>
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
