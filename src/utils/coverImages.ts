const categoryFallbackImages: Record<string, string> = {
  "software-engineering": "/assets/images/2023/08/20260220195449.png",
  "travel": "",
  "life": "",
};

export function getCoverImage(image?: string, category?: string): string | undefined {
  return image || categoryFallbackImages[category ?? ""] || undefined;
}
