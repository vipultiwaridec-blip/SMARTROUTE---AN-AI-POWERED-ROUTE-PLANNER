import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev log would print every server-action argument, including passwords and private notes (02-BACKEND §8).
  logging: { serverFunctions: false },
};

export default nextConfig;
