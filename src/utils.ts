import { IFighterCollider } from "./classes";

export const rectangularCollision = (
  rectangle1: IFighterCollider,
  rectangle2: IFighterCollider
) => {
  const isFacingRight = rectangle1.attackBox.width > 0;
  const attackOuterEdgeX =
    rectangle1.attackBox.position.x +
    rectangle1.attackBox.width +
    rectangle1.attackBox.offset.x;
  const enemyBackEdgeX = rectangle2.position.x;
  const enemyOuterEdgeX = rectangle2.position.x + rectangle2.width;
  const attackInnerEdgeX = rectangle1.attackBox.position.x;

  const value = attackOuterEdgeX >= enemyBackEdgeX && isFacingRight;

  attackInnerEdgeX > enemyOuterEdgeX &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.height;
  return value;
};
