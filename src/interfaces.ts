export interface IFighterActions {
  run(direction: 1 | -1): void;
  stop(): void;
  jump(): void;
  attack1(variant: any): void;
  attack2(): void;
}
