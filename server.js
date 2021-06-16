const { StillCamera, StreamCamera, Codec } = require("pi-camera-connect");
const fs = require("fs");

/* const runApp = async () => {
  const stillCamera = new StillCamera();

  const image = await stillCamera.takeImage();

  fs.writeFileSync("still-image.jpg", image);
};

runApp(); */

/* // Capture 5 seconds of H264 video and save to disk
const runApp = async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.H264,
  });

  const videoStream = streamCamera.createStream();

  const writeStream = fs.createWriteStream("video-stream.h264");

  videoStream.pipe(writeStream);

  await streamCamera.startCapture();

  await new Promise((resolve) => setTimeout(() => resolve(), 5000));

  await streamCamera.stopCapture();
};

runApp(); */

const { exec } = require("child_process");

exec("ls -la", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});