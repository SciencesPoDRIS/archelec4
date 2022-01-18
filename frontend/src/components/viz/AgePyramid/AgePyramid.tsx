import { flatten, groupBy, max, min, sortBy, values } from "lodash";
import { FC } from "react";

import { DashboardDataType } from "../../../types/viz";
import { AgeBarData, AgeClassBars, AgeHeaders, AgePyramidTotals, AgeTotalsBars } from "./AgeClassBars";

export const AgePyramid: FC<{ data: DashboardDataType["agePyramid"] }> = ({ data }) => {
  // Age bars data
  let maxNbCandidatByAgeClass = 0;

  const dataByAgeClass: AgeBarData[] = sortBy(
    values(
      groupBy(
        data.filter((d) => d["age-tranche"] !== "Indéterminé"),
        (d) => d["age-tranche"],
      ),
    ).map(
      (group): AgeBarData => {
        maxNbCandidatByAgeClass = max([maxNbCandidatByAgeClass, ...group.map((g) => g.candidat_count)]) || 0;
        return {
          ageClass: group[0]["age-tranche"],
          women: group.find((g) => g.sexe === "Femme")?.candidat_count,
          men: group.find((g) => g.sexe === "Homme")?.candidat_count,
          notKnown: group.find((g) => g.sexe === "Non déterminé")?.candidat_count,
        };
      },
    ),
    (d) => d.ageClass,
  ).reverse();

  // TOTALS
  const totals: AgePyramidTotals = {
    women: {},
    men: {},
    notKnown: {},
  };

  data.forEach((d) => {
    let gender: "women" | "men" | "notKnown" = "notKnown";
    if (d.sexe === "Femme") gender = "women";
    if (d.sexe === "Homme") gender = "men";
    if (d["age-tranche"] !== "Indéterminé") totals[gender].count = (totals[gender]?.count || 0) + d.candidat_count;
    else totals[gender].notKnown = (totals[gender]?.notKnown || 0) + d.candidat_count;
  });
  const maxTotals = max(flatten(values(totals).map((t) => [t.count || 0, t.notKnown || 0]))) || 0;

  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Sexe et âge des candidat(e)s</h2>
      </div>
      <div className="row age-pyramid">
        <AgeHeaders />
        {dataByAgeClass.map((ageBarData) => (
          <AgeClassBars key={ageBarData.ageClass} data={ageBarData} max={maxNbCandidatByAgeClass} />
        ))}

        <AgeTotalsBars totals={totals} max={maxTotals} />
      </div>
    </div>
  );
};
