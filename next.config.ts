import path from "node:path";
import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH when hosting under a sub-path,
// e.g. "/k8s-runtime-aware-ebpf-orchestration" for GitHub Pages project sites.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname) },
};

export default config;
