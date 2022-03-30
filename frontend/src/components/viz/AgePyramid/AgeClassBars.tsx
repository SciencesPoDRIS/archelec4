import { FC } from "react";
import { Link } from "react-router-dom";
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

export const AgeClassBars: FC<{
  data: AgeBarData;
  max: number;
  getFilterLink: (sexe: string, age_classe: string) => Partial<Location>;
  selectedAges: string[];
  selectedSexe: string[];
}> = ({ data, max, getFilterLink, selectedAges, selectedSexe }) => {
  return (
    <>
      <Link
        title={`${
          selectedAges.includes(data.ageClass) && selectedSexe.includes("femme") ? "enlever" : "ajouter"
        } le filtre 'une des candidates est une femme ${data.ageClass}'`}
        to={getFilterLink("femme", data.ageClass)}
        className={`women-column ${
          selectedAges.includes(data.ageClass) && selectedSexe.includes("femme") ? "selected" : ""
        }`}
      >
        {data.women && <AgeClassBar count={data.women} max={max} anchored="right" />}
      </Link>
      <BarLabel label={data.ageClass} total={(data.women || 0) + (data.men || 0)} notKnown={data.notKnown} />
      <Link
        title={`${
          selectedAges.includes(data.ageClass) && selectedSexe.includes("homme") ? "enlever" : "ajouter"
        } le filtre 'un des candidats est un homme ${data.ageClass}'`}
        to={getFilterLink("homme", data.ageClass)}
        className={`men-column ${
          selectedAges.includes(data.ageClass) && selectedSexe.includes("homme") ? "selected" : ""
        }`}
      >
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

export const AgeTotalsBars: FC<{
  totals: AgePyramidTotals;
  max: number;
  getFilterLink: (sexe: string, age_classe: string) => Partial<Location>;
  selectedAges: string[];
  selectedSexe: string[];
}> = ({ totals, max, getFilterLink, selectedAges, selectedSexe }) => (
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
    <Link
      className={`totals women-column text-right ${
        selectedAges.includes("non mentionné") && selectedSexe.includes("femme") ? "selected" : ""
      }`}
      to={getFilterLink("femme", "non mentionné")}
      title={`${
        selectedAges.includes("non mentionné") && selectedSexe.includes("femme") ? "enlever" : "ajouter"
      } le filtre 'une des candidates est une femme  dont l'âge n'est pas mentionné'`}
    >
      <AgeClassBar
        count={totals.women.notKnown || 0}
        // notKnownCount={totals.women.notKnown}
        max={max}
        anchored="right"
      />
    </Link>
    <BarLabel
      label="Non mentionné"
      total={(totals.women.notKnown || 0) + (totals.men.notKnown || 0)}
      notKnown={totals.notKnown.notKnown || 0}
    />

    <Link
      className={`totals men-column ${
        selectedAges.includes("non mentionné") && selectedSexe.includes("homme") ? "selected" : ""
      }`}
      to={getFilterLink("homme", "non mentionné")}
      title={`${
        selectedAges.includes("non mentionné") && selectedSexe.includes("homme") ? "enlever" : "ajouter"
      } le filtre 'un des candidats est un homme dont l'âge n'est pas mentionné'`}
    >
      {" "}
      <AgeClassBar count={totals.men.notKnown || 0} max={max} anchored="left" />
    </Link>
  </>
);
