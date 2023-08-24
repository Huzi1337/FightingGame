import { Subscription } from "rxjs";
import { rectangularCollision } from "../utils";
import Fighter from "./Fighter";
import { IAttackEvent } from "../interfaces";

class Game {
  private gameOver = false;

  private player1AttackSubscription: Subscription;
  private player2AttackSubscription: Subscription;

  constructor(
    private player1: Fighter,
    private player2: Fighter,
    private timer: number,
    private verdict: HTMLDivElement,
    private timerElement: HTMLDivElement
  ) {
    this.player1AttackSubscription = player1.attackEvent.subscribe((data) =>
      this.player1Attack(data)
    );
    this.player2AttackSubscription = player2.attackEvent.subscribe((data) =>
      this.player2Attack(data)
    );

    this.player1 = player1;
    this.player2 = player2;
  }

  reset() {
    this.gameOver = true;
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
    console.log(defenderHpbarId, defender.health);
  }

  player1Attack(data: IAttackEvent) {
    this.resolvePlayerAttack(this.player1, this.player2, data, "player2Health");
  }

  player2Attack(data: IAttackEvent) {
    this.resolvePlayerAttack(this.player2, this.player1, data, "player1Health");
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
      this.verdict.textContent = "draw";
    else if (this.player1.health > this.player2.health)
      this.verdict.textContent = "Player 1 wins";
    else this.verdict.textContent = "Player 2 wins";
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

  update() {}

  destroy() {
    this.player1AttackSubscription.unsubscribe();
    this.player2AttackSubscription.unsubscribe();
  }
}

export default Game;
