const { StreamCamera, Codec } = require("pi-camera-connect");
const path = require("path");
let Emitter = require("component-emitter");

class FrameEmitter {
  constructor() {
    this.streamCamera = new StreamCamera({
      codec: Codec.MJPEG,
      width: 1280,
      height: 720,
      fps: 15,
    });
    this._callbacks = {};
    this.streamCamera.startCapture().then(() => this._takePic());
    this.emitter = new Emitter();
  }
  _takePic() {
    this.lastTime = process.hrtime();
    this.streamCamera.takeImage().then((img) => this._onFrame(img));
  }
  _onFrame(data) {
    this.emitter.emit("frame", data);
    this._takePic();
  }
  on(fn) {
    this.emitter.on("frame", fn);
  }
  off(fn) {
    console.log("off", fn);
    this.emitter.off("frame", fn);
  }
  stop() {
    return this.streamCamera.stopCapture(); // returns a promise!
  }
}

module.exports = FrameEmitter;
