export type ElementType =
  | "header"
  | "footer"
  | "card"
  | "text-content"
  | "slider";

export interface HeaderContent {
  text: string;
  style: "default" | "minimal" | "bold";
}

export interface CardContent {
  title: string;
  description: string;
  image: string | null;
}

export interface SliderContent {
  title?: string;
  slides: string[];
}

export interface TextContent {
  html: string;
  plainText: string;
}

export interface FooterContent {
  copyright: string;
  links: string[];
}

export interface HeaderElement {
  id: string;
  type: "header";
  position: Position;
  content: HeaderContent;
}

export interface CardElement {
  id: string;
  type: "card";
  position: Position;
  content: CardContent;
}

export interface TextElement {
  id: string;
  type: "text-content";
  position: Position;
  content: TextContent;
}

export interface FooterElement {
  id: string;
  type: "footer";
  position: Position;
  content: FooterContent;
}

export interface SliderElement {
  id: string;
  type: "slider";
  position: Position;
  content: SliderContent;
}

export interface Position {
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  zIndex: number;
  fixed?: boolean;
}

export interface ResponsiveSpec {
  mobile?: Partial<Position>;
  tablet?: Partial<Position>;
  desktop?: Partial<Position>;
}

export interface ElementContent {
  text?: string;
  title?: string;
  description?: string;
  image?: string | null;
  html?: string;
  [k: string]: unknown;
}

export type BuilderElement =
  | HeaderElement
  | CardElement
  | TextElement
  | FooterElement
  | SliderElement;

export interface BuilderState {
  elements: BuilderElement[];
  selectedId: string | null;
}
