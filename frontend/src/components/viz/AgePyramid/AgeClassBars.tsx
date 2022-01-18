import { FC } from "react";
import { AgeClassBar } from "./AgeClassBar";
import { agePyramidConfig } from "./config";

export const AgeHeaders: FC = () => (
  <div className="d-flex justify-content-start w-100" style={{ fontWeight: "bold" }}>
    <div className="flex-grow-1 text-right">Femme</div>
    <div className="mx-2 flex-shrink-0" style={{ width: agePyramidConfig.size.label, textAlign: "center" }}>
      Classe d'âge
    </div>
    <div className="flex-grow-1">Homme</div>
  </div>
);

export interface AgeBarData {
  ageClass: string;
  women?: number;
  men?: number;
  notKnown?: number;
}

const BarLabel: FC<{ label: string; total: number; notKnown?: number }> = ({ label, total, notKnown }) => (
  <div
    className="d-flex flex-column mx-2 flex-shrink-0 justify-content-center align-items-center"
    style={{ width: agePyramidConfig.size.label }}
  >
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
    <div className="d-flex justify-content-start w-100 mt-2">
      <div className="flex-grow-1">
        {data.women && <AgeClassBar count={data.women} max={max} color="purple" anchored="right" />}
      </div>
      <BarLabel label={data.ageClass} total={(data.women || 0) + (data.men || 0)} notKnown={data.notKnown} />
      <div className="flex-grow-1">
        {data.men && <AgeClassBar count={data.men} max={max} color="green" anchored="left" />}
      </div>
    </div>
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
    <div className="d-flex justify-content-start w-100 mt-2 border-top pt-2">
      <div className="flex-grow-1 text-right">
        <AgeClassBar
          count={totals.women.count || 0}
          // notKnownCount={totals.women.notKnown}
          max={max}
          color={agePyramidConfig.colors.women}
          anchored="right"
        />
      </div>
      <BarLabel
        label="Tout âge"
        total={(totals.women.count || 0) + (totals.men.count || 0)}
        notKnown={totals.notKnown.count || 0}
      />

      <div className="flex-grow-1">
        {" "}
        <AgeClassBar count={totals.men.count || 0} max={max} color={agePyramidConfig.colors.men} anchored="left" />
      </div>
    </div>
    <div className="d-flex justify-content-start w-100 mt-2">
      <div className="flex-grow-1 text-right">
        <AgeClassBar
          count={totals.women.notKnown || 0}
          // notKnownCount={totals.women.notKnown}
          max={max}
          color={agePyramidConfig.colors.notknown}
          anchored="right"
        />
      </div>
      <BarLabel
        label="Indéterminé"
        total={(totals.women.notKnown || 0) + (totals.men.notKnown || 0)}
        notKnown={totals.notKnown.notKnown || 0}
      />

      <div className="flex-grow-1">
        {" "}
        <AgeClassBar
          count={totals.men.notKnown || 0}
          max={max}
          color={agePyramidConfig.colors.notknown}
          anchored="left"
        />
      </div>
    </div>
  </>
);