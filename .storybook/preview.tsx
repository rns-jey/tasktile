import { fontVariables } from "@/app/fonts";
import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

const preview: Preview = {
  decorators: [
    (Story, { parameters }) => {
      const { pageLayout } = parameters;

      switch (pageLayout) {
        case "page":
          return (
            <div className="page-layout">
              <Story />
            </div>
          );
        case "page-mobile":
          return (
            <div className="page-mobile-layout">
              <Story />
            </div>
          );
        default:
          return (
            <div className={fontVariables}>
              <Story />
            </div>
          );
      }
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
