export type Keybinds = {
  left: string;
  right: string;
  jump: string;
  block: string;
  attack1: string;
  attack2: string;
};

export type Coordinates = { x: number; y: number };

export type FighterState =
  | "idle"
  | "jump"
  | "run"
  | "attack1"
  | "attack2"
  | "block"
  | "fall"
  | "damaged";

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
  animations: SpriteAnimations;
  attacks: {
    attack1: Attack;
    attack2: Attack;
  };
};

export type Attack = {
  damage: number;
  attackBox: AttackBox;
};

export type SpriteAnimation = {
  imageSrc: string;
  maxFrames: number;
  speed: number;
  lethalFrame?: number;
};

export type AttackVariant = "attack1" | "attack2";

export type StateParams = {
  state: FighterState;
  isLooping: boolean;
};
