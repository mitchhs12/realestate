/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vivaidealfinalbucket.s3.us-west-2.amazonaws.com", port: "" },
      { protocol: "https", hostname: "cdn.sanity.io", port: "" },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
