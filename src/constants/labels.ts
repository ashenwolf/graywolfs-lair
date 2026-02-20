export const CATEGORIES = ["software-engineering", "travel", "life"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Lang = "en" | "ua";

export const CATEGORY_LABELS: Record<Category, Record<Lang, string>> = {
  "software-engineering": { en: "Software Engineering", ua: "Розробка ПЗ" },
  travel: { en: "Travel", ua: "Подорожі" },
  life: { en: "Life", ua: "Життя" },
};

export const CATEGORY_GRADIENTS: Record<Category, string> = {
  "software-engineering": "from-blue-400 to-indigo-600",
  travel: "from-emerald-400 to-teal-600",
  life: "from-violet-400 to-purple-600",
};

export const UI = {
  en: {
    home: "Home",
    photography: "Photography",
    navigation: "Navigation",
    recentPosts: "Recent Posts",
    social: "Social",
    backToTop: "Back to top",
    noPosts: "No posts yet",
    noTags: "No tags yet.",
    tags: "Tags",
  },
  ua: {
    home: "Головна",
    photography: "Фото",
    navigation: "Навігація",
    recentPosts: "Нещодавні статті",
    social: "Соцмережі",
    backToTop: "Вгору",
    noPosts: "Немає статей",
    noTags: "Тегів поки немає.",
    tags: "Теги",
  },
} satisfies Record<Lang, Record<string, string>>;

export const buildNav = (lang: Lang) => {
  const t = UI[lang];
  const prefix = lang === "ua" ? "/ua" : "";
  const navLinks = [
    { href: lang === "ua" ? "/ua" : "/", label: t.home },
    { href: `${prefix}/photography`, label: t.photography },
    { href: `${prefix}/cv`, label: "CV" },
  ];
  const langToggle = lang === "ua" ? { href: "/", label: "EN" } : { href: "/ua", label: "UA" };
  return { navLinks, langToggle };
};
