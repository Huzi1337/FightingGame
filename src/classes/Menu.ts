import { IGameNavigation } from "../interfaces";

class Menu {
  private buttons: { [key: string]: HTMLButtonElement };
  private menuContainer: HTMLDivElement = document.querySelector(
    "#menu"
  ) as HTMLDivElement;

  constructor(readonly game: IGameNavigation) {
    this.buttons = {};
    const buttonElements = document.querySelectorAll<HTMLButtonElement>(
      "button[data-action]"
    );
    buttonElements.forEach((button) => {
      const action = button.getAttribute("data-action");
      if (action) {
        this.buttons[action] = button;
        this.attachButtonEventListener(action, button);
      }
    });
  }

  toggleVisible(element: HTMLElement) {
    console.log(element, "toggled!");
    element.classList.toggle("hide");
  }

  private attachButtonEventListener(action: string, button: HTMLButtonElement) {
    switch (action) {
      case "pvAI":
      case "pvp":
        button.addEventListener("click", () => {
          this.toggleVisible(this.menuContainer);
          this.game.startGame(action);
        });
        break;
      case "reset":
        button.addEventListener("click", () => {
          this.game.reset();
          this.game.startRound();
        });

        break;
      case "mainMenu":
        button.addEventListener("click", () => {
          this.game.stopPlaying();
          this.toggleVisible(this.menuContainer);
        });
        break;
    }
  }
}

export default Menu;
