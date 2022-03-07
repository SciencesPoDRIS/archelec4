import { flatten, groupBy, max, min, sortBy, values } from "lodash";
import { FC } from "react";
import { useStateUrl } from "../../../hooks/state-url";

import { DashboardDataType } from "../../../types/viz";
import { SEPARATOR } from "../../filters/utils";
import { AgeBarData, AgeClassBars, AgeHeaders, AgePyramidTotals, AgeTotalsBars } from "./AgeClassBars";

export const AgePyramid: FC<{ data: DashboardDataType["agePyramid"] }> = ({ data }) => {
  // Age bars data
  let maxNbCandidatByAgeClass = 0;

  const dataByAgeClass: AgeBarData[] = sortBy(
    values(
      groupBy(
        data.filter((d) => d["age-tranche"] !== "non mentionné"),
        (d) => d["age-tranche"],
      ),
    ).map(
      (group): AgeBarData => {
        maxNbCandidatByAgeClass = max([maxNbCandidatByAgeClass, ...group.map((g) => g.candidat_count)]) || 0;
        return {
          ageClass: group[0]["age-tranche"],
          women: group.find((g) => g.sexe === "femme")?.candidat_count,
          men: group.find((g) => g.sexe === "homme")?.candidat_count,
          notKnown: group.find((g) => g.sexe === "non déterminé")?.candidat_count,
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
    if (d.sexe === "femme") gender = "women";
    if (d.sexe === "homme") gender = "men";
    if (d["age-tranche"] !== "non mentionné") totals[gender].count = (totals[gender]?.count || 0) + d.candidat_count;
    else totals[gender].notKnown = (totals[gender]?.notKnown || 0) + d.candidat_count;
  });
  const maxTotals = max(flatten(values(totals).map((t) => [t.count || 0, t.notKnown || 0]))) || 0;

  // filter link  factory
  const [sexeFilter, ,] = useStateUrl<string>("candidats.sexe", "");
  const [ageFilter, , getAgeFilterURL] = useStateUrl<string>("candidats.age-tranche", "");
  const selectedAges = ageFilter.split(SEPARATOR).filter((e) => e !== "");
  const selectedSexe = sexeFilter.split(SEPARATOR).filter((e) => e !== "");
  const getFilterLink = (sexe: string, age_classe: string): Partial<Location> => {
    let newAgeFilter = ageFilter;
    let newSexeFilter = sexeFilter;

    if (selectedAges.includes(age_classe) && selectedSexe.includes(sexe)) {
      newAgeFilter = selectedAges.filter((a) => a !== age_classe).join(SEPARATOR);
      newSexeFilter = selectedSexe.filter((a) => a !== sexe).join(SEPARATOR);
    } else {
      if (!selectedAges.includes(age_classe)) newAgeFilter = [...selectedAges, age_classe].join(SEPARATOR);
      if (!selectedSexe.includes(sexe)) newSexeFilter = [...selectedSexe, sexe].join(SEPARATOR);
    }

    const ageLocation = getAgeFilterURL(newAgeFilter);

    const search = new URLSearchParams(ageLocation?.search || "");
    if (newAgeFilter === "") search.delete("candidats.age-tranche");
    else search.set("candidats.age-tranche", newAgeFilter);
    if (newSexeFilter === "") search.delete("candidats.sexe");
    else search.set("candidats.sexe", newSexeFilter);

    return { ...ageLocation, search: search.toString() };
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center mb-2">
        <h2 className="h4">Sexe et âge des candidat(e)s</h2>
      </div>
      <div className="row age-pyramid">
        <AgeHeaders />
        {dataByAgeClass.map((ageBarData) => (
          <AgeClassBars
            key={ageBarData.ageClass}
            data={ageBarData}
            max={maxNbCandidatByAgeClass}
            getFilterLink={getFilterLink}
            selectedAges={selectedAges}
            selectedSexe={selectedSexe}
          />
        ))}

        <AgeTotalsBars
          totals={totals}
          max={maxTotals}
          getFilterLink={getFilterLink}
          selectedAges={selectedAges}
          selectedSexe={selectedSexe}
        />
      </div>
    </div>
  );
};
