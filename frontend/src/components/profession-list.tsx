import React from "react";
import { ProfessionDeFoi } from "../types";
import { Loader } from "./loader";
import { ProfessionCard } from "./profession-card";

interface Props {
  professions: { list: ProfessionDeFoi[]; total: number } | null;
}

export const ProfessionList: React.FC<Props> = (props: Props) => {
  const { professions } = props;
  return (
    <>
      {professions !== null ? (
        <>
          <div className="result-list-header">
            <h3>
              {professions.total} professions <i className="fas fa-file-csv"></i>
            </h3>
          </div>
          <div className="result-list">
            {professions.list.map((p) => (
              <ProfessionCard key={p.id} profession={p} />
            ))}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
