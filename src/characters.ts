import { Character } from "./types";

export const king: Character = {
  animations: {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/king/Attack_1.png", maxFrames: 6, lethalFrame: 4 },
    attack2: { imageSrc: "/king/Attack_2.png", maxFrames: 6, lethalFrame: 4 },
    block: { imageSrc: "/king/Block.png", maxFrames: 1 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2 },
    damaged: { imageSrc: "/king/Hit.png", maxFrames: 4 },
  },
  attacks: {
    attack1: {
      damage: 20,
      attackBox: {
        position: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        offset: { x: 0, y: 0 },
      },
    },
    attack2: {
      damage: 10,
      attackBox: {
        position: {
          x: 0,
          y: 0,
        },
        width: 300,
        height: 30,
        offset: { x: 0, y: 70 },
      },
    },
  },
};

export const rogue: Character = {
  animations: {
    idle: { imageSrc: "/rogue/Idle.png", maxFrames: 10 },
    run: { imageSrc: "/rogue/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/rogue/Attack1.png", maxFrames: 7 },
    attack2: { imageSrc: "/rogue/Attack2.png", maxFrames: 7 },

    jump: { imageSrc: "/rogue/Jump.png", maxFrames: 3 },
    damaged: { imageSrc: "/rogue/Hit.png", maxFrames: 3 },
  },
  attacks: {
    attack1: {
      damage: 5,
      attackBox: {
        position: {
          x: 0,
          y: 0,
        },
        width: 100,
        height: 100,
        offset: { x: 0, y: 0 },
      },
    },
    attack2: {
      damage: 10,
      attackBox: {
        position: {
          x: 0,
          y: 0,
        },
        width: 300,
        height: 30,
        offset: { x: 0, y: 70 },
      },
    },
  },
};
