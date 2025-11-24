export const toPercent = (valuePx: number, totalPx: number) =>
  (valuePx / totalPx) * 100;

export const snapToGrid = (x: number, y: number, gridSize: number) => {
  const snap = (v: number) => Math.round(v / gridSize) * gridSize;
  return { x: snap(x), y: snap(y) };
};

/**
 * Simple rectangle overlap test
 */
export const overlaps = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) => {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
};

/**
 * Try to find a non-overlapping position by shifting the rectangle right/down in steps.
 * Returns a new {x,y} which fits within canvasWidth/canvasHeight if possible.
 *
 * Strategy:
 *  - start from desired x,y
 *  - attempt shifting by 'step' (usually gridSize) to the right until it fits horizontally,
 *    then when hitting boundary, reset x to original and shift down.
 *  - limit attempts by maxAttempts (to avoid infinite loops)
 */
export function findNonOverlappingPosition(
  desired: { x: number; y: number; w: number; h: number },
  otherRects: { x: number; y: number; w: number; h: number }[],
  options: {
    canvasWidth: number;
    canvasHeight: number;
    step?: number;
    maxAttempts?: number;
  }
): { x: number; y: number } {
  const step = options.step ?? 10;
  const maxAttempts = options.maxAttempts ?? 1000;
  const maxX = Math.max(0, options.canvasWidth - desired.w);
  const maxY = Math.max(0, options.canvasHeight - desired.h);

  let attempt = 0;
  let curX = Math.max(0, Math.min(desired.x, maxX));
  let curY = Math.max(0, Math.min(desired.y, maxY));
  const origX = curX;
  const origY = curY;

  while (attempt < maxAttempts) {
    const a = { x: curX, y: curY, w: desired.w, h: desired.h };
    const collides = otherRects.some((b) => overlaps(a, b));
    if (!collides) {
      return { x: curX, y: curY };
    }

    // try to move right first
    curX += step;
    if (curX > maxX) {
      // wrap to original X and move down
      curX = origX;
      curY += step;
      if (curY > maxY) {
        // if can't fit by moving down, reset to 0 and try scanning left-to-right top-to-bottom
        curY = 0;
        curX = 0;
      }
    }
    attempt++;
  }

  // fallback: return clamped original
  return {
    x: Math.max(0, Math.min(desired.x, maxX)),
    y: Math.max(0, Math.min(desired.y, maxY)),
  };
}

/**
 * Compute drop position from client coords and canvas rect.
 * - raw client -> canvas relative
 * - optional snapping
 */
export function computeDropPosition(
  clientX: number,
  clientY: number,
  canvasRect: { left: number; top: number; width: number; height: number },
  opts: { gridSize?: number; snap?: boolean }
) {
  const rawX = clientX - canvasRect.left;
  const rawY = clientY - canvasRect.top;
  if (opts.snap && opts.gridSize && opts.gridSize > 0) {
    return snapToGrid(Math.max(0, rawX), Math.max(0, rawY), opts.gridSize);
  }
  return { x: Math.max(0, rawX), y: Math.max(0, rawY) };
}
