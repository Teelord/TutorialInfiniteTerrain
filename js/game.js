var config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    SceneMain
  ],
  pixelArt: true,
  roundPixels: true
};
var chunkSize = 10;
var chunkDistanceToRender = 4;
var maxSpeed = 25;
var speedIncrements = 2;
var granularity = 800;
var zoom = 2;
var minZoom = .2;
var game = new Phaser.Game(config);
