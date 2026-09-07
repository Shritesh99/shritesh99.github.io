import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages: `next build` emits ./out, deployed by
  // .github/workflows (master). No server — everything prerendered.
  output: 'export',
  images: { unoptimized: true },
  experimental: {
    // NOTE: '@react-three/fiber' must NOT be listed here — the import rewrite
    // creates a second module instance, so @react-spring/three registers its
    // frame-loop effect on a fiber copy no Canvas drives (springs never move).
    optimizePackageImports: ['three', '@react-three/drei'],
    // app/global-not-found.tsx → out/404.html (GitHub Pages serves it for
    // any unknown URL). Needed because the route groups have no root layout.
    globalNotFound: true,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  webpack: (config) => {
    // Add rule for GLSL files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    // Site content: YAML parsed at BUILD time and inlined into the bundle —
    // nothing is fetched at runtime, so content is loaded before the site is.
    config.module.rules.push({
      test: /\.ya?ml$/,
      exclude: /node_modules/,
      use: 'yaml-loader',
    });
    return config;
  },
};

export default nextConfig;
