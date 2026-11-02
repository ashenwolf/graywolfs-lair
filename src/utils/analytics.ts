import type { Lang } from "../constants/labels";

// Every PostHog event the site sends, with its properties. The listener in posthog.astro reads them from the DOM.
type Events = {
  article_read: { title: string; category?: string; tags: string[]; lang: Lang };
  tag_clicked: { tag: string; article_title: string };
  cv_viewed: Record<string, never>;
  social_link_clicked: { platform: string; page?: "cv" };
  language_switched: { to_lang: Lang };
  article_card_clicked: { title: string; category?: string; href: string };
  category_more_clicked: { section: string; href: string };
};

/** Attributes that make a click on this element send `event`. */
export const onClick = <E extends keyof Events>(event: E, props: Events[E]) => ({
  "data-ph-click": event,
  "data-ph-props": JSON.stringify(props),
});

/** Attributes that make loading a page with this element send `event`. */
export const onView = <E extends keyof Events>(event: E, props: Events[E]) => ({
  "data-ph-view": event,
  "data-ph-props": JSON.stringify(props),
});
