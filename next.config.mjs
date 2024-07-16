/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "github.com" },
      { hostname: "m.media-amazon.com" },
    ],
  },
};

export default nextConfig;
