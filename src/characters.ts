import { Character } from "./types";

export const king: Character = {
  actions: {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/king/Attack_1.png", maxFrames: 6 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2 },
  },
  attackBoxes: {
    attack1: {
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 30,
      offset: { x: 0, y: 0 },
    },
    attack2: {
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 30,
      offset: { x: 0, y: 0 },
    },
  },
};

export const king2: Character = {
  actions: {
    idle: { imageSrc: "/king/Idle.png", maxFrames: 6 },
    run: { imageSrc: "/king/Run.png", maxFrames: 8 },
    attack1: { imageSrc: "/king/Attack_1.png", maxFrames: 6 },
    jump: { imageSrc: "/king/Jump.png", maxFrames: 2 },
  },
  attackBoxes: {
    attack1: {
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 30,
      offset: { x: 0, y: 0 },
    },
    attack2: {
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 30,
      offset: { x: 0, y: 0 },
    },
  },
};
