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
    <div className="container-fluid">
      <div className="row mb-5">
        <div className="col-12">
          <Timeline data={result.data.timeline} />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <Cartography data={result.data.carto} />
        </div>
        <div className="col-6">
          <TopValues title="Soutiens" data={result.data.topSoutiens} />
        </div>
      </div>
    </div>
  );
};
