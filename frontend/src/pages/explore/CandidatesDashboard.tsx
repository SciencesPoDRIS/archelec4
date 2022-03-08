import { FC } from "react";

import { ESSearchQueryContext } from "../../types";
import { DashboardDataType } from "../../types/viz";
import { AgePyramid } from "../../components/viz/AgePyramid/AgePyramid";
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
    <div className="container-fluid  px-0">
      <div className="row mb-4">
        <div className="col-12">
          <i>
            Ces visualisations représentent des nombres de candidat(e)s des professions de foi qu'ils soient titulaires
            ou suppléants.
          </i>
        </div>
      </div>
      <div className="row mb-5 row-cols-1 row-cols-md-2">
        <div className="col col-md-8">
          <AgePyramid data={result.data.agePyramid} />
        </div>
        <div className="col col-md-4">
          <TopValues title="Mots des professions" data={result.data.topProfessions} className="occupation" />
        </div>
      </div>

      <div className="row mb-1 row-cols-1 row-cols-md-3">
        <div className="col border-right">
          <TopValues title="Soutiens" data={result.data.topSoutiens} className="politic" />
        </div>
        <div className="col border-right">
          {" "}
          <TopValues title="Mots des listes" data={result.data.topListes} className="politic" />
        </div>
        <div className="col ">
          <TopValues title="Mandats" data={result.data.topMandats} className="occupation" />
        </div>
      </div>
    </div>
  );
};
