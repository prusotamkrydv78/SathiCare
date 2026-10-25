import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    // Same-origin proxy: the browser only ever talks to the Next.js origin,
    // so auth cookies stay first-party (no CORS, no SameSite pain).
    return [
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
      { source: "/hubs/:path*", destination: `${API_URL}/hubs/:path*` },
    ];
  },
};

export default nextConfig;
