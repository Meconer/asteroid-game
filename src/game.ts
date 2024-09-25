import { Bullet } from "./bullet";
import { GameObject } from "./gameobject";
import { Ship } from "./ship";
import Vector from "./vector";

export class Game {
  canvasWidth: number;
  canvasHeight: number;
  context: CanvasRenderingContext2D;
  ship: GameObject | undefined;
  bullets: Bullet[] = [];
  prevTimestamp = 0;
  keysDown: string[] = [];
  updateInterval = 10;
  nextBulletTime = 0;
  timeBetweenBullets = 100;
  maxNoOfBullets = 4;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    context: CanvasRenderingContext2D
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.context = context;
  }

  run() {
    this.ship = new Ship(this);
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      const key = ev.key;
      if (this.keysDown.indexOf(key) < 0) {
        this.keysDown.push(key);
      }
    });
    document.addEventListener("keyup", (ev: KeyboardEvent) => {
      const key = ev.key;
      const idx = this.keysDown.indexOf(key);
      if (idx >= 0) this.keysDown = this.keysDown.filter((k) => k != key);
    });
    this.animate(0);
  }

  animate = (timestamp: number) => {
    const deltatime = timestamp - this.prevTimestamp;
    if (deltatime > this.updateInterval) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.ship?.animate();
      this.bullets.forEach((bullet) => {
        bullet.animate();
      });
      this.bullets = this.bullets.filter((bullet) => !bullet.markedForDeletion);
      this.prevTimestamp = timestamp;
    } else {
      timestamp += deltatime;
    }
    requestAnimationFrame(this.animate);
  };

  fireBullet(firingPosition: Vector, heading: Vector, travelDirection: Vector) {
    const timestamp = Date.now();
    if (timestamp < this.nextBulletTime) return;
    if (this.bullets.length >= this.maxNoOfBullets) return;
    this.nextBulletTime = timestamp + this.timeBetweenBullets;
    const bullet = new Bullet(this, timestamp);
    bullet.pos.x = firingPosition.x;
    bullet.pos.y = firingPosition.y;
    bullet.bulletDirection = heading
      .scale(bullet.bulletStartSpeed)
      .add(travelDirection);
    this.bullets.push(bullet);
  }
}
