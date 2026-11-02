import { LOCALES, type Lang } from "../constants/site";

const STYLES = {
  short: { year: "numeric", month: "short", day: "numeric" },
  long: { year: "numeric", month: "long", day: "numeric" },
  month: { year: "numeric", month: "short" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

/** A date in the language's locale: short "May 9, 2026", long "May 9, 2026" with full month, month "May 2026". */
export const formatDate = (date: Date, lang: Lang, style: keyof typeof STYLES = "short") =>
  date.toLocaleDateString(LOCALES[lang].dateLocale, STYLES[style]);
