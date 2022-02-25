import { FC } from "react";
import { Link } from "react-router-dom";
import { useStateUrl } from "../../../hooks/state-url";
import { SEPARATOR } from "../../filters/utils";
import { numberFormat } from "../utils";
import { AgeClassBar } from "./AgeClassBar";

export const AgeHeaders: FC = () => (
  <>
    <div className="text-right women-column headers ">Femme</div>
    <div className="mx-2 labels-column headers">Classe d'âge</div>
    <div className="men-column headers">Homme</div>
  </>
);

export interface AgeBarData {
  ageClass: string;
  women?: number;
  men?: number;
  notKnown?: number;
}

const BarLabel: FC<{ label: string; total: number; notKnown?: number }> = ({ label, total, notKnown }) => (
  <div className="labels-column d-flex flex-column mx-2 justify-content-center align-items-center">
    <div>{label}</div>
    <div className="sub-label">
      {numberFormat.format(total)} <span title="candidats">cand.</span>{" "}
      {notKnown ? (
        <>
          {" "}
          ({notKnown} <span title="non déterminé">n.d.</span>)
        </>
      ) : (
        ""
      )}
    </div>
  </div>
);

export const AgeClassBars: FC<{ data: AgeBarData; max: number }> = ({ data, max }) => {
  const [sexeFilter, ,] = useStateUrl<string>("candidats.sexe", "");
  const [ageFilter, , getAgeFilterURL] = useStateUrl<string>("candidats.age-tranche", "");

  const getFilterLink = (sexe: string, age_classe: string): Partial<Location> => {
    const selectedAges = ageFilter.split(SEPARATOR).filter((e) => e !== "");
    const selectedSexe = sexeFilter.split(SEPARATOR).filter((e) => e !== "");

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
    <>
      <Link to={getFilterLink("femme", data.ageClass)} className="women-column">
        {data.women && <AgeClassBar count={data.women} max={max} anchored="right" />}
      </Link>
      <BarLabel label={data.ageClass} total={(data.women || 0) + (data.men || 0)} notKnown={data.notKnown} />
      <Link to={getFilterLink("homme", data.ageClass)} className="men-column">
        {data.men && <AgeClassBar count={data.men} max={max} anchored="left" />}
      </Link>
    </>
  );
};

interface TotalBarData {
  count?: number;
  notKnown?: number;
}
export interface AgePyramidTotals {
  women: TotalBarData;
  men: TotalBarData;
  notKnown: TotalBarData;
}

export const AgeTotalsBars: FC<{ totals: AgePyramidTotals; max: number }> = ({ totals, max }) => (
  <>
    <div className="w-100 my-3 border-top separator"></div>
    <div className="totals women-column text-right">
      <AgeClassBar
        count={totals.women.count || 0}
        // notKnownCount={totals.women.notKnown}
        max={max}
        anchored="right"
      />
    </div>
    <BarLabel
      label="Tout âge"
      total={(totals.women.count || 0) + (totals.men.count || 0)}
      notKnown={totals.notKnown.count || 0}
    />
    <div className="totals men-column">
      {" "}
      <AgeClassBar count={totals.men.count || 0} max={max} anchored="left" />
    </div>
    <div className=" totals women-column text-right">
      <AgeClassBar
        count={totals.women.notKnown || 0}
        // notKnownCount={totals.women.notKnown}
        max={max}
        anchored="right"
      />
    </div>
    <BarLabel
      label="Indéterminé"
      total={(totals.women.notKnown || 0) + (totals.men.notKnown || 0)}
      notKnown={totals.notKnown.notKnown || 0}
    />

    <div className="totals men-column">
      {" "}
      <AgeClassBar count={totals.men.notKnown || 0} max={max} anchored="left" />
    </div>
  </>
);
