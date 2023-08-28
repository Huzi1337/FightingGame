import { Subject } from "rxjs";
import { GRAVITY, canvas, c } from "../data";
import {
  AttackBox,
  AttackVariant,
  Character,
  Coordinates,
  FighterState,
  SpriteAnimation,
  StateParams,
} from "../types";

import {
  IAttackEvent,
  IFighterActions,
  IFighterCollider,
  IWindUpEvent,
} from "../interfaces";

class Fighter implements IFighterCollider, IFighterActions {
  private moveSpeed = 4;
  private jumpSpeed = -7;
  // private isInvulnerable = false;
  // private isDuringAnimation = false;
  public height = 150;
  public width = 80;
  // private staggerDuration = 1000;
  private recovery = 250;
  private _direction: 1 | -1 = 1;
  public lastKey = "";
  public attackBox: AttackBox;
  public health;
  public image;
  private animationRef = 0;
  public currentFrame = 0;
  private state: FighterState = "idle";
  private _attackEvent;
  public attackTimer: number | null = null;
  private _windUpEvent;

  private _isAttacking = false;
  private _isBlocking = false;
  private _isStaggered = false;

  constructor(
    public position: Coordinates,
    public velocity: Coordinates,
    public offset: Coordinates,
    public character: Character,

    public scale = 1
  ) {
    this.character = JSON.parse(JSON.stringify(character));
    this._attackEvent = new Subject<IAttackEvent>();
    this._windUpEvent = new Subject<IWindUpEvent>();
    this.attackBox = JSON.parse(
      JSON.stringify(character.attacks.attack1.attackBox)
    );
    if (this._direction > 0)
      this.character.attacks.attack1.attackBox.offset.x = this.width;
    this.health = 100;
    this.image = new Image();
    this.image.src = (
      this.character.animations.idle as SpriteAnimation
    ).imageSrc;
    this.preloadAssets();
    this.animate(true);
  }

  get isBlocking(): boolean {
    return this._isBlocking;
  }

  get isAttacking(): boolean {
    return this._isAttacking;
  }

  get direction(): -1 | 1 {
    return this._direction;
  }

  get isStaggered() {
    return this._isStaggered;
  }

  get attackEvent() {
    return this._attackEvent.asObservable();
  }

  get windUpEvent() {
    return this._windUpEvent.asObservable();
  }

  preloadAssets() {
    for (let animation in this.character.animations) {
      const image = new Image();
      image.src = (
        this.character.animations[animation as FighterState] as SpriteAnimation
      ).imageSrc;
      image.onload = () => console.log(`${animation} loaded`);
    }
  }

  animate(isLooping: boolean) {
    this.animationRef = setTimeout(
      () => this.animate(isLooping),
      (this.character.animations[this.state] as SpriteAnimation).speed
    );
    if (
      this.currentFrame <
      (this.character.animations[this.state] as SpriteAnimation).maxFrames - 1
    )
      this.currentFrame++;
    else {
      if (isLooping) {
        this.currentFrame = 0;
      } else clearTimeout(this.animationRef);
    }
  }

  draw() {
    if (c != null) {
      const animation = this.character.animations[
        this.state
      ] as SpriteAnimation;
      const frameWidth = this.image.width / animation.maxFrames;
      const displayedFrame = this.currentFrame * frameWidth;
      if (this.isAttacking) {
        c.fillRect(
          this.attackBox.position.x + this.attackBox.offset.x,
          this.attackBox.position.y + this.attackBox.offset.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }

      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);

      c.save();
      c.scale(this._direction, 1);
      c.drawImage(
        this.image,
        displayedFrame,
        0,
        frameWidth,
        this.image.height,
        (this.position.x + (this._direction < 0 ? this.width : 0)) *
          this._direction -
          this.offset.x,
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        this.image.height * this.scale
      );

      c.restore();
    }
  }

  setState({ state, isLooping }: StateParams) {
    if (this.state != state) {
      this.state = state;
      this.image.src = (
        this.character.animations[state] as SpriteAnimation
      ).imageSrc;
      clearTimeout(this.animationRef);
      this.currentFrame = 0;
      this.animate(isLooping);
    }
  }

  run(direction: 1 | -1) {
    if (this._isBlocking) this.stopBlocking();
    if (!this._isAttacking) {
      if (this._direction != direction) {
        this._direction = direction;

        this.attackBox.width *= -1;
        if (this.attackBox.width > 0) this.attackBox.offset.x = this.width;
        else this.attackBox.offset.x = 0;
      }
      if (this.velocity.y === 0)
        this.setState({ state: "run", isLooping: true });

      const futurePos = this.position.x + this.moveSpeed * direction;
      if (futurePos > 0 || futurePos + this.width < canvas.width)
        this.velocity.x = this.moveSpeed * direction;
    }
  }

  idle() {
    this.velocity.x = 0;
    if (this.velocity.y === 0)
      this.setState({ state: "idle", isLooping: true });
  }

  jump() {
    if (!this._isAttacking && this.velocity.y === 0) {
      this.setState({ state: "jump", isLooping: false });
      this.velocity.y = this.jumpSpeed;
    }
  }
  fall() {
    if (!this._isAttacking) {
      this.setState({ state: "fall", isLooping: false });
    }
  }

  damaged(damage: number) {
    if (this.health < damage) this.health = 0;
    else this.health -= damage;
    this.setState({ state: "damaged", isLooping: false });
  }

  die() {
    this.setState({ state: "death", isLooping: false });
    this._isStaggered = true;
  }

  staggered(duration: number) {
    this._isStaggered = true;
    this.setState({ state: "staggered", isLooping: false });
    setTimeout(() => {
      this._isStaggered = false;
      this.idle();
    }, duration);
    console.log(duration);
  }

  clearStaggered() {
    this._isStaggered = false;
  }

  pushedBack(direction: 1 | -1) {
    this.velocity.x = 10 * direction;
    this.velocity.y = -3;
    setTimeout(() => (this.velocity.x = 0), 200);
  }

  attack(variant: AttackVariant) {
    if (this._isAttacking === false) {
      this._isAttacking = true;
      this.setState({ state: variant, isLooping: false });
      this.attackBox = {
        ...this.character.attacks[variant].attackBox,
        offset: {
          y: this.character.attacks[variant].attackBox.offset.y,
          x: this._direction > 0 ? this.width : 0,
        },
        width:
          this.character.attacks[variant].attackBox.width * this._direction,
        position: {
          x: this.position.x,
          y: this.position.y,
        },
      };
      //started attacking
      this.velocity.x = 0;

      const attackSpeed =
        (this.character.animations[variant] as SpriteAnimation).maxFrames *
        (this.character.animations[this.state] as SpriteAnimation).speed;

      const windUpSpeed =
        (((this.character.animations[variant] as SpriteAnimation)
          .lethalFrame as number) -
          1) *
        (this.character.animations[this.state] as SpriteAnimation).speed;
      //attack lethal
      this.attackTimer = setTimeout(() => {
        this._attackEvent.next({
          damage: this.character.attacks[variant].damage,
          variant,
        });
        this.attackTimer = null;
        console.log("Attack is now lethal!");
      }, windUpSpeed);

      //stopped attacking
      setTimeout(() => {
        console.log("stopped attacking");
        this._isAttacking = false;
        if (this.state != "death") this.idle();
      }, attackSpeed + this.recovery);
    }
  }

  block() {
    this._isBlocking = true;
    this.setState({ state: "block", isLooping: false });
  }

  stopBlocking() {
    this._isBlocking = false;
    this.idle();
  }

  update() {
    this.draw();
    if (
      this.position.x + this.velocity.x > 0 &&
      this.position.x + this.velocity.x + this.width < canvas.width
    ) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;
    this.attackBox.position.x = this.position.x;
    this.attackBox.position.y = this.position.y;
    if (
      this.state === "jump" &&
      this.position.y + this.height >= canvas.height - 55
    )
      this.idle();
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 55) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }
  }
}

export default Fighter;
