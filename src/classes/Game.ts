import { Subscription } from "rxjs";
import { rectangularCollision } from "../utils";
import Fighter from "./Fighter";
import { IAttackEvent } from "../interfaces";

class Game {
  private gameOver = false;
  private player1subscription: Subscription;
  private player2subscription: Subscription;

  constructor(
    private player1: Fighter,
    private player2: Fighter,
    private timer: number,
    private verdict: HTMLDivElement,
    private timerElement: HTMLDivElement
  ) {
    this.player1Attack = this.player1Attack.bind(this);
    this.player2Attack = this.player2Attack.bind(this);

    this.player1subscription = player1.event$.subscribe(this.player1Attack);
    this.player2subscription = player2.event$.subscribe(this.player2Attack);
    this.player1 = player1;
    this.player2 = player2;
  }

  reset() {
    this.gameOver = true;
  }

  resolvePlayerAttack(
    attacker: Fighter,
    defender: Fighter,
    { damage }: IAttackEvent,
    defenderHpbarId: string
  ) {
    if (rectangularCollision(attacker, defender)) {
      if (defender.isBlocking) {
        defender.damaged(damage / 2);
        attacker.pushedBack(defender.direction);
      } else {
        defender.pushedBack(attacker.direction);
        defender.damaged(damage);
      }
      (
        document.querySelector(`#${defenderHpbarId}`) as HTMLDivElement
      ).style.width = `${defender.health}%`;
      if (defender.health <= 0) this.endGame();
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
      this.verdict.innerHTML = "draw";
    else if (this.player1.health > this.player2.health)
      this.verdict.innerHTML = "Player 1 wins";
    else this.verdict.innerHTML = "Player 2 wins";
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
    this.player1subscription.unsubscribe();
    this.player2subscription.unsubscribe();
  }
}

export default Game;
