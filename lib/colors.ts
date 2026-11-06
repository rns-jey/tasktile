export const categColors = [
  "#5b67c2",
  "#3080bc",
  "#14938d",
  "#429c5a",
  "#849644",
  "#d9a02c",
  "#d25579",
  "#904895",
  "#657383",
  "#b9a083",
] as const;

export type CategColor = (typeof categColors)[number];

export function heatClass(count: number) {
  if (count >= 10) return "bg-tile-4 text-white";
  if (count >= 7) return "bg-tile-3 text-white";
  if (count >= 4) return "bg-tile-2";
  if (count >= 1) return "bg-tile-1";
  return "bg-tile-0";
}
