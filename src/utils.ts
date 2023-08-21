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
  const attackInnerEdgeX =
    rectangle1.attackBox.position.x + rectangle1.attackBox.offset.x;
  const attackTopEdge = rectangle1.attackBox.position.y;
  const attackBotEdge =
    rectangle1.attackBox.position.y + rectangle1.attackBox.height;

  const enemyLeftEdge = rectangle2.position.x;
  const enemyRightEdge = rectangle2.position.x + rectangle2.width;
  const enemyTopEdge = rectangle2.position.y;
  const enemyBotEdge = rectangle2.position.y + rectangle2.height;

  const faceLeftXCheck =
    attackOuterEdgeX <= enemyRightEdge && attackInnerEdgeX >= enemyLeftEdge;
  const faceRightXCheck =
    attackOuterEdgeX >= enemyLeftEdge && attackInnerEdgeX <= enemyRightEdge;

  const value = isFacingRight
    ? faceRightXCheck
    : faceLeftXCheck &&
      attackBotEdge >= enemyTopEdge &&
      attackTopEdge <= enemyBotEdge;
  return value;
};
