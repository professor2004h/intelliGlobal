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

  // EMERGENCY WEBPACK CONFIGURATION - Zero chunk splitting
  webpack: (config, { dev, isServer, webpack }) => {
    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (dev) {
      // EMERGENCY: Completely disable ALL chunk splitting and optimization
      config.optimization = {
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
        concatenateModules: false,
        usedExports: false,
        sideEffects: false,
      };

      // EMERGENCY: Single bundle configuration
      config.output = {
        ...config.output,
        chunkLoadTimeout: 60000,
        crossOriginLoading: false,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].js',
      };

      // EMERGENCY: Disable all module resolution optimizations
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        cacheWithContext: false,
      };

      // EMERGENCY: Disable caching
      config.cache = false;
    }

    return config;
  },

  // EMERGENCY: Disable on-demand entries
  ...(isDev && {
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60, // 1 hour
      pagesBufferLength: 10,
    },
  }),

  // Production configuration for standalone output
  output: 'standalone',
};

export default nextConfig;
