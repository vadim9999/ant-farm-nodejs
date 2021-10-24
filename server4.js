const express = require("express");
const app = express();
const raspberryPiCamera = require("raspberry-pi-camera-native");

// start capture

app.get("/stream.mjpg", (req, res) => {
  raspberryPiCamera.start({
    width: 640,
    height: 480,
    fps: 30,
    quality: 15,
    encoding: "JPEG",
  });

  res.writeHead(200, {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0",
    Pragma: "no-cache",
    Connection: "close",
    "Content-Type": "multipart/x-mixed-replace; boundary=--myboundary",
  });
  console.log("Accepting connection: " + req.hostname);

  // add frame data event listener

  let isReady = true;

  let frameHandler = (frameData) => {
    try {
      if (!isReady) {
        return;
      }

      isReady = false;

      console.log("Writing frame: " + frameData.length);

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

  let frameEmitter = raspberryPiCamera.on("frame", frameHandler);

  req.on("close", () => {
    frameEmitter.removeListener("frame", frameHandler);
    // raspberryPiCamera.stop();

    console.log("Connection terminated: " + req.hostname);
  });
});

app.listen(3000, () => console.log(`Listening on port ${3000}!`));
