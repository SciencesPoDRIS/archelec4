import React, { useState } from "react";
import { ProfessionDeFoi } from "../types";
import { Loader } from "./loader";
import { ProfessionCard } from "./profession-card";
import { downSearchAsCSV } from "../elasticsearchClient";
import { ESSearchQueryContext } from "../types";

interface Props {
  esContext: ESSearchQueryContext;
  professions: { list: ProfessionDeFoi[]; total: number } | null;
}

export const ProfessionList: React.FC<Props> = (props: Props) => {
  const { esContext, professions } = props;
  const [loading, setLoading] = useState<boolean>(false);

  function download() {
    setLoading(true);
    downSearchAsCSV(esContext, "archelect_search.csv").finally(() => setLoading(false));
  }

  return (
    <>
      {professions !== null ? (
        <>
          <div className="panel-header">
            <span aria-level={2} role="heading">
              Explorer <span className="highlight">{professions.total}</span> professions de foi
            </span>
            <span>
              {!loading && (
                <button type="button" className="btn btn-link" onClick={download}>
                  Télécharger en CSV
                </button>
              )}
              {loading && <Loader />}
            </span>
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
