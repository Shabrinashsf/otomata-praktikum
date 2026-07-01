import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Static export — embedded by Go binary
  trailingSlash: true,   // /praktikum-1/ → frontend/out/praktikum-1/index.html
  images: {
    unoptimized: true,   // Required for static export
  },
};

export default nextConfig;
