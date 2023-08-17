import { IFighterActions } from "./interfaces";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const c = canvas?.getContext("2d");
const gravity = 0.2;

type Coordinates = { x: number; y: number };

export interface IFighterCollider {
  width: number;
  height: number;
  position: Coordinates;
  attackBox: {
    position: Coordinates;
    width: number;
    height: number;
  };
  getDirection(): number;
}

export class Game {
  private gameOver = false;
  constructor(
    private player1: Fighter,
    private player2: Fighter,
    private timer: number,
    private verdict: HTMLDivElement,
    private timerElement: HTMLDivElement
  ) {}

  reset() {
    this.gameOver = true;
  }

  decreaseTimer() {
    if (this.timer > 0 && !this.gameOver) {
      setTimeout(this.decreaseTimer.bind(this), 1000);
      this.timer--;
      this.timerElement.innerHTML = `${this.timer}`;
    }

    if (this.timer === 0) {
      this.endGame();
    }
  }

  determineWinner() {
    this.verdict.style.display = "flex";
    if (this.player1.health === this.player2.health)
      this.verdict.innerHTML = "draw";
    else if (this.player1.health > this.player2.health)
      this.verdict.innerHTML = "Player 1 wins";
    else this.verdict.innerHTML = "Player 2 wins";
  }

  getGameOver() {
    return this.gameOver;
  }
  endGame() {
    this.gameOver = true;
    this.determineWinner();
  }

  update() {}
}

export class Sprite {
  public height = 60;
  public width = 30;
  public image;
  public currentFrame;

  constructor(
    public position: Coordinates,

    public imageSrc: string[],
    public scale = 1,
    public animationSpeed = 1000
  ) {
    this.image = new Image();
    this.image.src = imageSrc[0];
    this.currentFrame = 0;
    if (imageSrc.length > 1)
      this.preloadImages(() => {
        this.animate();
      });
  }

  preloadImages(callback: () => void) {
    let loadedCount = 0;
    const totalImages = this.imageSrc.length;

    const checkAllImagesLoaded = () => {
      if (++loadedCount === totalImages) {
        callback();
      }
    };

    this.imageSrc.forEach((src) => {
      const img = new Image();
      img.onload = checkAllImagesLoaded;
      img.src = src;
    });
  }

  animate() {
    setTimeout(this.animate.bind(this), this.animationSpeed);
    if (this.currentFrame < this.imageSrc.length - 1) this.currentFrame++;
    else this.currentFrame = 0;
    this.image.src = this.imageSrc[this.currentFrame];
  }

  draw() {
    if (c != null) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.image.width * this.scale,
        this.image.height * this.scale
      );
    }
  }

  update() {
    this.draw();
  }
}

type FighterState = "idle" | "jump" | "run" | "attack1" | "fall";

type SpriteAnimations = Partial<Record<FighterState, SpriteAnimation>>;

type SpriteAnimation = {
  imageSrc: string;
  maxFrames: number;
};
export class Fighter implements IFighterCollider, IFighterActions {
  private moveSpeed = 4;
  private jumpSpeed = -5;
  private isInvulnerable = false;
  private isDuringAnimation = false;
  public height = 150;
  public width = 80;

  private direction = 1;
  public lastKey = "";
  public attackBox;
  public isAttacking = false;
  public health;
  public image;
  private animationRef = 0;
  public currentFrame = 0;
  private state: FighterState = "idle";

  constructor(
    public position: Coordinates,
    public velocity: Coordinates,
    public offset: Coordinates,

    public animations: SpriteAnimations,
    public scale = 1,
    public animationSpeed = 1000
  ) {
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 180,
      height: 10,
    };
    this.health = 100;
    this.image = new Image();
    this.image.src = (this.animations.idle as SpriteAnimation).imageSrc;

    this.animate();
  }

  setState(state: FighterState) {
    if (this.state != state) {
      this.state = state;
      this.image.src = (this.animations[state] as SpriteAnimation).imageSrc;
      clearTimeout(this.animationRef);
      this.currentFrame = 0;
      this.animate();
    }
  }

  getDirection() {
    return this.direction;
  }

  damaged(damage: number) {
    if (!this.isInvulnerable) {
      this.health -= damage;
      this.isInvulnerable = true;
      setTimeout(
        () => (this.isInvulnerable = false),
        (this.animations.attack1 as SpriteAnimation).maxFrames *
          this.animationSpeed
      );
    }
  }

  animate() {
    this.animationRef = setTimeout(
      this.animate.bind(this),
      this.animationSpeed
    );
    if (
      this.currentFrame <
      (this.animations[this.state] as SpriteAnimation).maxFrames - 1
    )
      this.currentFrame++;
    else this.currentFrame = 0;
  }

  draw() {
    if (c != null) {
      const animation = this.animations[this.state] as SpriteAnimation;
      const frameWidth = this.image.width / animation.maxFrames;
      const displayedFrame = this.currentFrame * frameWidth;

      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );

      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);

      c.save();
      c.scale(this.direction, 1);
      c.drawImage(
        this.image,
        displayedFrame,
        0,
        frameWidth,
        this.image.height,
        (this.position.x + (this.direction < 0 ? this.width : 0)) *
          this.direction -
          this.offset.x,
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        this.image.height * this.scale
      );

      c.restore();
    }
  }

  run(direction: 1 | -1) {
    if (!this.isAttacking) {
      if (this.direction != direction) {
        this.direction = direction;
      }
      this.setState("run");
      this.velocity.x = this.moveSpeed * direction;
    }
  }

  stop() {
    this.velocity.x = 0;
    this.setState("idle");
  }

  jump() {
    if (!this.isAttacking && this.velocity.y === 0) {
      this.setState("jump");
      this.velocity.y = this.jumpSpeed;
    }
  }
  fall() {
    if (!this.isAttacking) {
      this.setState("fall");
    }
  }

  idle() {
    if (!this.isAttacking) {
      this.setState("idle");
    }
    this.velocity.x = 0;
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.attackBox.position.x = this.position.x;
    this.attackBox.position.y = this.position.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 55) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack1() {
    if (this.isAttacking === false) {
      this.setState("attack1");
      this.velocity.x = 0;
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
        this.stop();
      }, (this.animations.attack1 as SpriteAnimation).maxFrames * this.animationSpeed);
    }
  }
  attack2() {
    console.log("Attack 2!");
  }
}
