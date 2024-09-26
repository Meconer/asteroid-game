import { Game } from "./game";
import { GameObject, Turning } from "./gameobject";
import Vector from "./vector";

export class Ship extends GameObject {
  acceleration = 0;
  accelerationStep = 0.01;
  retardationStep = 0.006;
  maxSpeed = 4;
  heading = new Vector(0, -1);
  turningSpeed: number = 2;
  turning: Turning = Turning.none;

  constructor(game: Game) {
    super(game);
  }

  shipShape = [
    new Vector(-10, -8),
    new Vector(10, 0),
    new Vector(-10, 8),
    new Vector(-10, -8),
  ];

  flameShape = [new Vector(-10, -3), new Vector(-14, 0), new Vector(-10, 3)];

  stopAccelerate() {
    this.acceleration = 0;
  }
  startAccelerate() {
    this.acceleration += this.accelerationStep;
  }

  draw = () => {
    super.draw();
    this.game.context.strokeStyle = "#2eb229";
    this.game.context.lineWidth = 2;
    this.game.context.beginPath();
    const drawingCoords = this.shipShape.map((coord) =>
      coord.rotateByVector(this.heading).add(this.pos)
    );
    this.game.context.moveTo(drawingCoords[0].x, drawingCoords[0].y);
    for (let i = 1; i < this.shipShape.length; i++) {
      this.game.context.lineTo(drawingCoords[i].x, drawingCoords[i].y);
    }
    this.game.context.stroke();
    if (this.acceleration) {
      const flameCoords = this.flameShape.map((coord) =>
        coord.rotateByVector(this.heading).add(this.pos)
      );
      this.game.context.beginPath();
      this.game.context.moveTo(flameCoords[0].x, flameCoords[0].y);
      for (let i = 1; i < this.flameShape.length; i++) {
        this.game.context.lineTo(flameCoords[i].x, flameCoords[i].y);
      }
      this.game.context.stroke();
    }
  };

  lastTimestamp = 0;
  update() {
    this.handleKeys();
    this.move(this.travelDirection);
    this.checkForRockHit();
    this.accelerate();
  }

  handleKeys() {
    // Turning left or right
    const aKey = this.game.keysDown.indexOf("a") >= 0;
    const dKey = this.game.keysDown.indexOf("d") >= 0;
    if (aKey) this.turning = Turning.left;
    if (dKey) this.turning = Turning.right;
    if (!aKey && !dKey) this.turning = Turning.none;

    // Acceleration
    const kKey = this.game.keysDown.indexOf("k") >= 0;
    if (kKey) this.startAccelerate();
    else this.stopAccelerate();

    // Shooting
    const jKey = this.game.keysDown.indexOf("j") >= 0;
    if (jKey)
      this.game.fireBullet(this.pos, this.heading, this.travelDirection);
  }

  move(movement: Vector) {
    this.pos.x += movement.x;
    if (this.pos.x > this.game.canvasWidth) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = this.game.canvasWidth;
    this.pos.y += movement.y;
    if (this.pos.y > this.game.canvasHeight) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = this.game.canvasHeight;
    switch (this.turning) {
      case Turning.left: {
        this.turnLeft();
        break;
      }
      case Turning.right: {
        this.turnRight();
        break;
      }
    }
  }

  accelerate() {
    const retardationVector = this.travelDirection
      .negate()
      .scale(this.retardationStep);
    const accelVector = this.heading.scale(this.acceleration);
    const newTravelDirection = this.travelDirection
      .add(retardationVector)
      .add(accelVector);

    const speed = newTravelDirection.getAbsoluteValue();
    if (speed < this.maxSpeed) this.travelDirection = newTravelDirection;
    else
      this.travelDirection = newTravelDirection
        .scale(1 / speed)
        .scale(this.maxSpeed);
  }

  turnLeft() {
    this.heading = this.heading.rotateVector(-this.turningSpeed);
  }

  turnRight() {
    this.heading = this.heading.rotateVector(this.turningSpeed);
  }
  checkForRockHit() {
    this.game.rocks.forEach((rock) => {
      this.shipShape.forEach((coord) => {
        if (
          rock.checkForPointInside(
            coord.rotateByVector(this.heading).add(this.pos)
          )
        ) {
          this.game.gameOver();
        }
      });
    });
  }
}
