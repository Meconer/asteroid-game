import { Bullet } from "./bullet";
import { GameObject } from "./gameobject";
import { Rock } from "./rock";
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
  rocks: Rock[] = [];
  noOfRocks = 4;
  gameCanvas: HTMLCanvasElement;

  constructor(
    gameCanvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.gameCanvas = gameCanvas;
    this.canvasWidth = gameCanvas.getBoundingClientRect().width;
    this.canvasHeight = gameCanvas.getBoundingClientRect().height;
    this.context = context;
  }

  run() {
    this.ship = new Ship(this);
    const newRocks = this.createRocks(this.noOfRocks);

    this.rocks = newRocks;
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
    // For testing
    // this.gameCanvas.addEventListener("click", (ev: MouseEvent) => {
    //   const rect = this.gameCanvas.getBoundingClientRect();
    //   const x = ev.clientX - rect.left;
    //   const y = ev.clientY - rect.top;
    //   console.log(this.rocks[0].checkForPointInside(new Vector(x, y)));
    // });
    this.animate(0);
  }

  animate = (timestamp: number) => {
    const deltatime = timestamp - this.prevTimestamp;
    if (deltatime > this.updateInterval) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.ship?.animate();
      this.rocks.forEach((rock) => rock.animate());
      this.bullets.forEach((bullet) => {
        bullet.animate();
      });
      this.bullets = this.bullets.filter((bullet) => !bullet.markedForDeletion);
      this.rocks = this.rocks.filter((rock) => !rock.markedForDeletion);
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
    bullet.travelDirection = heading
      .scale(bullet.bulletStartSpeed)
      .add(travelDirection);
    this.bullets.push(bullet);
  }
  createRocks(noOfRocks: number): Rock[] {
    const rocks: Rock[] = [];
    for (let i = 0; i < noOfRocks; i++) {
      const rock = new Rock(this);
      rock.rockShapeNo = i;
      rock.pos.x = 200 + 400 * (i % 2);
      rock.pos.y = 200 + 200 * Math.floor((i / 2) % 2);

      rock.heading = Vector.createUnityVectorFromAngle(Math.random() * 6.28);
      rock.travelDirection = Vector.createUnityVectorFromAngle(
        Math.random() * 6.28
      );
      rocks.push(rock);
    }
    return rocks;
  }
}
