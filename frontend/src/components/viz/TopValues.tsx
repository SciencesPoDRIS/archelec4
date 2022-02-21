import { max } from "lodash";
import { FC } from "react";

import { TopValuesDataType } from "../../types/viz";

export const TopValues: FC<{ title: string; data: TopValuesDataType }> = ({ title, data }) => {
  const maxValue = max(data.tops.map((d) => d.count)) || 0;

  return (
    <div className="w-100">
      <h2 className="h4">{title}</h2>
      <div className="mb-3 h5">Les {data.tops.length} occurrences les plus fréquentes.</div>

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
                  {widthPercentage > 90 && <span className="value-label">{value.count}</span>}
                </div>
                {widthPercentage <= 90 && <span className="value-label">{value.count}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
