import { IFighter } from "../interfaces";
import { Keybinds } from "../types";

export class PlayerControl {
  private keyStatus = {
    left: {
      pressed: false,
    },
    right: {
      pressed: false,
    },
    jump: {
      pressed: false,
    },
    attack1: {
      pressed: false,
    },
    attack2: {
      pressed: false,
    },
  };

  constructor(private player: IFighter, private keybinds: Keybinds) {
    window.addEventListener("keydown", (event) =>
      this.readKeyDownInput(event.code)
    );
    window.addEventListener("keyup", (event) =>
      this.readKeyUpInput(event.code)
    );
  }

  destroy() {
    window.removeEventListener("keydown", (event) =>
      this.readKeyDownInput(event.code)
    );
    window.removeEventListener("keyup", (event) =>
      this.readKeyUpInput(event.code)
    );
  }

  readKeyDownInput(key: string) {
    if (!this.player.isStaggered)
      switch (key) {
        case this.keybinds.left:
          this.keyStatus.left.pressed = true;
          this.player.run(-1);
          break;
        case this.keybinds.right:
          this.keyStatus.right.pressed = true;
          this.player.run(1);
          break;
        case this.keybinds.jump:
          this.player.jump();
          break;
        case this.keybinds.attack1:
          this.player.attack("attack1");
          break;
        case this.keybinds.attack2:
          this.player.attack("attack2");

          break;
        case this.keybinds.block:
          this.player.block();
          break;
      }
  }

  readKeyUpInput(key: string) {
    if (!this.player.isStaggered)
      switch (key) {
        case this.keybinds.left:
          this.keyStatus.left.pressed = false;
          if (
            !this.keyStatus.left.pressed &&
            !this.keyStatus.right.pressed &&
            !this.player.isAttacking
          )
            this.player.idle();
          break;
        case this.keybinds.right:
          this.keyStatus.right.pressed = false;
          if (
            !this.keyStatus.left.pressed &&
            !this.keyStatus.right.pressed &&
            !this.player.isAttacking
          )
            this.player.idle();
          break;
        case this.keybinds.block:
          this.player.stopBlocking();
          break;
      }
  }

  update() {}
}
