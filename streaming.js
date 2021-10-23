const FrameEmitter = require("./server/FrameEmmiter");
const { StreamCamera, Codec } = require("pi-camera-connect");

const child_process = require("child_process");

destination = "rtmp://a.rtmp.youtube.com/live2/[]"; //stream token redacted
child = child_process.spawn("ffmpeg", [
  "-f",
  "h264",
  "-r",
  "25",
  "-i",
  "-",
  "-itsoffset",
  "5.5",
  "-fflags",
  "nobuffer",
  "-f",
  "lavfi",
  "-i",
  "anullsrc",
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-strict",
  "experimental",
  "-f",
  "flv",
  destination,
]);

// console.log("child", child.stdout);

child.stderr.pipe(process.stdout);

const runApp = async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.H264,
    width: 854,
    height: 480,
    fps: 25,
  });

  const videoStream = streamCamera.createStream();

  // const writeStream = fs.createWriteStream('video-stream.h264');

  // Pipe the video stream to our video file
  // videoStream.pipe(writeStream);

  await streamCamera.startCapture();

  // We can also listen to data events as they arrive
  videoStream.on("data", (data) => {
    child.stdin.write(data);
    return console.log("New data", data);
  });
  videoStream.on("end", (data) => console.log("Video stream has ended"));

  // Wait for 5 seconds
  await new Promise((resolve) => setTimeout(() => resolve(), 500000));
  await streamCamera.stopCapture();
};

runApp();

// frameEmitter = new FrameEmitter();

// (function loop() {
//   setTimeout(loop, 1000 / 30); //run loop at 30 fps
//   //   const data = Array.from({length: 426 * 240 * 4}, () => ~~(Math.random() * 0xff)); //create array with random data
//   proc.stdin.write(Buffer.from(data)); //convert array to buffer and send it to ffmpeg
// })();

// let frameHandler = (frameData) => {
//   console.log("frameData", frameData);
// //   child.stdin.write(frameData);
// };

// frameEmitter.on(frameHandler);

// frameEmitter.off(frameHandler);
// frameEmitter.stop().then((data) => {
//   console.log("successfully closed", data);
// });
