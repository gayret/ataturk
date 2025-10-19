import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload", // force HTTPS
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // prevent MIME sniffing
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN", // prevent clickjacking
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin", // safer referrer info
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()", // block FLoC & unneeded APIs
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' data: https:;
      font-src 'self' https:;
      connect-src 'self' https:;
      frame-src 'self' https://www.linkedin.com https://www.youtube.com https://platform.twitter.com;
      frame-ancestors 'self';
    `.replace(/\n/g, " "),
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable React Strict Mode to prevent Leaflet double initialization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ataturk-kronolojisi.org",
      },
    ],
  },
  poweredByHeader: false, // hide X-Powered-By
  compress: true, // gzip/brotli
  trailingSlash: false, // SEO-friendly URLs
  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: securityHeaders,
      },
      {
        source: "/data/worldBorder.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=315360000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true, // canonical root
      },
    ];
  },
};

export default nextConfig;
