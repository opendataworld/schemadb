import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "schema.org" },
      { hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
