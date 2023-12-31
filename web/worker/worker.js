import WebMWriter from "../modules/webm-writer2.js";
import { canvasRenderer } from "./canvasRenderer.js";
import { mp4Demuxer } from "./mp4Demuxer.js";
import { videoProcessor } from "./videoProcessor.js";

// VIDEO RESOLUTION
const qvga = {
  width: 320,
  height: 240,
};

const vga = {
  width: 640,
  height: 480,
};

const hd = {
  width: 1280,
  height: 720,
};

// CODEC CONFIG
const webm = {
  codec: "vp09.00.10.08",
  pt: 4,
  hardwareAcceleration: "prefer-software",
};

const mp4 = {
  codec: "avc1.42002A",
  pt: 1,
  hardwareAcceleration: "prefer-hardware",
  avc: {
    format: "annexb",
  },
};

const encoderConfig = {
  bitrate: 10e6,
  ...qvga,
  ...webm,
};

const webMWriterConfig = {
  codec: "VP9",
  width: encoderConfig.width,
  height: encoderConfig.height,
  bitrate: encoderConfig.bitrate,
};

const MP4Demuxer = new mp4Demuxer();
const VideoProcessor = new videoProcessor({
  MP4Demuxer,
  WebMWriter: new WebMWriter(webMWriterConfig),
});

onmessage = async ({ data }) => {
  await VideoProcessor.start({
    file: data.file,
    encoderConfig,
    renderFrame: canvasRenderer(data.canvas),
    sendMessage: self.postMessage,
  });
};

onerror = (err) => console.error("worker", err);
