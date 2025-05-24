import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/chat",
        destination: "/",
      },
    ];
  },
  images: {
    remotePatterns: [new URL("http://localhost:9000/nestjs-chat/**")],
  },
};

export default nextConfig;
