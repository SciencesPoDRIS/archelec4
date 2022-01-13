import { FC } from "react";
import { agePyramidConfig } from "./config";

export const NotKnownBar: FC<{ count: number }> = ({ count }) => (
  <div
    style={{ width: "100%", height: "80%", background: agePyramidConfig.colors.notknown }}
    className="d-flex align-items-center justify-content-center"
  >
    {count}
  </div>
);
