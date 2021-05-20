import { FC, useState } from "react";

import { FilterHistogramType, ESSearchQueryContext, QueryFilterState, QueryFilterType } from "../../types";

export const QueryFilter: FC<{
  filter: QueryFilterType;
  state: QueryFilterState;
  histogram?: FilterHistogramType;
  setState: (newState: QueryFilterState | null) => void;
  context: ESSearchQueryContext;
}> = ({ filter, state, setState, context, histogram }) => {
  const [query, setQuery] = useState<string>(state.value);

  return (
    <div className="filter-block">
      <span className="filter-label">{filter.label}</span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setState({ type: "query", value: query });
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
            setState({ type: "query", value: "" });
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
