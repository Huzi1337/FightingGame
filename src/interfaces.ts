import { AttackVariant } from "./types";

export interface IFighterActions {
  run(direction: 1 | -1): void;
  stop(): void;
  jump(): void;
  attack(variant: AttackVariant): void;
  block(): void;
  stopBlocking(): void;
}

export interface IAttackEvent {
  damage: number;
}
