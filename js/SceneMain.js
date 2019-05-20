class SceneMain extends Phaser.Scene {
    constructor() {
        super({
            key: "SceneMain"
        });
    }

    preload() {
        this.load.spritesheet("sprWater", "content/sprWater.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprSand", "content/sprSand.png");
        this.load.image("sprGrass", "content/sprGrass.png");
        this.load.image("sprSnow", "content/sprSnow.png");
    }

    create() {

        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });

        this.chunkSize = chunkSize;
        this.tileSize = 16;
        this.cameraSpeed = {
            x: 0,
            y: 0
        };

        this.cameras.main.setZoom(zoom);
        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.chunks = [];

        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyZoomIn = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
        this.keyZoomOut = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS);

        this.fpsText = this.add.text(10, 10, '', 
        {
            font: '16px Courier',
            fill: '#ffffff'
        });

        this.xMark = this.add.text(this.width / zoom, this.height / zoom, '',  {
            font: '16px Courier',
            fill: '#ffffff'
        });
        this.xMark.setText('X');
        this.xMark.setDepth(1);

        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(1);
    }

    getChunk(x, y) {
        var chunk = null;
        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;
    }

    update(time, delta) {

        var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

        for (var x = snappedChunkX - chunkDistanceToRender; x < snappedChunkX + chunkDistanceToRender; x++) {
            for (var y = snappedChunkY - chunkDistanceToRender; y < snappedChunkY + chunkDistanceToRender; y++) {
                var existingChunk = this.getChunk(x, y);

                if (existingChunk == null) {
                    var newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];

            if (Phaser.Math.Distance.Between(
                    snappedChunkX,
                    snappedChunkY,
                    chunk.x,
                    chunk.y
                ) < chunkDistanceToRender) {
                if (chunk !== null) {
                    chunk.load();
                }
            } else //if (Phaser.Math.Distance.Between(
                //     snappedChunkX,
                //     snappedChunkY,
                //     chunk.x,
                //     chunk.y
                // ) > 1 ) 
                { //&& Math.abs(this.cameraSpeed.x) < 5 && Math.abs(this.cameraSpeed.y) < 5) {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        var oldFollowPoint = {
            x: this.followPoint.x,
            y: this.followPoint.y
        };
        // Thrust
        if (this.keyDown.isDown && this.cameraSpeed.y <= maxSpeed) {
            this.cameraSpeed.y += speedIncrements;
        } else if (this.keyUp.isDown && this.cameraSpeed.x >= -maxSpeed) {
            this.cameraSpeed.y -= speedIncrements;
        // Drag
        } else {
            var ySpeedChange = this.cameraSpeed.y > 0 ? -.1 : this.cameraSpeed.y < 0 ? .1 : 0;
            this.cameraSpeed.y += ySpeedChange;
        }
        // Thrust
        if (this.keyRight.isDown && this.cameraSpeed.x <= maxSpeed) {
            this.cameraSpeed.x += speedIncrements;
        } else if (this.keyLeft.isDown  && this.cameraSpeed.x >= -maxSpeed) {
            this.cameraSpeed.x -= speedIncrements;
        // Drag
        } else {
            var xSpeedChange = this.cameraSpeed.x > 0 ? -.1 : this.cameraSpeed.x < 0 ? .1 : 0;
            this.cameraSpeed.x += xSpeedChange;
        }
        // Stop near zero
        if (this.cameraSpeed.x * this.cameraSpeed.x < .5) {
            this.cameraSpeed.x = 0;
        }
        if (this.cameraSpeed.y * this.cameraSpeed.y < .5) {
            this.cameraSpeed.y = 0;
        }
        this.followPoint.x += this.cameraSpeed.x;
        this.followPoint.y += this.cameraSpeed.y;

        if (this.cameraSpeed.y > maxSpeed) {
            this.cameraSpeed.y = maxSpeed;
        } else if (this.cameraSpeed.y < -maxSpeed) {
            this.cameraSpeed.y = -maxSpeed;
        }
        if (this.cameraSpeed.x > maxSpeed) {
            this.cameraSpeed.x = maxSpeed;
        } else if (this.cameraSpeed.x < -maxSpeed) {
            this.cameraSpeed.x = -maxSpeed;
        }

        this.cameras.main.centerOn(
            this.followPoint.x,
            this.followPoint.y);

        if (this.keyZoomIn.isDown) {
            zoom = zoom + 0.1;
            this.cameras.main.setZoom(zoom);
        }
        if (this.keyZoomOut.isDown && zoom > minZoom) {
            zoom = zoom - 0.1;
            this.cameras.main.setZoom(zoom);
        }

        // Info text
        this.fpsText.setText('Coord: ('+ snappedChunkX + ',' + snappedChunkY + ') ' + game.loop.actualFps.toFixed(2) + 'fps'
            + '\n X Speed: ' + this.cameraSpeed.x.toFixed(1) 
            + '\n Y Speed: ' + this.cameraSpeed.y.toFixed(1));

        this.fpsText.setDepth(1);
        this.fpsText.setScale(1 / zoom);
        this.xMark.setDepth(1);

    }
}
