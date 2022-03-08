import { FC } from "react";

import { ESSearchQueryContext } from "../../types";
import { DashboardDataType } from "../../types/viz";
import { Cartography } from "../../components/viz/Cartography";
import { Timeline } from "../../components/viz/timeline";
import { TopValues } from "../../components/viz/TopValues";

interface ResultDashboardProps {
  context: ESSearchQueryContext;
  result: {
    data: DashboardDataType;
    total: number;
  };
}
export const MainDashboard: FC<ResultDashboardProps> = ({ result }) => {
  return (
    <div className="container-fluid mb-4 px-0">
      <div className="row mb-5">
        <div className="col-12">
          <Timeline data={result.data.timeline} />
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-md-1" />
        <div className="col-12 col-md-10">
          <Cartography data={result.data.carto} />
        </div>

        <div className="col-md-1" />
      </div>
    </div>
  );
};
