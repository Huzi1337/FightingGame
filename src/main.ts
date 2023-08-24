import { king, rogue } from "./characters";
import { Sprite } from "./classes";
import AIControl from "./classes/AIControl";
import Fighter from "./classes/Fighter";
import Game from "./classes/Game";
import { PlayerControl } from "./classes/PlayerControl";
import { c, canvas } from "./data";
import "./style.scss";
import { ControlObject, Keybinds } from "./types";

(c as CanvasRenderingContext2D).imageSmoothingEnabled = false;

c?.fillRect(0, 0, canvas.width, canvas.height);

const mainTheme = new Audio("/music/theme1.mp3");

const toggleSoundMute = () => {
  if (mainTheme.paused) mainTheme.play();
  else mainTheme.pause();
};

const toggleSoundButton = document.querySelector("#sound") as HTMLButtonElement;
toggleSoundButton.addEventListener("click", toggleSoundMute);

const background = new Sprite({ x: 0, y: 0 }, ["/bg.png"]);

const player = new Fighter(
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  {
    x: 90,
    y: 85,
  },
  king,
  2
);

const enemy = new Fighter(
  { x: 1000, y: 0 },
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

const verdict = document.querySelector("#verdict") as HTMLDivElement;
const timer = document.querySelector(".timer") as HTMLDivElement;

const game = new Game(player, enemy, 60, verdict, timer);

const menuButtons = {
  pvp: document.querySelector("#btn_pvp") as HTMLButtonElement,
  pvAI: document.querySelector("#btn_pvAI") as HTMLButtonElement,
  restart: document.querySelector("#btn_restart") as HTMLButtonElement,
  mainMenu: document.querySelector("#btn_mainMenu") as HTMLButtonElement,
};

const menuContainer = document.querySelector("#menu") as HTMLDivElement;

menuButtons.pvp.addEventListener("click", () => {
  startGame("player");
  game.startGame();
});
menuButtons.pvAI.addEventListener("click", () => {
  startGame("AI");
  game.startGame();
});

menuButtons.restart.addEventListener("click", () => {
  game.reset();
  verdict.style.display = "none";
});

const toggleMenu = () => {
  menuContainer.classList.toggle("hide");
};

const startGame = (versus: "AI" | "player") => {
  toggleMenu();
  const controlObject: ControlObject = {
    player1: new PlayerControl(player, PLAYER1_KEYBINDS),
    player2: null,
  };
  if (versus === "player")
    controlObject.player2 = new PlayerControl(enemy, PLAYER2_KEYBINDS);
  if (versus === "AI")
    controlObject.player2 = new AIControl({ AIFighter: enemy, player });

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
    if (controlObject.player2 instanceof AIControl)
      controlObject.player2.update();
  };
  animate();
};
