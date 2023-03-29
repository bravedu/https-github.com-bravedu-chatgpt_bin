/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // async rewrites() {
  //   return {
  //     fallback: [
  //       {
  //         source: '/:path*',
  //         destination: `https://www.higlo.cn/:path*`,
  //       },
  //     ],
  //   }
  // },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
}
