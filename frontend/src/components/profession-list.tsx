import React from "react";
import { PlainObject } from "../types";
import { Loader } from "./loader";
import { ProfessionCard } from "./profession-card";

interface Props {
  professions: { list: PlainObject[]; total: number } | null;
}

export const ProfessionList: React.FC<Props> = (props: Props) => {
  const { professions } = props;
  return (
    <>
      {professions !== null ? (
        <div>
          <div>{professions.total} professions</div>
          {professions.list.slice(0, 20).map((p) => (
            <ProfessionCard key={p.id} profession={p} />
          ))}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
