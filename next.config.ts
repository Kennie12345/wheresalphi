import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure Turbopack as the default bundler
  turbopack: {
    // Set workspace root to silence multiple lockfiles warning
    root: '/Users/kennethcheung/Documents/code/wheresalphi',
  },

  webpack: (config, { isServer }) => {
    // Handle mind-ar and other Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
    }

    // Handle WebAssembly files for mind-ar
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
};

export default nextConfig;
