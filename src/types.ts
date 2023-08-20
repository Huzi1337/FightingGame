export type Keybinds = {
  left: string;
  right: string;
  jump: string;
  attack1: string;
  attack2: string;
};

export type Coordinates = { x: number; y: number };

export type FighterState = "idle" | "jump" | "run" | "attack1" | "fall";

export type SpriteAnimations = Partial<Record<FighterState, SpriteAnimation>>;

export type AttackBox = {
  position: {
    x: number;
    y: number;
  };
  offset: Coordinates;
  width: number;
  height: number;
};

export type Character = {
  actions: SpriteAnimations;
  attackBoxes: {
    attack1: AttackBox;
    attack2: AttackBox;
  };
};

export type SpriteAnimation = {
  imageSrc: string;
  maxFrames: number;
};
