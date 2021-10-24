const { Blob } = require("buffer");
const express = require("express");
const app = express();
const path = require("path");
const { StreamCamera, Codec } = require("pi-camera-connect");

app.listen(3000, () => console.log(`Listening on port 3000!`));

let streamCamera = null;
let users = 0;

app.get("/stream.mjpg", async (req, res) => {
  if (!streamCamera) {
    streamCamera = new StreamCamera({
      codec: Codec.MJPEG,
      width: 640,
      height: 480,
      fps: 15,
    });
    await streamCamera.startCapture();
    const videoStream = streamCamera.createStream();
    console.log("init");
  }

  console.log("call get");
  res.writeHead(200, {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0",
    Pragma: "no-cache",
    Connection: "close",
    "Content-Type": "multipart/x-mixed-replace; boundary=--myboundary",
  });

  console.log("Accepting connection: " + req.hostname);
  let isReady = true;

  let frameHandler = (frameData) => {
    // console.log("frameData", frameData);
    try {
      if (!isReady) {
        return;
      }
      isReady = false;
      // console.log("Writing frame: " + frameData.length);
      res.write(
        `--myboundary\nContent-Type: image/jpg\nContent-length: ${frameData.length}\n\n`
      );
      res.write(frameData, function () {
        isReady = true;
      });
    } catch (ex) {
      console.log("Unable to send frame: " + ex);
    }
  };

  let frameEmitter = streamCamera.on("frame", frameHandler);
  users++;
  console.log("users", users);
  // let start = true;

  // while (start) {
  //     console.log("in while");
  //   try {
  //     if (!isReady) {
  //       return;
  //     }
  //     isReady = false;

  //     const image = await streamCamera.takeImage();
  //     console.log("take image");
  //     res.write(
  //       `--myboundary\nContent-Type: image/jpg\nContent-length: ${image.length}\n\n`
  //     );
  //     res.write(image, function () {
  //         console.log("send", true);
  //       isReady = true;
  //     });
  //     // req.on("close", () => {
  //     //   //   frameEmitter.removeListener("frame", frameHandler);
  //     //   start = false;
  //     //   console.log("Connection terminated: " + req.hostname);
  //     // });
  //     console.log("start", start);
  //   } catch (ex) {
  //     console.log("Unable to send frame: " + ex);
  //     start = false;
  //   }
  // }
  // await streamCamera.stopCapture();

  req.on("close", async () => {
    console.log("onClose");
    frameEmitter.removeListener("frame", frameHandler);
    users--;
    if (users === 0) {
      await streamCamera.stopCapture();
      streamCamera = null;
    }
    console.log("Connection terminated: " + req.hostname);
  });
});
