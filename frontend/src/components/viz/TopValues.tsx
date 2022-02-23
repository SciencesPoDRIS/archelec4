import { max } from "lodash";
import { FC } from "react";

import { TopValuesDataType } from "../../types/viz";
import { numberFormat } from "./utils";

export const TopValues: FC<{ title: string; data: TopValuesDataType }> = ({ title, data }) => {
  const maxValue = max(data.tops.map((d) => d.count)) || 0;

  return (
    <div className="w-100">
      <h2 className="h4">{title}</h2>
      <div className="mb-3 h6">
        Les {data.tops.length} occurrences les plus fréquentes.
        <br />
        <div className="w-100 d-flex align-items-center">
          <div style={{ width: `${(1000 / maxValue) * 100}%`, height: "5px" }} className=" bar" />
          <div style={{ fontSize: "0.8rem" }} className="ml-1">
            {numberFormat.format(1000)} candidat(e)s
          </div>
        </div>
      </div>

      <div className="w-100 mt-2 barchart">
        {data.tops.map((value, i) => {
          const widthPercentage = (value.count / maxValue) * 100;
          const id = `${data.field}-${value.key}`;
          return (
            <div>
              <label htmlFor={id} key={`${id}-label`} className="label text-truncate d-block">
                {value.key}
              </label>
              <div id={id} key={`${id}-bar`} className="bar-container">
                <div className="bar" style={{ height: "100%", width: `${widthPercentage}%` }}>
                  {widthPercentage > 90 && (
                    <span className="value-label text-white">
                      <b>{numberFormat.format(value.count)}</b>
                    </span>
                  )}
                </div>
                {widthPercentage <= 90 && <span className="value-label">{numberFormat.format(value.count)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
