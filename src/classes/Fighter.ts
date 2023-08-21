import { Subject } from "rxjs";
import { GRAVITY, canvas, c } from "../data";
import {
  AttackBox,
  Character,
  Coordinates,
  FighterState,
  SpriteAnimation,
} from "../types";
import { IFighterCollider } from "../classes";
import { IFighterActions } from "../interfaces";

class Fighter implements IFighterCollider, IFighterActions {
  private moveSpeed = 4;
  private jumpSpeed = -5;
  // private isInvulnerable = false;
  // private isDuringAnimation = false;
  public height = 150;
  public width = 80;

  private direction = 1;
  public lastKey = "";
  public attackBox: AttackBox;
  public isAttacking = false;
  public health;
  public image;
  private animationRef = 0;
  public currentFrame = 0;
  private state: FighterState = "idle";
  private attackEvent;

  constructor(
    public position: Coordinates,
    public velocity: Coordinates,
    public offset: Coordinates,
    public character: Character,

    public scale = 1,
    public animationSpeed = 1000
  ) {
    this.attackEvent = new Subject<any>();
    this.attackBox = character.attackBoxes.attack1;
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

      c.fillRect(
        this.attackBox.position.x + this.attackBox.offset.x,
        this.attackBox.position.y + this.attackBox.offset.y,
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

        this.attackBox.width *= -1;
        if (this.attackBox.width > 0) this.attackBox.offset.x = this.width;
        else this.attackBox.offset.x = 0;
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
      this.velocity.y += GRAVITY;
    }
  }

  attack1(variant: any) {
    if (this.isAttacking === false) {
      this.attackEvent.next(variant);
      this.setState("attack1");
      this.velocity.x = 0;
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
        this.stop();
      }, (this.character.actions.attack1 as SpriteAnimation).maxFrames * this.animationSpeed);
    }
  }
  attack2() {
    console.log("Attack 2!");
  }

  get event$() {
    return this.attackEvent.asObservable();
  }
}

export default Fighter;
