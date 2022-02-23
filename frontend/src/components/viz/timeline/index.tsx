import { max } from "lodash";
import { FC, ReactElement, useEffect, useRef, useState } from "react";

import { DashboardDataType } from "../../../types/viz";
import { NoElectionsPeriod, YearBar } from "./year-bar";
import { tooltipPosition } from "../../../utils";

export const Timeline: FC<{ data: DashboardDataType["timeline"] }> = ({ data }) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipMessage, setTooltipMessage] = useState<ReactElement | null>(null);

  /**
   * WHen data changed, we reset the state
   */
  useEffect(() => {
    setTooltipMessage(null);
  }, [data]);

  // Helper function to display the tooltip
  function displayToolTip(x: number, y: number): void {
    if (tooltipRef.current) {
      tooltipRef.current.style.visibility = "visible";
      tooltipPosition([x, y], tooltipRef.current);
    }
  }

  const maxDocCount = max(data.map((d) => d.doc_count)) || 0;

  return (
    <div className="container-fluid">
      <div className="row d-flex flex-column">
        <h2 className="h4">Dans le temps</h2>
        <div className="d-flex ">
          <div className="tour-1 mr-1" style={{ width: "20px", height: "20px" }}></div> Premier tour{" "}
          <div className="tour-2 ml-2 mr-1" style={{ width: "20px", height: "20px" }}></div> Second tour
        </div>
      </div>
      <div className="row d-flex " id="dashboard-timeline">
        {data.map((currentYear: DashboardDataType["timeline"][0], i: number) => {
          const nextYear = data[i + 1];
          return (
            <>
              <YearBar
                data={currentYear}
                maxValue={maxDocCount}
                setTooltipMessage={setTooltipMessage}
                displayToolTip={displayToolTip}
                className={nextYear && +nextYear.annee === +currentYear.annee + 1 ? "mr-2" : undefined}
              />
              {nextYear && +nextYear.annee > +currentYear.annee + 1 && (
                <NoElectionsPeriod startYear={+currentYear.annee + 1} endYear={+nextYear.annee - 1} />
              )}
            </>
          );
        })}
      </div>
      {tooltipMessage && (
        <div className="tooltip" ref={tooltipRef}>
          {tooltipMessage}
        </div>
      )}
    </div>
  );
};
