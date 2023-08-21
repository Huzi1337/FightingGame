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
    this.resolvePlayer1Attack = this.resolvePlayer1Attack.bind(this);
    this.resolvePlayer2Attack = this.resolvePlayer2Attack.bind(this);

    this.player1subscription = player1.event$.subscribe(
      this.resolvePlayer1Attack
    );
    this.player2subscription = player2.event$.subscribe(
      this.resolvePlayer2Attack
    );
    this.player1 = player1;
    this.player2 = player2;
  }

  reset() {
    this.gameOver = true;
  }

  resolvePlayer1Attack({ damage }: IAttackEvent) {
    if (rectangularCollision(this.player1, this.player2)) {
      if (this.player1.isBlocking) {
        this.player2.damaged(damage / 2);
      } else this.player2.damaged(damage);
      (
        document.querySelector("#player2Health") as HTMLDivElement
      ).style.width = `${this.player2.health}%`;
      if (this.player2.health <= 0) this.endGame();
    }

    console.log("Player 2 hp:", this.player2.health);
  }

  resolvePlayer2Attack({ damage }: IAttackEvent) {
    if (rectangularCollision(this.player2, this.player1)) {
      if (this.player1.isBlocking) {
        this.player1.damaged(damage / 2);
      } else this.player1.damaged(damage);

      (
        document.querySelector("#player1Health") as HTMLDivElement
      ).style.width = `${this.player1.health}%`;
      if (this.player1.health <= 0) this.endGame();
    }
    console.log("Player 1 hp:", this.player1.health);
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
