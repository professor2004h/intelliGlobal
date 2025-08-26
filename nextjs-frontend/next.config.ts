import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Basic image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // EMERGENCY: Disable ALL experimental features
  experimental: {},

  // Basic settings
  compress: true,
  poweredByHeader: false,

  // Simplified webpack configuration for stability
  webpack: (config, { dev }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Only apply minimal optimizations in development
    if (dev) {
      // Increase chunk loading timeout for slower systems
      config.output = {
        ...config.output,
        chunkLoadTimeout: 120000, // 2 minutes
      };

      // Ensure proper module resolution
      config.resolve = {
        ...config.resolve,
        symlinks: false,
      };
    }

    return config;
  },



  // Production configuration for standalone output
  output: 'standalone',
};

export default nextConfig;
