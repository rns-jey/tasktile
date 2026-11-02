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
  if (count >= 10) return "bg-[#963118] text-white";
  if (count >= 7) return "bg-[#cf6139] text-white";
  if (count >= 4) return "bg-[#eb9a75]";
  if (count >= 1) return "bg-[#f3cbb5]";
  return "bg-[#ebe5de]";
}
