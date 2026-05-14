const categoryFallbackImages: Record<string, string> = {
  "software-engineering": "/assets/images/common/cyberpunk-2100.png",
  "travel": "",
  "life": "",
};

export function getCoverImage(image?: string, category?: string): string | undefined {
  return image || categoryFallbackImages[category ?? ""] || undefined;
}
