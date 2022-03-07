import { max } from "lodash";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useStateUrl } from "../../hooks/state-url";

import { TopValuesDataType } from "../../types/viz";
import { SEPARATOR, wildcardSpecialValue } from "../filters/utils";
import { numberFormat } from "./utils";

export const TopValues: FC<{
  title: string;
  data: TopValuesDataType;
  className?: string;
}> = ({ title, data, className }) => {
  const maxValue = max(data.tops.map((d) => d.count)) || 0;
  const [fieldState, , getFilterURL] = useStateUrl<string>(data.field, "");

  const scaleUnit = maxValue >= 1000 ? 1000 : maxValue >= 100 ? 100 : maxValue >= 10 ? 10 : 1;
  return (
    <div className={`w-100 ${className ? className : ""}`}>
      <h2 className="h4">{title}</h2>
      <div className="mb-3 h6">
        Les {data.tops.length} occurrences les plus fréquentes.
        <br />
        <div className="w-100 d-flex align-items-center">
          <div style={{ width: `${(scaleUnit / maxValue) * 100}%`, height: "5px" }} className=" bar" />
          <div style={{ fontSize: "0.8rem" }} className="ml-1">
            {numberFormat.format(scaleUnit)} candidat(e)s
          </div>
        </div>
      </div>

      <div className="w-100 mt-2 barchart">
        {data.tops.map((value, i) => {
          const widthPercentage = (value.count / maxValue) * 100;
          const id = `${data.field}-${value.key}`;
          const stateValue = data.wildcardSpecialValue ? wildcardSpecialValue(value.key) : value.key;
          const selected = fieldState.includes(stateValue);

          let clickNewStateValue = [...fieldState.split(SEPARATOR).filter((v) => v !== ""), stateValue].join(SEPARATOR);
          if (selected)
            clickNewStateValue = fieldState
              .split(SEPARATOR)
              .filter((v) => v !== "" && v !== stateValue)
              .join(SEPARATOR);
          return (
            <Link to={getFilterURL(clickNewStateValue) || window.location} className={`${selected ? "selected" : ""}`}>
              <label htmlFor={id} key={`${id}-label`} className="label text-truncate d-block">
                {value.key}
              </label>
              <div id={id} key={`${id}-bar`} className="bar-container">
                <div className={`bar`} style={{ height: "100%", width: `${widthPercentage}%` }}>
                  {widthPercentage > 90 && (
                    <span className="value-label text-white">
                      <b>{numberFormat.format(value.count)}</b>
                    </span>
                  )}
                </div>
                {widthPercentage <= 90 && <span className="value-label">{numberFormat.format(value.count)}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
