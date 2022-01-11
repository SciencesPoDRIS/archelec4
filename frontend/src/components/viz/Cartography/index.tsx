import { FC, useEffect, useState, useRef } from "react";
import { keyBy, max } from "lodash";
import chroma from "chroma-js";

import { DashboardDataType } from "../../../types/viz";
import { useStateUrl } from "../../../hooks/state-url";
import { tooltipPosition } from "../../../utils";
import { SEPARATOR } from "../../filters/utils";
import FranceSVGParts from "./france_DOM_COM_hexagonal.json";

export const Cartography: FC<{ data: DashboardDataType["carto"] }> = ({ data }) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<DashboardDataType["carto"][0] | null>(null);
  const [termsUrl, setTermsUrl] = useStateUrl<string>("departement-insee", "");
  const [selectedDepartements, setSelectedDepartements] = useState<string[]>([]);

  // prepare data
  const dataByINSEEDep = keyBy(data, (d) => d.departement);
  const maxCount = max(data.map((d) => d.doc_count)) || 1;
  const colorScale = chroma.scale(["white", "red"]);

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
    <div className="container-fluid">
      <div className="row">
        <h2>Nombre de professions de foi par département</h2>
      </div>
      <div className="row legend d-flex align-items-center">
        Nombre de Profession de foi: 0{" "}
        <div
          className="mx-2"
          style={{
            display: "inline-block",
            height: "20px",
            width: "100px",
            background: "linear-gradient(to right,white, red)",
          }}
        />
        {maxCount}
      </div>
      <div className="row">
        <svg version="1.1" width={"100%"} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {FranceSVGParts.map((p) => {
            const depFilterKey = dataByINSEEDep[p.insee_dep]?.["departement-insee"];
            const selected = selectedDepartements.includes(depFilterKey);
            return (
              <path
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
                fill={
                  termsUrl === "" || selected
                    ? colorScale((dataByINSEEDep[p.insee_dep]?.doc_count || 0) / maxCount).hex()
                    : "lightgrey"
                }
              />
            );
          })}
        </svg>
      </div>
      {hovered && (
        <div className="tooltip" ref={tooltipRef}>
          {hovered["departement-nom"]} - {hovered.doc_count}
        </div>
      )}
    </div>
  );
};
