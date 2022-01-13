import { FC } from "react";

export const AgeClassBar: FC<{
  count: number;
  notKnownCount?: number;
  max: number;
  color: string;
  anchored: "left" | "right";
}> = ({ count, notKnownCount, max, color, anchored }) => {
  const width = max !== 0 ? (count / max) * 100 : 0;
  const label = notKnownCount
    ? `${count}/${count + notKnownCount} (${Math.round((count / (count + notKnownCount)) * 100)}%)`
    : count;
  // labels are position just before/after the bar or on top of it if no space left
  const LabelPosition =
    width < 90 ? { [anchored]: `calc(${width}% + 0.2em)` } : { [anchored === "left" ? "right" : "left"]: 0 };
  const items = [
    //label
    <div className="position-absolute" style={LabelPosition}>
      {label}
    </div>,
    // notKnownBar
    notKnownCount ? (
      <div
        style={{ height: "80%", width: `${max !== 0 ? (notKnownCount / max) * 100 : 0}%`, background: "lightgrey" }}
      ></div>
    ) : null,
    // count Bar
    <div style={{ height: "80%", width: `${max !== 0 ? (count / max) * 100 : 0}%`, background: color }}></div>,
  ];
  return (
    <div
      className={`d-flex h-100 position-relative align-items-center ${
        anchored === "right" ? "justify-content-end" : "justify-content-start"
      }`}
    >
      {anchored === "right" && items}
      {anchored === "left" && items.reverse()}
    </div>
  );
};
