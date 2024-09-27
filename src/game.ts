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
  isGameOver = false;
  score = 0;
  scoreElement: HTMLElement | null;
  statusElement: HTMLElement | null;

  constructor(
    gameCanvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.gameCanvas = gameCanvas;
    this.canvasWidth = gameCanvas.getBoundingClientRect().width;
    this.canvasHeight = gameCanvas.getBoundingClientRect().height;
    this.scoreElement = document.getElementById("gameScore");
    this.statusElement = document.getElementById("gameStatus");
    this.context = context;
  }

  run() {
    this.ship = new Ship(this);
    const newRocks = Rock.createRocks(this.noOfRocks, this);

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

      const newRocks: Rock[] = [];
      this.rocks.forEach((rock) => {
        if (rock.isHit) {
          rock.markedForDeletion = true;
          if (rock.rockScale > 2) {
            newRocks.push(...Rock.createRocks(2, this));
            newRocks.forEach((newRock) => {
              newRock.rockScale = rock.rockScale / 2;
              newRock.pos.x = rock.pos.x;
              newRock.pos.y = rock.pos.y;
              const randomRotAngle = -90 + Math.random() * 180;
              const rotation =
                rock.travelDirection.rotateByAngleInDegrees(randomRotAngle);
              newRock.travelDirection = rotation;
            });
          }
        }
      });

      this.bullets = this.bullets.filter((bullet) => !bullet.markedForDeletion);
      this.rocks = this.rocks.filter((rock) => !rock.markedForDeletion);
      this.rocks.push(...newRocks);
      this.prevTimestamp = timestamp;
    } else {
      timestamp += deltatime;
    }

    if (!this.isGameOver) requestAnimationFrame(this.animate);
    else {
      this.statusElement!.innerText = "Game over";
    }
  };

  updateScore(points: number) {
    this.score += points;
    this.scoreElement!.innerText = `Score ${this.score}`;
  }

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

  gameOver() {
    this.isGameOver = true;
  }
}
