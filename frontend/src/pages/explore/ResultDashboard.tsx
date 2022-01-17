import { FC } from "react";

import { ESSearchQueryContext } from "../../types";
import { DashboardDataType } from "../../types/viz";
import { Cartography } from "../../components/viz/Cartography";
import { AgePyramid } from "../../components/viz/AgePyramid/AgePyramid";
import { Timeline } from "../../components/viz/timeline";
import { TopValues } from "../../components/viz/TopValues";

interface ResultDashboardProps {
  context: ESSearchQueryContext;
  result: {
    data: DashboardDataType;
    total: number;
  };
}
export const ResultDashboard: FC<ResultDashboardProps> = ({ result }) => {
  console.log(result);
  return (
    <div className="container-fluid">
      <div className="row">
        <Cartography data={result.data.carto} />
      </div>
      <div className="row">
        <AgePyramid data={result.data.agePyramid} />
      </div>
      <div className="row">
        <Timeline data={result.data.timeline} />
      </div>
      <div className="row">
        <TopValues data={result.data.topListes} />
      </div>
      <div className="row">
        <TopValues data={result.data.topMandats} />
      </div>
      <div className="row">
        <TopValues data={result.data.topSoutiens} />
      </div>
    </div>
  );
};
