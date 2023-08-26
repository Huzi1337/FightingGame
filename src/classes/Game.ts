import { Subscription } from "rxjs";
import { rectangularCollision } from "../utils";
import Fighter from "./Fighter";
import { IAttackEvent } from "../interfaces";
import { PlayerControl } from "./PlayerControl";
import AIControl from "./AIControl";
import { PLAYER1_KEYBINDS, PLAYER2_KEYBINDS, c, canvas } from "../data";
import { Sprite } from "../classes";

class Game {
  private gameOver = true;
  private animationLoop: number | null = null;
  private player1AttackSubscription: Subscription;
  private player2AttackSubscription: Subscription;
  private player1Controls: PlayerControl | null = null;
  private player2Controls: PlayerControl | AIControl | null = null;

  constructor(
    private player1: Fighter,
    private player2: Fighter,
    private timer: number,
    private verdictElement: HTMLDivElement,
    private timerElement: HTMLDivElement,
    private environment: Sprite[]
  ) {
    this.player1AttackSubscription = player1.attackEvent.subscribe((data) =>
      this.player1Attack(data)
    );
    this.player2AttackSubscription = player2.attackEvent.subscribe((data) =>
      this.player2Attack(data)
    );
    console.log(this.timer);
    console.log(this.timerElement);
    this.player1 = player1;
    this.player2 = player2;
  }

  resolvePlayerAttack(
    attacker: Fighter,
    defender: Fighter,
    { damage, variant }: IAttackEvent,
    defenderHpbarId: string
  ) {
    if (rectangularCollision(attacker, defender)) {
      if (defender.isBlocking) {
        if (variant === "attack1") {
          attacker.pushedBack(defender.direction);
          attacker.staggered(1000);
        } else if (variant === "attack2") {
          defender.damaged(damage);
          defender.stopBlocking();
          defender.pushedBack(attacker.direction);
        }
      } else {
        if (defender.attackTimer) {
          clearTimeout(defender.attackTimer);
          defender.attackTimer = null;
        }
        defender.pushedBack(attacker.direction);
        defender.damaged(damage);
      }

      (
        document.querySelector(`#${defenderHpbarId}`) as HTMLDivElement
      ).style.width = `${defender.health}%`;
      if (defender.health <= 0) {
        defender.die();
        this.endGame();
      }
    }
    console.log(
      document.querySelector(`#${defenderHpbarId}`) as HTMLDivElement
    );
    console.log(defenderHpbarId, defender.health);
  }

  player1Attack(data: IAttackEvent) {
    this.resolvePlayerAttack(this.player1, this.player2, data, "player2Health");
  }

  player2Attack(data: IAttackEvent) {
    this.resolvePlayerAttack(this.player2, this.player1, data, "player1Health");
  }

  decreaseTimer() {
    console.log("timer decreased", this.timer);
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
    this.verdictElement.style.display = "flex";
    if (this.player1.health === this.player2.health)
      (
        this.verdictElement.querySelector("h1") as HTMLHeadingElement
      ).textContent = "draw";
    else if (this.player1.health > this.player2.health)
      (
        this.verdictElement.querySelector("h1") as HTMLHeadingElement
      ).textContent = "Player 1 wins";
    else
      (
        this.verdictElement.querySelector("h1") as HTMLHeadingElement
      ).textContent = "Player 2 wins";
  }

  getGameOver() {
    return this.gameOver;
  }
  endGame() {
    this.player1.velocity.x = 0;
    this.player2.velocity.x = 0;
    this.gameOver = true;
    this.determineWinner();
  }

  reset() {
    this.verdictElement.style.display = "none";
    this.resetPlayer(this.player1, 10, "player1Health");
    this.resetPlayer(this.player2, 1000, "player2Health");
    this.timer = 60;
  }

  resetPlayer(fighter: Fighter, initialXPos: number, hpbarId: string) {
    fighter.position.x = initialXPos;
    fighter.clearStaggered();
    fighter.idle();
    fighter.health = 100;
    console.log(hpbarId);
    console.log(document.querySelector(`#${hpbarId}`));
    (
      document.querySelector(`#${hpbarId}`) as HTMLDivElement
    ).style.width = `${fighter.health}%`;
  }

  startRound() {
    this.gameOver = false;
    this.decreaseTimer();
  }

  startGame(mode: "pvAI" | "pvp") {
    this.player1Controls = new PlayerControl(this.player1, PLAYER1_KEYBINDS);
    this.player2Controls =
      mode === "pvp"
        ? new PlayerControl(this.player2, PLAYER2_KEYBINDS)
        : new AIControl({ player: this.player1, AIFighter: this.player2 });

    const animate = () => {
      this.animationLoop = window.requestAnimationFrame(animate);
      if (c != null) {
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);
      }
      this.environment.forEach((sprite) => sprite.update());

      this.player1.update();
      this.player2.update();
      if (this.player2Controls instanceof AIControl)
        this.player2Controls.update();
    };
    animate();
  }

  stopPlaying() {
    if (this.animationLoop && c) {
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
      window.cancelAnimationFrame(this.animationLoop);
    }
    this.reset();
    this.player1Controls?.destroy();
    this.player1Controls = null;
    if (this.player2Controls instanceof PlayerControl)
      this.player2Controls.destroy();
    this.player2Controls = null;
  }

  update() {}

  destroy() {
    this.player1AttackSubscription.unsubscribe();
    this.player2AttackSubscription.unsubscribe();
  }
}

export default Game;
