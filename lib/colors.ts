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
