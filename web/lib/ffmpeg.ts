import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;

/**
 * Loads (once) and returns a shared FFmpeg instance. The ~25MB engine is
 * fetched from a CDN the first time any video/audio tool is used in a
 * session, then reused for subsequent tools without re-downloading.
 */
export async function getFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) {
    if (onProgress) ffmpegInstance.on("progress", ({ progress }) => onProgress(progress));
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => onProgress(progress));
  }

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}
