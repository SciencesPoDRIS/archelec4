import { FC } from "react";

import { DashboardDataType } from "../../types/viz";

export const Timeline: FC<{ data: DashboardDataType["timeline"] }> = ({ data }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Timeline</h2>
      </div>

      {data.map((value: DashboardDataType["timeline"][0]) => (
        <div className="row">
          <span className="col-4">{value.annee}</span>
          <span className="col-4">{value.doc_count}</span>
          <span className="col-4">{value.dates.map((d: Date) => d.toLocaleDateString("fr-FR")).join(", ")}</span>
        </div>
      ))}
    </div>
  );
};
