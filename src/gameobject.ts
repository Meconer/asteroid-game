import { Game } from "./game";
import Vector from "./vector";

export enum Turning {
  none,
  left,
  right,
}

export class GameObject {
  pos = new Vector(400, 300);
  bulletDirection = new Vector(0, 0);
  updateInterval = 20;
  lastTimestamp = 0;
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update() {}

  animate = () => {
    this.update();
    this.draw();
  };
  draw() {}
}
