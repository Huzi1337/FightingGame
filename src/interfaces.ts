import { AttackBox, AttackVariant, Coordinates } from "./types";

export interface IFighterActions {
  run(direction: 1 | -1): void;
  idle(): void;
  jump(): void;
  attack(variant: AttackVariant): void;
  block(): void;
  stopBlocking(): void;
  isStaggered: boolean;
}

export interface IAttackEvent {
  damage: number;
  variant: AttackVariant;
}

export interface IWindUpEvent {
  attackTimer: number;
}

export interface IFighterCollider {
  width: number;
  height: number;
  position: Coordinates;
  attackBox: AttackBox;
  direction: 1 | -1;
}

export interface IGameNavigation {
  startGame(action: "pvAI" | "pvp"): void;
  stopPlaying(): void;
  reset(): void;
  startRound(): void;
}
