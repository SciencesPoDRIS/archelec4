import { FC } from "react";
import { AgeClassBar } from "./AgeClassBar";
import { agePyramidConfig } from "./config";
import { NotKnownBar } from "./NotKnownBar";

export const AGE_CLASS_LABEL_WIDTH = "132px";

export const AgeHeaders: FC = () => (
  <div className="d-flex justify-content-start w-100">
    <div className="flex-grow-1 text-right">Femme</div>
    <div className="mx-2 flex-shrink-0" style={{ width: AGE_CLASS_LABEL_WIDTH, textAlign: "center" }}>
      Classe d'âge
    </div>
    <div className="flex-grow-1">Homme</div>
    <div
      className="ml-2 flex-shrink-1 d-flex align-items-center justify-content-center"
      style={{ width: agePyramidConfig.size.notKnown }}
    >
      ?
    </div>
  </div>
);

export interface AgeBarData {
  ageClass: string;
  women?: number;
  men?: number;
  notKnown?: number;
}

export const AgeClassBars: FC<{ data: AgeBarData; max: number }> = ({ data, max }) => {
  return (
    <div className="d-flex justify-content-start w-100 ">
      <div className="flex-grow-1">
        {data.women && <AgeClassBar count={data.women} max={max} color="purple" anchored="right" />}
      </div>
      <div className="mx-2 flex-shrink-0" style={{ width: AGE_CLASS_LABEL_WIDTH }}>
        {data.ageClass}
      </div>
      <div className="flex-grow-1">
        {data.men && <AgeClassBar count={data.men} max={max} color="green" anchored="left" />}
      </div>
      <div className="ml-2 flex-shrink-1 d-flex align-items-center" style={{ width: agePyramidConfig.size.notKnown }}>
        {data.notKnown && <NotKnownBar count={data.notKnown || 0} />}
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
    <div className="d-flex justify-content-start w-100 mt-2">
      <div className="flex-grow-1 text-right">
        <AgeClassBar
          count={totals.women.count || 0}
          // notKnownCount={totals.women.notKnown}
          max={max}
          color={agePyramidConfig.colors.women}
          anchored="right"
        />
      </div>
      <div className="mx-2 flex-shrink-0" style={{ width: AGE_CLASS_LABEL_WIDTH, textAlign: "center" }}>
        Tout âge
      </div>
      <div className="flex-grow-1">
        {" "}
        <AgeClassBar count={totals.men.count || 0} max={max} color={agePyramidConfig.colors.men} anchored="left" />
      </div>
      <div className="ml-2 flex-shrink-1 d-flex align-items-center" style={{ width: agePyramidConfig.size.notKnown }}>
        <NotKnownBar count={totals.notKnown.count || 0} />
      </div>
    </div>
    <div className="d-flex justify-content-start w-100">
      <div className="flex-grow-1 text-right">
        <AgeClassBar
          count={totals.women.notKnown || 0}
          // notKnownCount={totals.women.notKnown}
          max={max}
          color={agePyramidConfig.colors.notknown}
          anchored="right"
        />
      </div>
      <div className="mx-2 flex-shrink-0" style={{ width: AGE_CLASS_LABEL_WIDTH, textAlign: "center" }}>
        indéterminé
      </div>
      <div className="flex-grow-1">
        {" "}
        <AgeClassBar
          count={totals.men.notKnown || 0}
          max={max}
          color={agePyramidConfig.colors.notknown}
          anchored="left"
        />
      </div>
      <div className="ml-2 flex-shrink-1 d-flex align-items-center" style={{ width: agePyramidConfig.size.notKnown }}>
        <NotKnownBar count={totals.notKnown.notKnown || 0} />
      </div>
    </div>
  </>
);
