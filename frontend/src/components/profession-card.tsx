import React, { FC } from "react";
import { Link } from "react-router-dom";
import { PlainObject } from "../types";

export const ProfessionCard: FC<{ profession: PlainObject }> = (props) => {
  const { profession } = props;
  return (
    <div>
      <Link to={`/profession/${profession.id}`} title={profession.title}>
        {profession.images && profession.images.length > 0 && (
          <img src={profession.images[0].thumb} title="Page 1" alt="Page 1" />
        )}
        <div>{profession.title}</div>
      </Link>
    </div>
  );
};
