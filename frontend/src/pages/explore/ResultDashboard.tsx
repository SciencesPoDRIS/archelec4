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

      <div className="row"></div>
      <div className="row">
        <div className="col"></div>
        <div className="col-10">
          <AgePyramid data={result.data.agePyramid} />
        </div>
        <div className="col"></div>
      </div>

      <div className="row">
        <div className="col-4">
          <TopValues title="Mots des professions" data={result.data.topProfessions} />
        </div>
        <div className="col-4">
          <TopValues title="Mandats" data={result.data.topMandats} />
        </div>
        <div className="col-4">
          {" "}
          <TopValues title="Mots des listes" data={result.data.topListes} />
        </div>
      </div>
    </div>
  );
};
