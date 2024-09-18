/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vivaidealfinalbucket.s3.us-west-2.amazonaws.com", port: "" },
      { protocol: "https", hostname: "cdn.sanity.io", port: "" },
      { protocol: "https", hostname: "d3pkwgsrr79pi4.cloudfront.net", port: "" },
      { protocol: "https", hostname: "images.vivaideal.com", port: "" },
    ],
  },
  async headers() {
    return [
      {
        source: "/articles",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate=59",
          },
        ],
        source: "/[locale]/articles",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
