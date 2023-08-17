import { Fighter, Game, Sprite } from "./classes";
import { PlayerControl } from "./classes/PlayerControl";
import "./style.scss";
import { Keybinds } from "./types";
import { rectangularCollision } from "./utils";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const c = canvas?.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
(c as CanvasRenderingContext2D).imageSmoothingEnabled = false;

c?.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({ x: 0, y: 0 }, ["/bg.png"]);

const player = new Fighter(
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  {
    x: 90,
    y: 100,
  },
  {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/king/Attack_1.png", maxFrames: 6 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2 },
  },
  2,
  100
);

const enemy = new Fighter(
  { x: 200, y: 0 },
  { x: 0, y: 0 },
  {
    x: 90,
    y: 170,
  },
  {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/king/Attack_1.png", maxFrames: 6 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2 },
  },
  2,
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
};

const PLAYER2_KEYBINDS: Keybinds = {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  attack1: "ArrowDown",
  attack2: "ControlRight",
};

const player1control = new PlayerControl(player, PLAYER1_KEYBINDS);
const player2control = new PlayerControl(enemy, PLAYER2_KEYBINDS);

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

  if (!game.getGameOver()) {
    if (player.isAttacking && rectangularCollision(player, enemy)) {
      enemy.damaged(20);
      (
        document.querySelector("#enemyHealth") as HTMLDivElement
      ).style.width = `${enemy.health}%`;
    }

    if (enemy.isAttacking && rectangularCollision(enemy, player)) {
      player.damaged(20);

      (
        document.querySelector("#playerHealth") as HTMLDivElement
      ).style.width = `${player.health}%`;
    }
    if (player.health <= 0 || enemy.health <= 0) {
      game.endGame();
    }
  } else {
    player.velocity.x = 0;
    enemy.velocity.x = 0;
  }
};
animate();
