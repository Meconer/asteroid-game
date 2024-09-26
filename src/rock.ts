import { Game } from "./game";
import { GameObject } from "./gameobject";
import Vector from "./vector";

export class Rock extends GameObject {
  rockSpeed = 0;
  game: Game;
  markedForDeletion = false;
  heading = new Vector(1, 0);
  rockShapeNo = 3;

  rockShapes = [
    [
      new Vector(0.0, 2.0),
      new Vector(2.0, 4.0),
      new Vector(4.0, 2.0),
      new Vector(3.0, 0.0),
      new Vector(4.0, -2.0),
      new Vector(1.0, -4.0),
      new Vector(-2.0, -4.0),
      new Vector(-4.0, -2.0),
      new Vector(-4.0, 2.0),
      new Vector(-2.0, 4.0),
      new Vector(0.0, 2.0),
    ],
    [
      new Vector(2.0, 1.0),
      new Vector(4.0, 2.0),
      new Vector(2.0, 4.0),
      new Vector(0.0, 3.0),
      new Vector(-2.0, 4.0),
      new Vector(-4.0, 2.0),
      new Vector(-3.0, 0.0),
      new Vector(-4.0, -2.0),
      new Vector(-2.0, -4.0),
      new Vector(-1.0, -3.0),
      new Vector(2.0, -4.0),
      new Vector(4.0, -1.0),
      new Vector(2.0, 1.0),
    ],

    [
      new Vector(-2.0, 0.0),
      new Vector(-4.0, -1.0),
      new Vector(-2.0, -4.0),
      new Vector(0.0, -1.0),
      new Vector(0.0, -4.0),
      new Vector(2.0, -4.0),
      new Vector(4.0, -1.0),
      new Vector(4.0, 1.0),
      new Vector(2.0, 4.0),
      new Vector(-1.0, 4.0),
      new Vector(-4.0, 1.0),
      new Vector(-2.0, 0.0),
    ],

    [
      new Vector(1.0, 0.0),
      new Vector(4.0, 1.0),
      new Vector(4.0, 2.0),
      new Vector(1.0, 4.0),
      new Vector(-2.0, 4.0),
      new Vector(-1.0, 2.0),
      new Vector(-4.0, 2.0),
      new Vector(-4.0, -1.0),
      new Vector(-2.0, -4.0),
      new Vector(1.0, -3.0),
      new Vector(2.0, -4.0),
      new Vector(4.0, -2.0),
      new Vector(1.0, 0.0),
    ],
  ];

  rockScale = 8;

  constructor(game: Game) {
    super(game);
    this.game = game;
  }

  draw() {
    this.game.context.strokeStyle = "#2eb229";
    this.game.context.lineWidth = 2;
    this.game.context.beginPath();
    const drawingCoords = this.#getCoordsOnCanvas(
      this.rockShapes[this.rockShapeNo]
    );
    this.game.context.moveTo(drawingCoords[0].x, drawingCoords[0].y);
    for (let i = 1; i < this.rockShapes[this.rockShapeNo].length; i++) {
      this.game.context.lineTo(drawingCoords[i].x, drawingCoords[i].y);
    }
    // this.game.context.closePath();
    this.game.context.stroke();
    this.game.context.stroke();
  }

  update() {
    this.move(this.travelDirection);
  }

  #getCoordsOnCanvas = (coords: Vector[]): Vector[] => {
    const drawingCoords = coords.map((coord) => {
      const scaled = coord.scale(this.rockScale);
      return scaled.rotateByVector(this.heading).add(this.pos);
    });
    return drawingCoords;
  };

  // Checks if a horizontal ray (infinite line) from a point intersects the line from coord1 to coord2
  #lineIntersects = (
    startPoint: Vector,
    coord1: Vector,
    coord2: Vector
  ): boolean => {
    // Step 1: Check if the horizontal line is within the vertical range of the line segment
    if (
      startPoint.y < Math.min(coord1.y, coord2.y) ||
      startPoint.y > Math.max(coord1.y, coord2.y)
    ) {
      return false;
    }

    // Step 2: Calculate the x coordinate where the horizontal line intersects
    const x_intersection =
      coord1.x +
      ((startPoint.y - coord1.y) * (coord2.x - coord1.x)) /
        (coord2.y - coord1.y);

    // Step 3: Check if the x_intersection is within the bounds of the segment
    return x_intersection >= startPoint.x;
  };

  checkForPointInside = (pointToCheck: Vector): boolean => {
    // Find the coords on the canvas
    const coords = this.#getCoordsOnCanvas(this.rockShapes[this.rockShapeNo]);
    // Consider a horizontal line going from (minX, y) and (maxX,y)
    // where y is y of the point to check
    // Now check how many lines in the shape that intersects this line
    let intersectCount = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      if (this.#lineIntersects(pointToCheck, coords[i], coords[i + 1]))
        intersectCount++;
    }

    return intersectCount % 2 != 0;
  };

  move(movement: Vector) {
    this.pos.x += movement.x * this.rockSpeed;
    if (this.pos.x > this.game.canvasWidth) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = this.game.canvasWidth;
    this.pos.y += movement.y * this.rockSpeed;
    if (this.pos.y > this.game.canvasHeight) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = this.game.canvasHeight;
  }

  hit() {
    console.log("Hit");
    this.markedForDeletion = true;
  }
}
