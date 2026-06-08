import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  outputFileTracingIncludes: {
    "/api/vault/download/[token]": ["./vault-files/**/*.zip"],
  },
};

export default nextConfig;