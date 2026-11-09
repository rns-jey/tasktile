import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";

import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/ui/Label";
import { PlusIcon, Smartphone } from "lucide-react";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const radialSizes = [
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "rounded-4xl",
  "rounded-5xl",
  "rounded-full",
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/arg-types
  argTypes: {
    variant: {
      table: {
        type: {
          summary: "default | outline | secondary | ghost | destructive | link",
        },
      },
      control: "select",
      options: variants,
    },
    size: {
      table: {
        type: {
          summary:
            "default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg",
        },
      },
      control: "select",
      options: sizes,
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MobileSize: Story = {
  name: "Mobile: tap size and text size",
  args: { children: "Add task" },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvas, step }) => {
    const button = canvas.getByRole("button", { name: "Add task" });

    await step(
      "Button is 44px tall, big enough to tap on a phone",
      async () => {
        await expect(button.getBoundingClientRect().height).toBe(44);
      },
    );

    await step("Button text is 16px, readable without zooming", async () => {
      await expect(getComputedStyle(button).fontSize).toBe("16px");
    });
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {variants.map((variant) => (
        <div key={variant} className="grid grid-cols-5 items-center gap-3">
          <Label>{variant}</Label>
          {iconSizes.map((size) => (
            <div className="flex flex-col items-center">
              <Button key={size} variant={variant} size={size}>
                <Smartphone />
              </Button>
              <span className="text-sm">{size}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button aria-invalid>Invalid</Button>
    </div>
  ),
};

export const Radial: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3">
      {radialSizes.map((size) => (
        <Button className={`${size} size-11`}>
          <PlusIcon />
        </Button>
      ))}
    </div>
  ),
};
