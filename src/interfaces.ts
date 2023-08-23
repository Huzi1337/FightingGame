import { AttackBox, AttackVariant, Coordinates } from "./types";

export interface IFighterActions {
  run(direction: 1 | -1): void;
  idle(): void;
  jump(): void;
  attack(variant: AttackVariant): void;
  block(): void;
  stopBlocking(): void;
}

export interface IAttackEvent {
  damage: number;
}

export interface IFighterCollider {
  width: number;
  height: number;
  position: Coordinates;
  attackBox: AttackBox;
  direction: 1 | -1;
}
