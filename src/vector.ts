export default class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  negate() {
    return new Vector(-this.x, -this.y);
  }

  scale(scaleFactor: number): Vector {
    return new Vector(this.x * scaleFactor, this.y * scaleFactor);
  }

  static createUnityVectorFromAngle = (angle: number): Vector => {
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return new Vector(x, y);
  };

  add(vectorToAdd: Vector): Vector {
    const resultVector = new Vector(
      this.x + vectorToAdd.x,
      this.y + vectorToAdd.y
    );

    return resultVector;
  }

  rotateByVector = (rotationVector: Vector): Vector => {
    const x = this.x * rotationVector.x - this.y * rotationVector.y;
    const y = this.x * rotationVector.y + this.y * rotationVector.x;
    return new Vector(x, y);
  };

  rotateByAngleInDegrees(rotationAngleInDegrees: number): Vector {
    const x =
      this.x * Math.cos((rotationAngleInDegrees * Math.PI) / 180) -
      this.y * Math.sin((rotationAngleInDegrees * Math.PI) / 180);
    const y =
      this.x * Math.sin((rotationAngleInDegrees * Math.PI) / 180) +
      this.y * Math.cos((rotationAngleInDegrees * Math.PI) / 180);
    return new Vector(x, y);
  }
  getAbsoluteValue(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
