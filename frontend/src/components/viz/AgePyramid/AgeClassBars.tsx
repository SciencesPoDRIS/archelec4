import { FC } from "react";
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
    <div style={{ fontSize: "0.8rem", lineHeight: "0.8rem", textAlign: "center", fontStyle: "italic" }}>
      {total} <span title="candidats">cand.</span>{" "}
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
  return (
    <>
      <div className="women-column">{data.women && <AgeClassBar count={data.women} max={max} anchored="right" />}</div>
      <BarLabel label={data.ageClass} total={(data.women || 0) + (data.men || 0)} notKnown={data.notKnown} />
      <div className="men-column">{data.men && <AgeClassBar count={data.men} max={max} anchored="left" />}</div>
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
