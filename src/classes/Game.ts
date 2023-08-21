import { Fighter } from "../classes";
import { Subscription } from "rxjs";
import { rectangularCollision } from "../utils";

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

  resolvePlayer1Attack(data: any) {
    console.log(this.player1.attackBox.width);
    if (rectangularCollision(this.player1, this.player2)) {
      this.player2.damaged(5);
      (
        document.querySelector("#player2Health") as HTMLDivElement
      ).style.width = `${this.player2.health}%`;
      if (this.player2.health <= 0) this.endGame();
    }

    console.log("attack resolved!", data);
  }

  resolvePlayer2Attack(data: any) {
    if (rectangularCollision(this.player2, this.player1)) {
      this.player1.damaged(5);
      (
        document.querySelector("#player1Health") as HTMLDivElement
      ).style.width = `${this.player1.health}%`;
      if (this.player1.health <= 0) this.endGame();
    }
    console.log("attack resolved!", data);
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
