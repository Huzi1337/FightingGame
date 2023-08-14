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

type FighterState = "idle" | "jump" | "run";

type SpriteAnimations = Partial<Record<FighterState, SpriteAnimation>>;

type SpriteAnimation = {
  imageSrc: string;
  maxFrames: number;
};
export class Fighter implements IFighterCollider {
  public height = 60;
  public width = 30;
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
      width: 100,
      height: 10,
    };
    this.health = 100;
    this.image = new Image();
    this.image.src = (this.animations.idle as SpriteAnimation).imageSrc;

    this.animate();
  }

  setState(state: FighterState) {
    this.state = state;
    this.image.src = (this.animations[state] as SpriteAnimation).imageSrc;
    clearTimeout(this.animationRef);
    this.currentFrame = 0;
    this.animate();
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
      const frameX = this.currentFrame * frameWidth;

      c.save();
      c.scale(this.velocity.x >= 0 ? 1 : -1, 1);

      c.drawImage(
        this.image,
        frameX,
        0,
        frameWidth,
        this.image.height,
        this.position.x * (this.velocity.x >= 0 ? 1 : -1) - this.offset.x,
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        this.image.height * this.scale
      );

      c.restore();
    }
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 55) {
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
