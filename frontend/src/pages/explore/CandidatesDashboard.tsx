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
export const CandidatesDashboard: FC<ResultDashboardProps> = ({ result }) => {
  return (
    <div className="container-fluid mb-4 px-0">
      <div className="row">
        <div className="col" />
        <div className="col-12 col-lg-10">
          <AgePyramid data={result.data.agePyramid} />
        </div>
        <div className="col" />
      </div>

      <hr/>

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
