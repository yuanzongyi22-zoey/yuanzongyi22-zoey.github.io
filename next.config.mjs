/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：npm run build 会产出 out/ 目录，可直接上传到任何静态托管。
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
