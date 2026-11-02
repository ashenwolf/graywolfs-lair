import { LOCALES, type Lang } from "../constants/site";

/** A site path in `lang`: `localPath("ua", "/tag/x")` → `/ua/tag/x`; the home page is `/` or `/ua`. */
export const localPath = (lang: Lang, path = "") => `${LOCALES[lang].prefix}${path}` || "/";

/** Absolute URL on the language's own domain, for canonical and Open Graph tags. */
export const absoluteUrl = (lang: Lang, path: string) =>
  path.startsWith("http") ? path : new URL(path, LOCALES[lang].origin).href;

/** Date-based article path, `/YYYY/MM/DD/slug`; the slug is the file name, already slugified by Astro. */
export const articlePath = (id: string, date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `/${yyyy}/${mm}/${dd}/${id.split("/").at(-1)}`;
};

/** Site navigation, shared by the header and the footer. */
export const nav = (lang: Lang) => {
  const { ui, other } = LOCALES[lang];
  return {
    links: [
      { href: localPath(lang), label: ui.home },
      { href: localPath(lang, "/photography"), label: ui.photography },
      { href: localPath(lang, "/cv"), label: ui.cv },
    ],
    toggle: { lang: other, href: localPath(other), label: other.toUpperCase() },
  };
};

/** The page at `pathname` in the other language, on that language's domain. Articles have no translation: home. */
export const crossDomainHref = (lang: Lang, pathname: string) => {
  const { prefix, other } = LOCALES[lang];
  const rest = /^\/\d{4}\/\d{2}\/\d{2}\//.test(pathname) ? "/" : pathname.slice(prefix.length);
  return absoluteUrl(other, localPath(other, rest === "/" ? "" : rest));
};

/** Hosts where the language toggle switches domain. */
export const PROD_HOSTS = Object.values(LOCALES).map(({ origin }) => new URL(origin).hostname);
