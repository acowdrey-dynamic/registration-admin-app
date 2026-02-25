import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    typedRoutes: true,
    reactStrictMode: true,
    distDir: 'build',
    output: 'standalone',
}

export default nextConfig
