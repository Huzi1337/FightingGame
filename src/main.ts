import { king, rogue } from "./characters";
import { Sprite } from "./classes";
import Fighter from "./classes/Fighter";
import Game from "./classes/Game";
import Menu from "./classes/Menu";
import { c, canvas } from "./data";
import "./style.scss";

(c as CanvasRenderingContext2D).imageSmoothingEnabled = false;

c?.fillRect(0, 0, canvas.width, canvas.height);

const mainTheme = new Audio("/music/theme1.mp3");

mainTheme.volume = 0.1;

const toggleSoundMute = () => {
  if (mainTheme.paused) mainTheme.play();
  else mainTheme.pause();
};

const toggleSoundButton = document.querySelector("#sound") as HTMLButtonElement;
toggleSoundButton.addEventListener("click", toggleSoundMute);

const background = new Sprite({ x: 0, y: 0 }, ["/background/bg.png"]);

const player = new Fighter(
  { x: 0, y: canvas.height - 205 },
  { x: 0, y: 0 },
  {
    x: 90,
    y: 85,
  },
  king,
  2
);

const enemy = new Fighter(
  { x: 1000, y: canvas.height - 205 },
  { x: 0, y: 0 },
  {
    x: 240,
    y: 205,
  },
  rogue,
  3.5
);

const candle = new Sprite(
  { x: canvas.width - 50, y: canvas.height - 100 },
  Array.from({ length: 6 }, (_, i) => `/background/candle_1_${i + 1}.png`),
  2,
  200
);

const verdict = document.querySelector("#verdict") as HTMLDivElement;
const timer = document.querySelector(".timer") as HTMLDivElement;

const game = new Game(player, enemy, 60, verdict, timer, [background, candle]);

new Menu(game);
