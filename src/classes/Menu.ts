import Game from "./Game";

class Menu {
  private buttons: { [key: string]: HTMLButtonElement };
  constructor(private game: Game) {
    this.buttons = {};

    const buttonElements = document.querySelectorAll<HTMLButtonElement>(
      "button[data-action]"
    );
    buttonElements.forEach((button) => {
      const action = button.getAttribute("data-action");
      if (action) {
        this.buttons[action] = button;
        if (action === "pvAI" || action === "pvp")
          button.addEventListener("click", () => this.game.startGame(action));
      }
    });
  }
}

export default Menu;
