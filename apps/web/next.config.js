/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  images: { unoptimized: true },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};
module.exports = nextConfig;
