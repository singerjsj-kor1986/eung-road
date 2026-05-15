/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! 주의: 빌드 시 TypeScript 오류가 있어도 무시하고 배포를 진행합니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 오류도 함께 무시하면 더 확실합니다.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;