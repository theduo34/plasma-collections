import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Convex file storage serves from a per-deployment *.convex.cloud
    // subdomain — this covers dev and prod deployments alike.
    remotePatterns: [{ protocol: "https", hostname: "**.convex.cloud", pathname: "/api/storage/**" }],
  },
};

export default nextConfig;
