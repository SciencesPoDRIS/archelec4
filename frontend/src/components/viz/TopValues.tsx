import { max } from "lodash";
import { FC } from "react";

import { TopValuesDataType } from "../../types/viz";

export const TopValues: FC<{ data: TopValuesDataType }> = ({ data }) => {
  const maxValue = max(data.tops.map((d) => d.count)) || 0;

  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Top {data.field}</h2>
      </div>

      <div className="w-100 mt-2 barchart">
        {data.tops.map((value, i) => {
          const widthPercentage = (value.count / maxValue) * 100;
          return (
            <>
              <div key={`bar${i}`} className="d-flex justify-content-end bar-container">
                {widthPercentage <= 10 && <span style={{ marginRight: "5px" }}>{value.count}</span>}
                <div className="position-relative bar" style={{ height: "100%", width: `${widthPercentage}%` }}>
                  {widthPercentage > 10 && (
                    <span className="position-absolute" style={{ left: 5 }}>
                      {value.count}
                    </span>
                  )}
                </div>
              </div>
              <div key={`label${i}`} className="pl-2 label">
                {value.key}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};
