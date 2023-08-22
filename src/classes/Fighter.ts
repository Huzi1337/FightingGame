import { Subject } from "rxjs";
import { GRAVITY, canvas, c } from "../data";
import {
  AttackBox,
  AttackVariant,
  Character,
  Coordinates,
  FighterState,
  SpriteAnimation,
} from "../types";
import { IFighterCollider } from "../classes";
import { IAttackEvent, IFighterActions } from "../interfaces";

class Fighter implements IFighterCollider, IFighterActions {
  private moveSpeed = 4;
  private jumpSpeed = -7;
  // private isInvulnerable = false;
  // private isDuringAnimation = false;
  public height = 150;
  public width = 80;

  private direction = 1;
  public lastKey = "";
  public attackBox: AttackBox;
  public health;
  public image;
  private animationRef = 0;
  public currentFrame = 0;
  private state: FighterState = "idle";
  private attackEvent;

  private _isAttacking = false;
  private _isBlocking = false;

  constructor(
    public position: Coordinates,
    public velocity: Coordinates,
    public offset: Coordinates,
    public character: Character,

    public scale = 1,
    public animationSpeed = 1000
  ) {
    this.character = JSON.parse(JSON.stringify(character));
    this.attackEvent = new Subject<IAttackEvent>();
    this.attackBox = JSON.parse(
      JSON.stringify(character.attacks.attack1.attackBox)
    );
    if (this.direction > 0)
      this.character.attacks.attack1.attackBox.offset.x = this.width;
    console.log(this.attackBox.offset.x);
    this.health = 100;
    this.image = new Image();
    this.image.src = (this.character.actions.idle as SpriteAnimation).imageSrc;

    this.animate();
  }
  setState(state: FighterState) {
    if (this.state != state) {
      this.state = state;
      this.image.src = (
        this.character.actions[state] as SpriteAnimation
      ).imageSrc;
      clearTimeout(this.animationRef);
      this.currentFrame = 0;
      this.animate();
    }
  }

  getDirection() {
    return this.direction;
  }

  damaged(damage: number) {
    this.health -= damage;
  }

  animate() {
    this.animationRef = setTimeout(
      this.animate.bind(this),
      this.animationSpeed
    );
    if (
      this.currentFrame <
      (this.character.actions[this.state] as SpriteAnimation).maxFrames - 1
    )
      this.currentFrame++;
    else this.currentFrame = 0;
  }

  draw() {
    if (c != null) {
      const animation = this.character.actions[this.state] as SpriteAnimation;
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
    if (this._isBlocking) this.stopBlocking();
    if (!this._isAttacking) {
      if (this.direction != direction) {
        this.direction = direction;

        this.attackBox.width *= -1;
        if (this.attackBox.width > 0) this.attackBox.offset.x = this.width;
        else this.attackBox.offset.x = 0;
      }
      this.setState("run");
      this.velocity.x = this.moveSpeed * direction;
    }
  }

  idle() {
    this.velocity.x = 0;
    this.setState("idle");
  }

  jump() {
    if (!this._isAttacking && this.velocity.y === 0) {
      this.setState("jump");
      this.velocity.y = this.jumpSpeed;
    }
  }
  fall() {
    if (!this._isAttacking) {
      this.setState("fall");
    }
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
      this.velocity.y += GRAVITY;
    }
  }

  attack(variant: AttackVariant) {
    if (this._isAttacking === false) {
      this._isAttacking = true;
      this.setState(variant);
      console.log(this.character.attacks[variant].attackBox.width);
      this.attackBox = {
        ...this.character.attacks[variant].attackBox,
        offset: {
          y: this.character.attacks[variant].attackBox.offset.y,
          x: this.direction > 0 ? this.width : 0,
        },
        width: this.character.attacks[variant].attackBox.width * this.direction,
        position: {
          x: this.position.x,
          y: this.position.y,
        },
      };
      this.attackEvent.next({ damage: this.character.attacks[variant].damage });
      this.velocity.x = 0;

      const attackSpeed =
        (this.character.actions[variant] as SpriteAnimation).maxFrames *
        this.animationSpeed;

      setTimeout(() => {
        console.log("stopped attacking");
        this._isAttacking = false;
        this.idle();
      }, attackSpeed);
    }
  }

  block() {
    this._isBlocking = true;
    this.setState("block");
  }

  stopBlocking() {
    this._isBlocking = false;
    this.idle();
  }

  get isBlocking(): boolean {
    return this._isBlocking;
  }

  get isAttacking(): boolean {
    return this._isAttacking;
  }

  get event$() {
    return this.attackEvent.asObservable();
  }
}

export default Fighter;
