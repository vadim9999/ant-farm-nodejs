const { Blob } = require("buffer");
const express = require("express");
const app = express();
const path = require("path");
const { StreamCamera, Codec } = require("pi-camera-connect");

const runApp = async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
    width: 640,
    height: 480,
    fps: 15,
  });

  await streamCamera.startCapture();
  streamCamera.on("frame", (frame) => {
    console.log("frame", frame);
  });

  const videoStream = streamCamera.createStream();
};
runApp();
