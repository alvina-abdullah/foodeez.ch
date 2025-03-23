/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'randomuser.me',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh5.googleusercontent.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'photos.hotelbeds.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'placehold.co',
          port: '',
          pathname: '/**',
        }
      ],
    },
  };
  
  export default nextConfig;
  