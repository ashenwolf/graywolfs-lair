import type { Lang } from "../constants/labels";

const LOCALE: Record<Lang, string> = {
  en: "en-US",
  ua: "uk-UA",
};

export const formatDate = (date: Date, lang: Lang, month: "short" | "long" = "short") =>
  date.toLocaleDateString(LOCALE[lang], { year: "numeric", month, day: "numeric" });

export const formatDateShort = (date: Date, lang: Lang) =>
  date.toLocaleDateString(LOCALE[lang], { year: "numeric", month: "short" });
