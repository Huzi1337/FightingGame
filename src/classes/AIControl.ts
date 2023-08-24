import { rectangularCollision } from "../utils";
import Fighter from "./Fighter";

type AIControlParameters = {
  player: Fighter;
  AIFighter: Fighter;
};

class AIControl {
  private player: Fighter;
  private AIFighter: Fighter;
  constructor({ player, AIFighter }: AIControlParameters) {
    this.player = player;
    this.AIFighter = AIFighter;
  }

  moveTowardsPlayer() {
    if (this.player.position.x < this.AIFighter.position.x) {
      this.AIFighter.run(-1);
    } else {
      this.AIFighter.run(1);
    }
  }

  attack() {
    if (rectangularCollision(this.AIFighter, this.player))
      this.AIFighter.attack("attack1");
  }

  update() {
    if (!this.AIFighter.isStaggered) {
      this.attack();
      this.moveTowardsPlayer();
    }
  }
}

export default AIControl;
