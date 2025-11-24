export function defaultSizeForDataType(type: string, canvasWidth: number) {
  switch (type) {
    case "header":
      return { w: canvasWidth, h: 80 };
    case "footer":
      return { w: canvasWidth, h: 60 };
    case "slider":
      return { w: canvasWidth, h: 400 };
    case "text-content":
      return { w: 650, h: 100 };
    case "card":
      return { w: 300, h: 200 };
    default:
      return { w: 200, h: 100 };
  }
}
