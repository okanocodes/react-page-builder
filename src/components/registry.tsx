import Header from "./elements/Header";
import Card from "./elements/Card";
import Text from "./elements/Text";
import Footer from "./elements/Footer";
import Simplelider from "./elements/Slider";

export const ELEMENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  header: Header,
  card: Card,
  "text-content": Text,
  footer: Footer,
  slider: Simplelider,
};
