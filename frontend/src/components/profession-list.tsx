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
          <div className="panel-header">
            Explorer <span className="highlight">{professions.total}</span> professions de foi{" "}
            <button type="button" className="btn btn-link">
              <i className="fas fa-file-csv"></i>
            </button>
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
