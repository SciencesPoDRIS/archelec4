import { FC, useEffect, useState } from "react";
import FranceSVGParts from "./france_DOM_COM_hexagonal.json";
import { CartographyDataType } from "../../types/viz";
import { keyBy, max } from "lodash";
import chroma from "chroma-js";
import { useHistory } from "react-router-dom";
import { useStateUrl } from "../../hooks/state-url";
import { SEPARATOR } from "../filters/utils";

export const Cartography: FC<{ data: CartographyDataType; width?: number; height?: number }> = ({
  data,
  width,
  height,
}) => {
  const [termsUrl, setTermsUrl] = useStateUrl<string>("departement-insee", "");
  const [selectedDepartements, setSelectedDepartements] = useState<string[]>([]);
  useEffect(() => {
    setSelectedDepartements(termsUrl && termsUrl !== "" ? termsUrl.split(SEPARATOR) : []);
  }, [termsUrl]);
  // prepare data
  const dataByINSEEDep = keyBy(data, (d) => d.departement);
  const maxCount = max(data.map((d) => d.doc_count)) || 1;

  const colorScale = chroma.scale(["white", "red"]);

  return (
    <svg version="1.1" width={width || 1000} height={height || 1000} xmlns="http://www.w3.org/2000/svg">
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
  );
};
