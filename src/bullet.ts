import { Game } from "./game";
import { GameObject } from "./gameobject";
import Vector from "./vector";

export class Bullet extends GameObject {
  bulletStartSpeed = 3;
  game: Game;
  bulletLifeTime = 1500;
  timeToDeleteBullet = 0;
  markedForDeletion = false;

  constructor(game: Game, firingTime: number) {
    super(game);
    this.game = game;
    this.timeToDeleteBullet = firingTime + this.bulletLifeTime;
  }

  draw() {
    this.game.context.strokeStyle = "#2eb229";
    this.game.context.lineWidth = 2;
    this.game.context.beginPath();

    this.game.context.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
    this.game.context.stroke();
  }

  update() {
    const timestamp = Date.now();
    if (timestamp > this.timeToDeleteBullet) this.markedForDeletion = true;
    this.move(this.bulletDirection);
  }

  move(movement: Vector) {
    this.pos.x += movement.x;
    if (this.pos.x > this.game.canvasWidth) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = this.game.canvasWidth;
    this.pos.y += movement.y;
    if (this.pos.y > this.game.canvasHeight) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = this.game.canvasHeight;
  }
}
