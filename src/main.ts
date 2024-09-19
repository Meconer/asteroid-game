import "./style.css";
import Vector from "./vector.ts";

window.addEventListener("load", () => {
  const gameCanvas: HTMLCanvasElement = document.getElementById(
    "gameCanvas"
  ) as HTMLCanvasElement;

  let gameContext: CanvasRenderingContext2D;

  if (gameCanvas != null) {
    try {
      gameContext = gameCanvas.getContext("2d")!;
    } catch {
      console.error("Kan inte hämta canvas context");
    }
  }

  const canvasWidth = gameCanvas.getBoundingClientRect().width;
  const canvasHeight = gameCanvas.getBoundingClientRect().height;

  enum Turning {
    none,
    left,
    right,
  }

  class GameObject {
    pos = new Vector(400, 300);
    travelDirection = new Vector(0, 0);
    updateInterval = 20;
  }

  class Ship extends GameObject {
    acceleration = 0;
    accelerationStep = 0.005;
    retardationStep = 0.003;
    maxSpeed = 2;
    heading = new Vector(0, -1);
    turningSpeed: number = 1;
    turning: Turning = Turning.none;

    shipShape = {
      coords: [new Vector(-10, -8), new Vector(10, 0), new Vector(-10, 8)],
      isClosed: true,
    };

    flameShape = {
      coords: [new Vector(-10, -3), new Vector(-14, 0), new Vector(-10, 3)],
      isClosed: false,
    };

    stopTurn() {
      this.turning = Turning.none;
    }
    startTurnRight() {
      this.turning = Turning.right;
    }
    startTurnLeft() {
      this.turning = Turning.left;
    }
    stopAccelerate() {
      this.acceleration = 0;
    }
    startAccelerate() {
      this.acceleration += this.accelerationStep;
    }

    draw() {
      gameContext.strokeStyle = "#2eb229";
      gameContext.lineWidth = 2;
      gameContext.beginPath();
      const drawingCoords = this.shipShape.coords.map((coord) =>
        coord.rotateByVector(this.heading).add(this.pos)
      );
      gameContext.moveTo(drawingCoords[0].x, drawingCoords[0].y);
      for (let i = 1; i < this.shipShape.coords.length; i++) {
        gameContext.lineTo(drawingCoords[i].x, drawingCoords[i].y);
      }
      if (this.shipShape.isClosed) gameContext.closePath();
      gameContext.stroke();
      if (this.acceleration) {
        const flameCoords = this.flameShape.coords.map((coord) =>
          coord.rotateByVector(this.heading).add(this.pos)
        );
        gameContext.beginPath();
        gameContext.moveTo(flameCoords[0].x, flameCoords[0].y);
        for (let i = 1; i < this.flameShape.coords.length; i++) {
          gameContext.lineTo(flameCoords[i].x, flameCoords[i].y);
        }
        gameContext.stroke();
      }
    }

    update() {
      this.move(this.travelDirection);
      this.accelerate();
    }

    move(movement: Vector) {
      this.pos.x += movement.x;
      if (this.pos.x > canvasWidth) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = canvasWidth;
      this.pos.y += movement.y;
      if (this.pos.y > canvasHeight) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = canvasHeight;
      if (this.pos.y < 0) this.pos.y += canvasHeight;
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
  }

  const ship = new Ship();

  let prevTimestamp = 0;
  let timeToNextShipUpdate = 0;
  const animate = (timestamp: number) => {
    gameContext.clearRect(0, 0, canvasWidth, canvasHeight);
    const deltatime = timestamp - prevTimestamp;
    timeToNextShipUpdate += deltatime;
    prevTimestamp = timestamp;
    if (timeToNextShipUpdate > ship.updateInterval) {
      ship.update();
      ship.draw();
    }
    requestAnimationFrame(animate);
  };

  animate(0);

  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key == "k") ship.startAccelerate();
    if (ev.key == "a") ship.startTurnLeft();
    if (ev.key == "d") ship.startTurnRight();
  });

  document.addEventListener("keyup", (ev: KeyboardEvent) => {
    if (ev.key == "k") ship.stopAccelerate();
    if (ev.key == "a") ship.stopTurn();
    if (ev.key == "d") ship.stopTurn();
  });
});
