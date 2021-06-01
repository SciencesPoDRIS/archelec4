import React, { useEffect, useRef, useState } from "react";
import { FiltersPanel } from "../components/filters/filters-panel";
import { ProfessionList } from "../components/profession-list";
import { professionSearch } from "../config/searchDefinitions";

import { useLocation } from "react-router";
import cx from "classnames";

import { DatesFilterState, FiltersState, FilterType, PageProps, PlainObject, ProfessionDeFoi } from "../types";
import { search } from "../elasticsearchClient";
import { useStateUrl } from "../hooks/state-url";

import { SEARCH_QUERY_KEY, SEARCH_TYPE_KEY, SEPARATOR, SIZE } from "../components/filters/utils";

// TODO: enable SORT ? import { SearchSort } from "../components/search-sort";
import { filtersDictFromGroups, getSortDefinition } from "../components/filters/utils";
import { isEqual } from "lodash";

// this method is used only to compute a context which is used to invalidate option cache.
// TODO: refacto by using filterSpecs to isolare relevant params directly in asyncSelects (only termsFilter so far)
function getFiltersState(query: URLSearchParams, filtersSpecs: PlainObject<FilterType>): FiltersState {
  const state: FiltersState = {};

  for (const [key, value] of query.entries()) {
    if (key === SEARCH_QUERY_KEY || key === SEARCH_TYPE_KEY) continue;

    // Extract field id from key (to deal with `dateEdition.date.min=XXX` for instance):
    let field = key;
    let param = null;
    if (key.endsWith(".min")) {
      field = key.split(".min")[0];
      param = "min";
    }
    if (key.endsWith(".max")) {
      field = key.split(".max")[0];
      param = "max";
    }
    const filter = filtersSpecs[field];

    if (!filter) continue;

    if (filter.type === "terms") {
      if (state[key]) {
        state[key] = { type: "terms", value: (state[key].value as string[]).concat(value.split(SEPARATOR)) };
      } else {
        state[key] = { type: "terms", value: value.split(SEPARATOR) };
      }
    }

    if (filter.type === "dates" && (param === "min" || param === "max") && parseInt(value) + "" === value) {
      state[field] = {
        type: "dates",
        value: { ...(state[field] as DatesFilterState)?.value, [param]: +value },
      } as DatesFilterState;
    }

    if (filter.type === "query") {
      if (state[key]) {
        state[key] = { type: "query", value: (state[key].value as string) + value };
      } else {
        state[key] = { type: "query", value: value };
      }
    }
  }

  return state;
}

export const Explore: React.FC<PageProps> = (props: PageProps) => {
  const { isNearBottom, isNotOnTop, scrollTo } = props;
  const location = useLocation();
  const list = useRef<HTMLDivElement>(null);
  const queryParams = new URLSearchParams(location.search);

  // TODO : enable changiing sort ?
  const [sort, setSort] = useStateUrl<string>("sort", getSortDefinition(professionSearch).label);

  // Top page form state (unplugged to search until form is submitted):
  const filtersDict = filtersDictFromGroups(professionSearch.filtersGroups);
  const [loading, setLoading] = useState<boolean>(false);

  const [filtersState, setFiltersState] = useState<FiltersState>(getFiltersState(queryParams, filtersDict));

  const [results, setResults] = useState<{ list: ProfessionDeFoi[]; total: number } | null>(null);

  useEffect(() => {
    document.title = "Archelec: exploration des professions de foi électorales";
  }, []);

  //TODO: refacto the two useEffects into one ?
  useEffect(() => {
    const lastFilterState = filtersState;
    const currentFilterState = getFiltersState(new URLSearchParams(location.search), filtersDict);
    setFiltersState(currentFilterState);
    if (!results || !isEqual(currentFilterState, lastFilterState)) {
      setLoading(true);
      setResults(null);
      search<ProfessionDeFoi>(
        {
          index: professionSearch.index,
          filters: currentFilterState,
          sort: getSortDefinition(professionSearch, sort),
        },
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        0,
        SIZE,
        undefined,
      ).then((newResults) => {
        setLoading(false);
        setResults(newResults);
      });
    }
  }, [location.search]); // eslint-disable-line

  /**
   * This function checks if the page is scrolled to the bottom (or near the
   * bottom), and, if there is no data loading and there are more results to
   * fetch, it will load the next N results.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isNearBottom && !loading && results && results.list.length < results.total) {
      setLoading(true);
      search<ProfessionDeFoi>(
        {
          index: professionSearch.index,
          filters: filtersState,
          sort: getSortDefinition(professionSearch, sort),
        },
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        results.list.length,
        SIZE,
      ).then((newResults) => {
        setLoading(false);
        setResults({ total: newResults.total, list: results.list.concat(newResults.list) });
      });
    }
  }, [isNearBottom, loading, results]);

  return (
    <div className="home container-fluid" ref={list}>
      <div className="row">
        <div className="col-xl-3 col-sm-4">
          <div className="side-bar full-height">
            <div className="panel-header" aria-level={2} role="heading">
              Filtrer
            </div>
            <FiltersPanel state={filtersState} searchTypeDefinition={professionSearch} />
          </div>
        </div>
        <div className="col-xl-9 col-sm-8">
          <ProfessionList
            esContext={{
              index: professionSearch.index,
              filters: filtersState,
              sort: getSortDefinition(professionSearch, sort),
            }}
            professions={results}
          />
        </div>
        <div
          className={cx("scroll-to-top", isNotOnTop && "show")}
          onClick={() => {
            if (scrollTo) scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <i className="fas fa-arrow-up" />
          <br />
          Retour au début de la liste
        </div>
      </div>
    </div>
  );
};
