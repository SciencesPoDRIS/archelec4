import React from "react";
import { ProfessionDeFoi } from "../types";
import { ProfessionCard } from "./profession-card";

export const ProfessionList: React.FC<{ list: ProfessionDeFoi[] }> = ({ list }) => {
  return (
    <div className="result-list">
      {list.map((p) => (
        <ProfessionCard key={p.id} profession={p} />
      ))}
    </div>
  );
};
