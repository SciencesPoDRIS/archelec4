import { max } from "lodash";
import { FC } from "react";

import { TopValuesDataType } from "../../types/viz";

export const TopValues: FC<{ title: string; data: TopValuesDataType }> = ({ title, data }) => {
  const maxValue = max(data.tops.map((d) => d.count)) || 0;

  return (
    <div className="w-100">
      <h2>{title}</h2>
      <div className="mb-3">Classement des {data.tops.length} occurences les plus grandes</div>

      <div className="w-100 mt-2 barchart">
        {data.tops.map((value, i) => {
          const widthPercentage = (value.count / maxValue) * 100;
          const id = `${data.field}-${value.key}`;
          return (
            <>
              <div id={id} key={`${id}-bar`} className="d-flex justify-content-end align-items-center bar-container">
                {widthPercentage <= 90 && <span style={{ marginRight: "5px" }}>{value.count}</span>}
                <div
                  className="position-relative bar d-flex justify-content-start align-items-center"
                  style={{ height: "100%", width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 90 && <span style={{ marginLeft: "5px" }}>{value.count}</span>}
                </div>
              </div>
              <label htmlFor={id} key={`${id}-label`} className="pl-2 label">
                {value.key}
              </label>
            </>
          );
        })}
      </div>
    </div>
  );
};
