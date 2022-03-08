import { range, max } from "lodash";
import { FC, ReactElement } from "react";
import { TimelineDataItemType } from "../../../types/viz";
import { numberFormat } from "../utils";

export const YearBar: FC<{
  data: TimelineDataItemType;
  maxValue: number;
  setTooltipMessage: (message: ReactElement | null) => void;
  displayToolTip: (x: number, y: number) => void;
  className?: string;
}> = ({ data, maxValue, setTooltipMessage, displayToolTip, className }) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-end h-100 election-year ${
        className ? className : ""
      }`}
      style={{ flexGrow: 2 }} // election year width will be third time empty year's width
    >
      <div className="value-label">{numberFormat.format(data.doc_count)}</div>
      <div
        className="w-100 d-flex value-bar"
        style={{ boxSizing: "border-box", height: `${(max([0.05, data.doc_count / maxValue]) || 0) * 75}%` }}
      >
        {(data.dates_tours || []).map((d) => (
          <div
            className={`h-100 tour-${d.tour}`}
            style={{ width: `${(d.doc_count / data.doc_count) * 100}%` }}
            aria-label={`${d.doc_count} Professions de foi - ${d.election} ${d.date.toLocaleDateString(
              "fr-FR",
            )} - tour ${d.tour}`}
            onMouseEnter={(e) => {
              setTooltipMessage(
                <div className="d-flex flex-column">
                  <div>{numberFormat.format(d.doc_count)} Professions de foi</div>
                  <div>
                    {d.election} {d.date.toLocaleDateString("fr-FR")}
                  </div>
                  <div>tour {d.tour}</div>
                </div>,
              );
              displayToolTip(e.nativeEvent.x, e.nativeEvent.y);
            }}
            onMouseLeave={() => {
              setTooltipMessage(null);
            }}
            onMouseMove={(e) => {
              displayToolTip(e.nativeEvent.x, e.nativeEvent.y);
            }}
          ></div>
        ))}
      </div>

      <div className="year-label">{data.annee}</div>
    </div>
  );
};

export interface NoElectrionPeriodData {
  startYear: number;
  endYear: number;
}

export const NoElectionsPeriod: FC<NoElectrionPeriodData> = (props) => (
  <div
    className={`d-flex justify-content-between align-items-end empty-year`}
    style={{ flexGrow: props.endYear - props.startYear + 1 }}
  >
    {range(0, props.endYear - props.startYear + 1).map((y) => (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center year-label">
        <span style={{ fontSize: "0.5rem" }}>|</span>
      </div>
    ))}
  </div>
);
