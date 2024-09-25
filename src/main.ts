import { Game } from "./game.ts";
import "./style.css";

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

  const game = new Game(canvasWidth, canvasHeight, gameContext!);

  game.run();
});
