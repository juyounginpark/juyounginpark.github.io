export const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export const dist2 = (x1: number, y1: number, x2: number, y2: number) =>
  (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
