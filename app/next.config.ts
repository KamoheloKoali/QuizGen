import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Exclude test files from pdf-parse package
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignore test files during bundling
    config.module.rules.push({
      test: /node_modules\/pdf-parse\/test\//,
      use: 'null-loader'
    });

    return config;
  },
};

export default nextConfig;
