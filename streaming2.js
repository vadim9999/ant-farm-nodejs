const child_process = require("child_process");
const raspberryPiCamera = require("raspberry-pi-camera-native");

// destination = "rtmp://a.rtmp.youtube.com/live2/[]"; //stream token redacted
// child = child_process.spawn("ffmpeg", [
//   "-f",
//   "h264",
//   "-r",
//   "25",
//   "-i",
//   "-",
//   "-itsoffset",
//   "5.5",
//   "-fflags",
//   "nobuffer",
//   "-f",
//   "lavfi",
//   "-i",
//   "anullsrc",
//   "-c:v",
//   "copy",
//   "-c:a",
//   "aac",
//   "-strict",
//   "experimental",
//   "-f",
//   "flv",
//   destination,
// ]);

// // console.log("child", child.stdout);

// child.stderr.pipe(process.stdout);

raspberryPiCamera.start({
  width: 640,
  height: 480,
  fps: 3,
  //   quality: 15,
  encoding: "H264",
});

// raspberryPiCamera.on("frame", (frame) => {
//   console.log("frame", frame);
// });
// const runApp = async () => {
//   let frameHandler = (frameData) => {
//     console.log("frameData", frameData);
//     child.stdin.write(data);
//   };

//   let frameEmitter = raspberryPiCamera.on("frame", frameHandler);

//   // Wait for 5 seconds
//   await new Promise((resolve) => setTimeout(() => resolve(), 500000));
//   frameEmitter.removeListener("frame", frameHandler);
// };

// runApp();
