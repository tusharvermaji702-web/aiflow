/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ffmpeg.wasm requires these headers (SharedArrayBuffer support) to work.
  // Scoped only to the video/audio tool pages so the rest of the site is
  // unaffected — applying this globally can break cross-origin resources
  // like fonts or third-party embeds elsewhere on the site.
  async headers() {
    const crossOriginIsolationHeaders = [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
    ];
    const ffmpegRoutes = [
      "/utilities/video-trimmer",
      "/utilities/audio-trimmer",
      "/utilities/extract-audio",
      "/utilities/audio-converter",
    ];
    return ffmpegRoutes.map((source) => ({
      source,
      headers: crossOriginIsolationHeaders,
    }));
  },
};

module.exports = nextConfig;
