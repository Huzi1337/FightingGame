import { king, rogue } from "./characters";
import { Sprite } from "./classes";
import Fighter from "./classes/Fighter";
import Game from "./classes/Game";
import { PlayerControl } from "./classes/PlayerControl";
import { c, canvas } from "./data";
import "./style.scss";
import { Keybinds } from "./types";

(c as CanvasRenderingContext2D).imageSmoothingEnabled = false;

c?.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({ x: 0, y: 0 }, ["/bg.png"]);

const mainTheme = new Audio("/music/theme1.mp3");
mainTheme.muted = false;
mainTheme.play();
mainTheme.loop = true;

const toggleSoundMute = () => {
  mainTheme.muted = !mainTheme.muted;
};

const toggleSoundButton = document.querySelector("#sound") as HTMLButtonElement;
toggleSoundButton.addEventListener("click", toggleSoundMute);

const player = new Fighter(
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  {
    x: 90,
    y: 85,
  },
  king,
  2,
  100
);

const enemy = new Fighter(
  { x: 200, y: 0 },
  { x: 0, y: 0 },
  {
    x: 240,
    y: 205,
  },
  rogue,
  3.5,
  100
);

const candle = new Sprite(
  { x: canvas.width - 50, y: canvas.height - 100 },
  Array.from({ length: 6 }, (_, i) => `/candle_1_${i + 1}.png`),
  2,
  200
);

const PLAYER1_KEYBINDS: Keybinds = {
  left: "KeyA",
  right: "KeyD",
  jump: "KeyW",
  attack1: "Space",
  attack2: "ShiftLeft",
  block: "Semicolon",
};

const PLAYER2_KEYBINDS: Keybinds = {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  attack1: "ArrowDown",
  attack2: "ControlRight",
  block: "Numpad0",
};

new PlayerControl(player, PLAYER1_KEYBINDS);
new PlayerControl(enemy, PLAYER2_KEYBINDS);

const verdict = document.querySelector("#verdict") as HTMLDivElement;
const timer = document.querySelector(".timer") as HTMLDivElement;

const game = new Game(player, enemy, 60, verdict, timer);

game.decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  if (c != null) {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  background.update();
  candle.update();
  player.update();
  enemy.update();
};
animate();
