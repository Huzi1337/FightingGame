export const canvas = document.getElementById("app") as HTMLCanvasElement;
canvas.width = 1280;
canvas.height = 720;

export const c = canvas?.getContext("2d");
export const GRAVITY = 0.1;
