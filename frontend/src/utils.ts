import { toNumber } from "lodash";

export function tooltipPosition(coordinates: [number, number], element: HTMLElement): void {
  // constant
  const offset = 10;
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const mouseX = coordinates[0];
  const mouseY = coordinates[1];
  const elementWidth = element.offsetWidth;
  const elementHeight = element.offsetHeight;

  // compute diagonals
  const diagTopLeft = Math.pow(mouseX, 2) + Math.pow(mouseY, 2);
  const diagTopRight = Math.pow(maxX - mouseX, 2) + Math.pow(mouseY, 2);
  const diagBottomleft = Math.pow(mouseX, 2) + Math.pow(maxY - mouseY, 2);
  const diagBottomRight = Math.pow(maxX - mouseX, 2) + Math.pow(maxY - mouseY, 2);

  if (diagTopLeft > diagTopRight && diagTopLeft > diagBottomleft && diagTopLeft > diagBottomRight) {
    // display in top / Left
    element.style.top = `${mouseY - elementHeight - offset}px`;
    element.style.left = `${mouseX - elementWidth - offset}px`;
  } else if (diagTopRight > diagTopLeft && diagTopRight > diagBottomleft && diagTopRight > diagBottomRight) {
    // display in top / right
    element.style.top = `${mouseY - elementHeight - offset}px`;
    element.style.left = `${mouseX + offset}px`;
  } else if (diagBottomleft > diagTopLeft && diagBottomleft > diagTopLeft && diagBottomleft > diagBottomRight) {
    // display in bottom / left
    element.style.top = `${mouseY + offset}px`;
    element.style.left = `${mouseX - elementWidth - offset}px`;
  } else {
    // display in bottom / right;
    element.style.top = `${mouseY + offset}px`;
    element.style.left = `${mouseX + offset}px`;
  }
}

/**
 * Check if the value is a number or not
 */
export function isNumber(value: unknown): boolean {
  return !Number.isNaN(toNumber(value));
}
