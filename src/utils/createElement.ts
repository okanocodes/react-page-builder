import type {
  BuilderElement,
  HeaderContent,
  CardContent,
  TextContent,
  FooterContent,
  SliderContent,
} from "../types";

export function createElement<T extends BuilderElement["type"]>(
  type: T,
  position: { x: number; y: number },
  opts?: { cardIndex?: number }
): Extract<BuilderElement, { type: T }> {
  const id = `elem_${type}_${crypto.randomUUID()}`;

  const contentByType: {
    header: HeaderContent;
    card: CardContent;
    "text-content": TextContent;
    footer: FooterContent;
    slider: SliderContent;
  } = {
    header: {
      text: "Site Başlığı",
      style: "default",
    },

    card: (() => {
      const idx = opts?.cardIndex ?? 1;
      return {
        title: `Card ${idx}`,
        description: `${idx}. card içerik açıklaması`,
        image: null,
      };
    })(),

    "text-content": {
      html: "Metin içeriği buraya gelecek",
      plainText: "Metin içeriği buraya gelecek",
    },

    footer: {
      copyright: "© 2024 Test Builder",
      links: [] as string[],
    },
    slider: {
      title: "Örnek Slider",
      slides: [
        "https://picsum.photos/id/1/800/400",
        "https://picsum.photos/id/2/800/400",
        "https://picsum.photos/id/3/800/400",
      ],
    },
  };

  const defaultSizeByType: Record<
    BuilderElement["type"],
    { width: number | string; height: number | string }
  > = {
    header: { width: "100%", height: 80 },
    footer: { width: "100%", height: 60 },
    card: { width: 300, height: 200 },

    "text-content": { width: 300, height: 80 },
    slider: { width: 800, height: 400 },
  };

  const size = defaultSizeByType[type];
  const content = contentByType[type];

  return {
    id,
    type,
    content,
    position: {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      zIndex: 1,
    },
  } as Extract<BuilderElement, { type: T }>;
}
