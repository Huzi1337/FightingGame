import "./style.scss";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const c = canvas?.getContext("2d");
(c as CanvasRenderingContext2D).imageSmoothingEnabled = false;

c?.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

type Coordinates = { x: number; y: number };

interface IFighterCollider {
  width: number;
  height: number;
  position: Coordinates;
  attackBox: {
    position: Coordinates;
    width: number;
    height: number;
  };
}

class Sprite implements IFighterCollider {
  public height = 60;
  public width = 30;
  public lastKey = "";
  public attackBox;
  public isAttacking = false;
  public health;

  constructor(
    public position: Coordinates,
    public velocity: Coordinates,
    public color: string = "red",
    public offset: Coordinates
  ) {
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 10,
    };
    this.health = 100;
  }

  draw() {
    if (c != null) {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);

      //attackbox
      if (this.isAttacking) {
        c.fillStyle = "green";
        c.fillRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }
    }
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({ x: 0, y: 0 }, { x: 0, y: 0 }, "red", {
  x: 0,
  y: 0,
});

const enemy = new Sprite({ x: 200, y: 0 }, { x: 0, y: 0 }, "blue", {
  x: -70,
  y: 0,
});

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

const RectangularCollision = (
  rectangle1: IFighterCollider,
  rectangle2: IFighterCollider
) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const determineWinner = (
  player1: Sprite,
  player2: Sprite,
  element: HTMLDivElement
) => {
  element.style.display = "flex";
  if (player1.health === player2.health) element.innerHTML = "draw";
  else if (player1.health > player2.health) element.innerHTML = "Player 1 wins";
  else element.innerHTML = "Player 2 wins";
};

let timer = 10;
let gameOver = false;
const decreaseTimer = () => {
  if (timer > 0 && !gameOver) {
    setTimeout(decreaseTimer, 1000);
    timer--;
    (document.querySelector(".timer") as HTMLDivElement).innerHTML = `${timer}`;
  }

  if (timer === 0) {
    gameOver = true;
    const verdict = document.querySelector("#verdict") as HTMLDivElement;
    determineWinner(player, enemy, verdict);
  }
};
decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  if (c != null) {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  player.update();
  enemy.update();

  if (keys.d.pressed && player.lastKey === "d") player.velocity.x = 1;
  else if (keys.a.pressed && player.lastKey === "a") player.velocity.x = -1;
  else player.velocity.x = 0;

  if (keys.right.pressed && enemy.lastKey === "ArrowRight")
    enemy.velocity.x = 1;
  else if (keys.left.pressed && enemy.lastKey === "ArrowLeft")
    enemy.velocity.x = -1;
  else enemy.velocity.x = 0;

  if (player.isAttacking && RectangularCollision(player, enemy)) {
    console.log("kpow");
    player.isAttacking = false;
    enemy.health -= 20;
    (
      document.querySelector("#enemyHealth") as HTMLDivElement
    ).style.width = `${enemy.health}%`;
  }

  if (enemy.isAttacking && RectangularCollision(enemy, player)) {
    console.log("enemy kpow");
    enemy.isAttacking = false;
    player.health -= 20;

    (
      document.querySelector("#playerHealth") as HTMLDivElement
    ).style.width = `${player.health}%`;
  }
  if (player.health <= 0 || enemy.health <= 0) {
    gameOver = true;
    const verdict = document.querySelector("#verdict") as HTMLDivElement;

    determineWinner(player, enemy, verdict);
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
