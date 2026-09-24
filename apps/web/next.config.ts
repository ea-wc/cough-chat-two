import type { NextConfig } from "next";

// Proxy browser API requests to the internal API. Used by the single-container
// Fly deployment (where the API is on localhost:4000 in the same container) and
// harmless in local dev (where the web calls the API directly via an absolute URL).
const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
