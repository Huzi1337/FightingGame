import { Character } from "./types";

export const king: Character = {
  animations: {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6, speed: 100 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8, speed: 100 },
    attack1: {
      imageSrc: "/king/Attack_1.png",
      maxFrames: 6,
      lethalFrame: 4,
      speed: 100,
    },
    attack2: {
      imageSrc: "/king/Attack_2.png",
      maxFrames: 6,
      lethalFrame: 4,
      speed: 200,
    },
    block: { imageSrc: "/king/Block.png", maxFrames: 1, speed: 100 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2, speed: 100 },
    damaged: { imageSrc: "/king/Hit.png", maxFrames: 4, speed: 100 },
    staggered: { imageSrc: "/king/Stagger.png", maxFrames: 1, speed: 100 },
    death: { imageSrc: "/king/Death.png", maxFrames: 11, speed: 100 },
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
    idle: { imageSrc: "/rogue/Idle.png", maxFrames: 10, speed: 120 },
    run: { imageSrc: "/rogue/Run.png", maxFrames: 8, speed: 100 },
    attack1: {
      imageSrc: "/rogue/Attack1.png",
      maxFrames: 7,
      speed: 50,
      lethalFrame: 5,
    },
    attack2: {
      imageSrc: "/rogue/Attack3.png",
      maxFrames: 8,
      speed: 140,
      lethalFrame: 5,
    },

    jump: { imageSrc: "/rogue/Jump.png", maxFrames: 3, speed: 100 },
    damaged: { imageSrc: "/rogue/Hit.png", maxFrames: 3, speed: 100 },
    block: { imageSrc: "/rogue/Block.png", maxFrames: 1, speed: 100 },
    staggered: { imageSrc: "/rogue/Stagger.png", maxFrames: 1, speed: 100 },
    death: { imageSrc: "/rogue/Death.png", maxFrames: 7, speed: 100 },
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
        width: 130,
        height: 100,
        offset: { x: 0, y: 0 },
      },
    },
  },
};
