/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://www.love4lovesake.com' : '', // production 일때 prefix 경로
  trailingSlash: true, // 빌드 시 폴더 구조 그대로 생성하도록
  images: { unoptimized: true },
  // output: 'export',
  // images: {
  //   loader: 'imgix',
  //   path: 'https://www.love4lovesake.com',
  // },
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };

  //   return config;
  // },
};

export default nextConfig;
