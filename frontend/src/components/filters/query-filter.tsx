import { FC, useEffect, useState } from "react";
import { useStateUrl } from "../../hooks/state-url";

import { QueryFilterType } from "../../types";

export const QueryFilter: FC<{
  filter: QueryFilterType;
}> = ({ filter }) => {
  const [queryUrl, setQueryUrl] = useStateUrl<string>(filter.id, "");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (queryUrl) setQuery(queryUrl);
  }, [queryUrl]);

  return (
    <div className="filter-block">
      <span className="filter-label">{filter.label}</span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQueryUrl(query);
        }}
        className="query-filter"
      >
        <input
          name="q"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherche plein-texte..."
        />
        <button
          className="btn btn-img"
          type="reset"
          title="Annuler la recherche"
          onClick={() => {
            setQuery("");
            setQueryUrl("");
            //setState({ type: "query", value: "" });
          }}
        >
          <i className="fas fa-times" />
        </button>
        <button className="btn btn-img" type="submit" title="Rechercher" disabled={query === ""}>
          <i className="fas fa-search" />
        </button>
      </form>
    </div>
  );
};
