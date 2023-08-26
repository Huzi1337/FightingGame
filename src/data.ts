import { Keybinds } from "./types";

export const canvas = document.getElementById("app") as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;

export const c = canvas?.getContext("2d");
export const GRAVITY = 0.2;

export const PLAYER1_KEYBINDS: Keybinds = {
  left: "KeyA",
  right: "KeyD",
  jump: "KeyW",
  attack1: "Space",
  attack2: "ShiftLeft",
  block: "Semicolon",
};

export const PLAYER2_KEYBINDS: Keybinds = {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  attack1: "ArrowDown",
  attack2: "ControlRight",
  block: "Numpad0",
};
