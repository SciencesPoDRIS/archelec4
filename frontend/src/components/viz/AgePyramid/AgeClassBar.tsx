import { FC } from "react";

export const AgeClassBar: FC<{
  count: number;
  notKnownCount?: number;
  max: number;
  anchored: "left" | "right";
}> = ({ count, notKnownCount, max, anchored }) => {
  const widthRatio = max !== 0 ? (count / max) * 100 : 0;
  const label = notKnownCount
    ? `${count}/${count + notKnownCount} (${Math.round((count / (count + notKnownCount)) * 100)}%)`
    : count;
  const items = [
    //label
    widthRatio <= 90 ? <div className="value-label">{label}</div> : null,
    // count Bar
    <div className="bar" style={{ justifyContent: anchored === "left" ? "end" : "start", width: `${widthRatio}%` }}>
      {widthRatio > 90 && <div className="value-label">{label}</div>}
    </div>,
  ];
  return (
    <div
      className={`d-flex h-100 align-items-center ${
        anchored === "right" ? "justify-content-end" : "justify-content-start"
      }`}
    >
      {anchored === "right" && items}
      {anchored === "left" && items.reverse()}
    </div>
  );
};
