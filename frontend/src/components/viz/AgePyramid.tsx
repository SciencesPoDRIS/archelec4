import { FC } from "react";

import { DashboardDataType } from "../../types/viz";

export const AgePyramid: FC<{ data: DashboardDataType["agePyramid"] }> = ({ data }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Pyramide des ages</h2>
      </div>

      {data.map((value: DashboardDataType["agePyramid"][0]) => (
        <div className="row">
          <span className="col-4">{value["age-tranche"]}</span>
          <span className="col-4">{value.sexe}</span>
          <span className="col-4">{value.candidat_count}</span>
        </div>
      ))}
    </div>
  );
};
