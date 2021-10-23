const express = require("express");
const app = express();
const path = require("path");
const FrameEmitter = required('./server/FrameEmmiter');

/* app.use(express.static(path.join(__dirname, "./build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
}); */

app.listen(3000, () => console.log(`Listening on port 3000!`));


// create a singleton emitter

// const runApp = async () => {
/* const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
    width: 1280,
    height: 720,
    fps: 15,
  });

  await streamCamera.startCapture();

  const videoStream = streamCamera.createStream(); */

// class MyCamera {
//   constructor() {
//       if(!this.entity){
//         this.entity = new FrameEmitter();
//       }

//   }
// }
let frameEmitter = null;
let users = 0;
app.get("/stream.mjpg", (req, res) => {
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
  /* 
    let frameEmitter = videoStream.on('frame', frameHandler);
  
    req.on('close', () => {
      frameEmitter.removeListener('frame', frameHandler);
      console.log('Connection terminated: ' + req.hostname);
    }); */

  if (!frameEmitter) {
    frameEmitter = new FrameEmitter();
  }

  users++;
  console.log("users", users);
  frameEmitter.on(frameHandler);

  req.on("close", () => {
    frameEmitter.off(frameHandler);
    console.log("off");
    users--;
    if (!users) {
      frameEmitter.stop().then((data) => {
        console.log("successfully closed", data);
      });
      frameEmitter = null;
    }
    //   if (isVerbose) console.log("Connection terminated: " + req.hostname);
  });
});
// };
// runApp();
