export const LANGS = ["en", "ua"] as const;
export type Lang = (typeof LANGS)[number];

export const CATEGORY_IDS = ["software-engineering", "travel", "life"] as const;
export type Category = (typeof CATEGORY_IDS)[number];

// One complete spec per language: everything that differs between gulenok.lu and graywolf.org.ua.
export const LOCALES = {
  en: {
    origin: "https://gulenok.lu",
    prefix: "",
    htmlLang: "en",
    dateLocale: "en-US",
    other: "ua",
    home: {
      description: "Thoughts on people, software engineering and people in software engineering. By Sergii Gulenok.",
      heading: "Geek by Nature, Engineer by Choice",
      lead: "Thoughts on people, software engineering and people in software engineering.",
      intro: "I'm Sergii and write about code, journeys, and whatever comes to mind.",
      photoAlt: "Sergii and Denzel",
    },
    ui: {
      home: "Home",
      photography: "Photography",
      cv: "CV",
      comingSoon: "Coming soon.",
      navigation: "Navigation",
      recentPosts: "Recent Posts",
      social: "Social",
      backToTop: "Back to top",
      latestArticles: "Latest Articles",
      seeMore: "See more",
      noArticlesInCategory: "No articles in this category yet.",
      notFound: "Page not found.",
      goHome: "Go to the home page",
      tags: "Tags",
      tag: "Tag",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
    },
  },
  ua: {
    origin: "https://graywolf.org.ua",
    prefix: "/ua",
    htmlLang: "uk",
    dateLocale: "uk-UA",
    other: "en",
    home: {
      description: "Думки про людей, програмну інженерію та людей у програмній інженерії. Сергій Гуленок.",
      heading: "graywolf's lair",
      lead: "Розробник, мандрівник і трошки фотограф.",
      intro: "Привіт, мене звати Сергій і я пишу про код, подорожі та всяку фігню, що спадає на думку.",
      photoAlt: "Сергій і Дензел",
    },
    ui: {
      home: "Головна",
      photography: "Фото",
      cv: "CV",
      comingSoon: "Незабаром.",
      navigation: "Навігація",
      recentPosts: "Нещодавні статті",
      social: "Соцмережі",
      backToTop: "Вгору",
      latestArticles: "Нові статті",
      seeMore: "Дивитись більше",
      noArticlesInCategory: "Немає статей у цій категорії.",
      notFound: "Сторінку не знайдено.",
      goHome: "Перейти на головну",
      tags: "Теги",
      tag: "Тег",
      previous: "Попередня",
      next: "Наступна",
      page: "Сторінка",
      of: "з",
    },
  },
} as const satisfies Record<Lang, {
  origin: string;
  prefix: string;
  htmlLang: string;
  dateLocale: string;
  other: Lang;
  home: Record<"description" | "heading" | "lead" | "intro" | "photoAlt", string>;
  ui: Record<string, string>;
}>;

// One complete spec per category; CATEGORY_IDS order is the order of the home page sections.
export const CATEGORIES = {
  "software-engineering": {
    gradient: "from-blue-400 to-indigo-600",
    cover: "/assets/images/common/cyberpunk-2100.png",
    en: { label: "Software Engineering", blurb: "Deep dives into code, architecture, and the craft of building software." },
    ua: { label: "Розробка ПЗ", blurb: "Занурення в код, архітектуру та ремесло створення програм." },
  },
  travel: {
    gradient: "from-emerald-400 to-teal-600",
    cover: undefined,
    en: { label: "Travel", blurb: "Stories and photos from places around the world." },
    ua: { label: "Подорожі", blurb: "Розповіді та фото з різних куточків світу." },
  },
  life: {
    gradient: "from-violet-400 to-purple-600",
    cover: undefined,
    en: { label: "Life", blurb: "Reflections, opinions, and things I find worth writing about." },
    ua: { label: "Життя", blurb: "Роздуми, думки та те, про що варто написати." },
  },
} as const satisfies Record<Category, { gradient: string; cover: string | undefined } & Record<Lang, { label: string; blurb: string }>>;

export const SITE = {
  author: "Sergii Gulenok",
  authorPhoto: "/assets/images/2026/02/sergii-and-denzel.jpg",
} as const;
