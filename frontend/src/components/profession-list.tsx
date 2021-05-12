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
            <>
              Explorer <span className="highlight">{professions.total}</span> professions de foi
            </>
            {!loading && (
              <button type="button" className="btn btn-link" onClick={download}>
                <i className="fas fa-file-csv"></i>
              </button>
            )}
            {loading && <>Génération du fichier ...</>}
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
