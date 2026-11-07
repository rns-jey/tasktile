import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Checkbox } from "@/components/atoms/Checkbox";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    defaultChecked: { control: "boolean", description: "Starts ticked" },
    disabled: { control: "boolean" },
    "aria-invalid": {
      control: "boolean",
      description: "Shows the error style",
    },
  },
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Playground: flip the props in the Controls panel.
export const Default: Story = {
  args: { defaultChecked: false, disabled: false },
};

// Every state side by side. Use this one while editing global.css.
// Press Tab inside the preview to see the keyboard focus ring.
const states = [
  { label: "Unchecked", props: {} },
  { label: "Checked", props: { defaultChecked: true } },
  { label: "Disabled", props: { disabled: true } },
  {
    label: "Disabled + checked",
    props: { disabled: true, defaultChecked: true },
  },
  { label: "Invalid", props: { "aria-invalid": true } },
  {
    label: "Invalid + checked",
    props: { "aria-invalid": true, defaultChecked: true },
  },
];

export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      {states.map((s) => (
        <label key={s.label} className="flex items-center gap-3 text-sm">
          <Checkbox {...s.props} />
          {s.label}
        </label>
      ))}
    </div>
  ),
};

// How it looks in a task row. The title uses `peer-data-checked:` to cross
// itself out when the box is ticked, with no React state needed.
export const InTaskRow: Story = {
  render: () => (
    <div className="flex w-80 flex-col divide-y">
      {[
        "Fix heat map color on mobile",
        "Update app styling",
        "Add search task",
      ].map((task, i) => (
        <label key={task} className="flex items-center gap-3 py-3 text-sm">
          <Checkbox defaultChecked={i === 1} />
          <span className="peer-data-checked:text-muted-foreground peer-data-checked:line-through">
            {task}
          </span>
        </label>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div>
      <Checkbox disabled />
      <Checkbox disabled checked />
    </div>
  ),
};
