import { Separator } from "@/components/ui/Separator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = { title: "Foundations/Tokens" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const colours = [
  {
    name: "paper",
    case: "bg-paper | text-paper",
    className: "bg-paper",
    hex: "#FBF8F1",
  },
  {
    name: "salmon",
    case: "bg-salmon | text-salmon",
    className: "bg-salmon",
    hex: "#091121",
  },
  {
    name: "ink",
    case: "bg-ink | text-ink",
    className: "bg-ink",
    hex: "#FF887A",
  },
];

export const Colours: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p>Surfaces</p>
      <div className="grid grid-cols-3 gap-2">
        {colours.map((colour) => (
          <div
            key={colour.name}
            className="grid grid-cols-1 overflow-hidden rounded-xl border"
          >
            <div className={`${colour.className} h-22 border-b-2`} />
            <div className="bg-white px-4 py-2">
              <p>{colour.name}</p>
              <p className="text-sm">{colour.case}</p>
              <p className="text-xs">{colour.hex}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />
    </div>
  ),
};

const fonts = ["font-heading", "font-sans", "font-mono"];

const textSizes = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
];

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {textSizes.map((size) => (
        <p key={size} className={size}>
          {size}: The quick brown fox jumps over the lazy dog
        </p>
      ))}

      <Separator />

      {fonts.map((font) => (
        <p key={font} className={`${font} text-2xl`}>
          {font}: The quick brown fox jumps over the lazy dog
        </p>
      ))}

      <Separator />

      <p className="text-muted-foreground">
        text-muted-foreground: secondary text
      </p>
    </div>
  ),
};

const tileRamp = [
  {
    name: "bg-tile-0",
    range: "0",
  },
  {
    name: "bg-tile-1",
    range: "1-3",
  },
  {
    name: "bg-tile-2",
    range: "4-6",
  },
  {
    name: "bg-tile-3",
    range: "7-9",
  },
  {
    name: "bg-tile-4",
    range: "10+",
  },
];

export const Tileramp: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-2">
      {tileRamp.map((tile) => (
        <div
          key={tile.name}
          className="grid grid-cols-1 overflow-hidden rounded-xl border"
        >
          <div className={`${tile.name} h-22 border-b-2`} />
          <div className="p-2">
            <p>{tile.range}</p>
            <p>{tile.name}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

const categoryColours = [
  {
    name: "cat-indigo",
    case: "bg-cat-indigo | text-cat-indigo",
    className: "bg-cat-indigo",
    hex: "#5b67c2",
  },
  {
    name: "cat-blue",
    case: "bg-cat-blue | text-cat-blue",
    className: "bg-cat-blue",
    hex: "#3080bc",
  },
  {
    name: "cat-sky",
    case: "bg-cat-sky | text-cat-sky",
    className: "bg-cat-sky",
    hex: "#14938d",
  },
  {
    name: "cat-teal",
    case: "bg-cat-teal | text-cat-teal",
    className: "bg-cat-teal",
    hex: "#429c5a",
  },
  {
    name: "cat-olive",
    case: "bg-cat-olive | text-cat-olive",
    className: "bg-cat-olive",
    hex: "#849644",
  },
  {
    name: "cat-amber",
    case: "bg-cat-amber | text-cat-amber",
    className: "bg-cat-amber",
    hex: "#d9a02c",
  },
  {
    name: "cat-rose",
    case: "bg-cat-rose | text-cat-rose",
    className: "bg-cat-rose",
    hex: "#d25579",
  },
  {
    name: "cat-plum",
    className: "bg-cat-plum",
    hex: "#904895",
  },
  {
    name: "cat-slate",
    case: "bg-cat-slate | text-cat-slate",
    className: "bg-cat-slate",
    hex: "#657383",
  },
  {
    name: "cat-sand",
    case: "bg-cat-sand | text-cat-sand",
    className: "bg-cat-sand",
    hex: "#b9a083",
  },
];

export const CategoryColours: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-2">
      {categoryColours.map((colour) => (
        <div
          key={colour.name}
          className="grid grid-cols-1 overflow-hidden rounded-xl border"
        >
          <div className={`${colour.className} h-22 border-b-2`} />
          <div className="bg-white px-4 py-2">
            <p>{colour.name}</p>
            <p className="text-sm">{colour.case}</p>
            <p className="text-xs">{colour.hex}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};
