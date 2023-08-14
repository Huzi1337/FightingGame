import { Fighter, Game, Sprite } from "./classes";
import "./style.scss";
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
    x: 45,
    y: 55,
  },
  {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
  },
  1,
  100
);

const enemy = new Fighter(
  { x: 200, y: 0 },
  { x: 0, y: 0 },
  {
    x: 0,
    y: 55,
  },
  { idle: { imageSrc: "/king/Idle.png", maxFrames: 6 } },
  1,
  200
);

const candle = new Sprite(
  { x: canvas.width - 50, y: canvas.height - 100 },
  Array.from({ length: 6 }, (_, i) => `/candle_1_${i + 1}.png`),
  2,
  200
);

const verdict = document.querySelector("#verdict") as HTMLDivElement;
const timer = document.querySelector(".timer") as HTMLDivElement;

const game = new Game(player, enemy, 60, verdict, timer);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

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
    if (keys.d.pressed && player.lastKey === "d") {
      player.setState("run");
      player.velocity.x = 1;
    } else if (keys.a.pressed && player.lastKey === "a") {
      player.setState("run");
      player.velocity.x = -1;
    } else {
      player.setState("idle");
      player.velocity.x = 0;
    }
    if (keys.right.pressed && enemy.lastKey === "ArrowRight")
      enemy.velocity.x = 1;
    else if (keys.left.pressed && enemy.lastKey === "ArrowLeft")
      enemy.velocity.x = -1;
    else enemy.velocity.x = 0;

    if (player.isAttacking && rectangularCollision(player, enemy)) {
      player.isAttacking = false;
      enemy.health -= 20;
      (
        document.querySelector("#enemyHealth") as HTMLDivElement
      ).style.width = `${enemy.health}%`;
    }

    if (enemy.isAttacking && rectangularCollision(enemy, player)) {
      enemy.isAttacking = false;
      player.health -= 20;

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

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.left.pressed = false;
      break;
    case "ArrowRight":
      keys.right.pressed = false;
      break;
    case "ArrowUp":
      keys.up.pressed = false;
      break;
  }
});
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";

      break;
    case "w":
      keys.w.pressed = true;
      player.velocity.y = -5;
      break;

    case " ":
      player.attack();
      break;

    //enemy
    case "ArrowLeft":
      keys.left.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.right.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowUp":
      keys.up.pressed = true;
      enemy.velocity.y = -5;

      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
