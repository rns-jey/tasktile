import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    staleTimes: { dynamic: 30 }, // reuse a visited page for 30s
  },
};

export default nextConfig;
