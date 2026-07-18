import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    // Strip trailing slash if present to avoid double slashes in proxied URLs
    const sanitizedBackendUrl = backendUrl.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${sanitizedBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;