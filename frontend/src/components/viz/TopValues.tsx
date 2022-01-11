import { FC } from "react";

import { TopValuesDataType } from "../../types/viz";

export const TopValues: FC<{ data: TopValuesDataType }> = ({ data }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Top {data.field}</h2>
      </div>

      {data.tops.map((value) => (
        <div className="row">
          <span className="col-4">{value.key}</span>
          <span className="col-4">{value.count}</span>
        </div>
      ))}
    </div>
  );
};
