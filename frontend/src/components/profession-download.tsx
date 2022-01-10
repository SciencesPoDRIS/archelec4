import { FC, useState } from "react";

import { downSearchAsCSV } from "../elasticsearchClient";
import { ESSearchQueryContext } from "../types";
import { Loader } from "./loader";

export const ProfessionDownload: FC<{ esContext: ESSearchQueryContext }> = ({ esContext }) => {
  const [loading, setLoading] = useState<boolean>(false);

  function download() {
    setLoading(true);
    downSearchAsCSV(esContext, "archelect_search.csv").finally(() => setLoading(false));
  }

  return (
    <span>
      {!loading && (
        <button type="button" className="btn btn-link" onClick={download}>
          Télécharger en CSV
        </button>
      )}
      {loading && <Loader />}
    </span>
  );
};
