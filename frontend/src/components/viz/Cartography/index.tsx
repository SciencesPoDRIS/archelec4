import { FC, useEffect, useState, useRef } from "react";
import { keyBy, max, min, range } from "lodash";

import { scaleLinear } from "d3-scale";

import { DashboardDataType } from "../../../types/viz";
import { useStateUrl } from "../../../hooks/state-url";
import { tooltipPosition } from "../../../utils";
import { SEPARATOR } from "../../filters/utils";
import FranceSVGParts from "./france_DOM_COM_hexagonal.json";
import { numberFormat } from "../utils";

export const Cartography: FC<{ data: DashboardDataType["carto"] }> = ({ data }) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<DashboardDataType["carto"][0] | null>(null);
  const [termsUrl, setTermsUrl] = useStateUrl<string>("departement-insee", "");
  const [selectedDepartements, setSelectedDepartements] = useState<string[]>([]);

  // prepare data
  const dataByINSEEDep = keyBy(data, (d) => d.departement);
  const docCounts = data.map((d) => d.doc_count);
  const maxCount = max(docCounts) || 0;
  const minCount = min(docCounts) || 0;
  const colorScale = scaleLinear().domain([minCount, maxCount]).range([0.1, 1]);

  /**
   * Sync the map selected state with the corresponding url parameter.
   */
  useEffect(() => {
    setSelectedDepartements(termsUrl && termsUrl !== "" ? termsUrl.split(SEPARATOR) : []);
  }, [termsUrl]);

  /**
   * WHen data changed, we reset the state
   */
  useEffect(() => {
    setHovered(null);
  }, [data]);

  // Helper function to display the tooltip
  function displayToolTip(x: number, y: number): void {
    if (tooltipRef.current) {
      tooltipRef.current.style.visibility = "visible";
      tooltipPosition([x, y], tooltipRef.current);
    }
  }

  return (
    <div className="w-100">
      <h2 className="h4">Par département</h2>

      <div className=" d-flex align-items-center mb-3">
        Nombre de Profession de foi: {numberFormat.format(minCount)}{" "}
        <div className="mx-2 cartography-legend">
          {range(minCount, maxCount, (maxCount - minCount) / 100).map((v) => (
            <div style={{ width: "1px", opacity: colorScale(v) }} />
          ))}
        </div>
        {numberFormat.format(maxCount)}
      </div>
      <div className="mt-4">
        <svg id="cartography" version="1.1" width={"100%"} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {FranceSVGParts.map((p) => {
            const depFilterKey = dataByINSEEDep[p.insee_dep]?.["departement-insee"];
            const selected = selectedDepartements.includes(depFilterKey);
            return (
              <path
                className={`${termsUrl === "" || selected ? "active" : "disabled"}`}
                onClick={() => {
                  // TODO: refine the selection or add "code - name" key in cartographic data (json)
                  if (depFilterKey)
                    if (selected) setTermsUrl(selectedDepartements.filter((e) => e !== depFilterKey).join(SEPARATOR));
                    else setTermsUrl(selectedDepartements.concat(depFilterKey).join(SEPARATOR));
                }}
                onMouseEnter={(e) => {
                  setHovered(dataByINSEEDep[p.insee_dep]);
                  displayToolTip(e.nativeEvent.x, e.nativeEvent.y);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                }}
                onMouseMove={(e) => {
                  displayToolTip(e.nativeEvent.x, e.nativeEvent.y);
                }}
                d={p.d}
                key={p.insee_dep}
                id={p.insee_dep}
                stroke="black"
                fillOpacity={
                  dataByINSEEDep[p.insee_dep]?.doc_count && dataByINSEEDep[p.insee_dep]?.doc_count > 0
                    ? colorScale(dataByINSEEDep[p.insee_dep].doc_count)
                    : 0
                }
                // fill={
                //   termsUrl === "" || selected
                //     ? colorScale((dataByINSEEDep[p.insee_dep]?.doc_count || 0) / maxCount).hex()
                //     : "lightgrey"
                // }
              />
            );
          })}
        </svg>
      </div>
      {hovered && (
        <div className="tooltip" ref={tooltipRef}>
          {hovered["departement-insee"]} : {numberFormat.format(hovered.doc_count)}
        </div>
      )}
    </div>
  );
};
