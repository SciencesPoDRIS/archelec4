import React, { useEffect, useState } from "react";
import { FiltersPanel } from "../components/filters/filters-panel";
import { ProfessionList } from "../components/profession-list";
import { professionSearch } from "../config/searchDefinitions";

import { identity, omit } from "lodash";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import cx from "classnames";

import {
  DatesFilterState,
  FiltersState,
  FilterType,
  PlainObject,
  SearchType,
  SearchTypeDefinition,
  SortType,
} from "../types";
import { search } from "../elasticsearchClient";
import { useStateUrl } from "../hooks/state-url";

import { getSearchURL, SEARCH_QUERY_KEY, SEARCH_TYPE_KEY, SEPARATOR, SIZE } from "../components/filters/utils";
import { StickyWrapper } from "../components/sticky-wrapper";
import { SearchSort } from "../components/search-sort";
import { filtersDictFromGroups, getSortDefinition } from "../components/filters/utils";

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
      state[field] = { type: "dates", value: { ...(state[field]?.value || {}), [param]: +value } } as DatesFilterState;
    }
  }

  return state;
}

export const Home: React.FC<{}> = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);

  // State from URL, determines whether or not data should be loaded:
  const registeredQuery = queryParams.get(SEARCH_QUERY_KEY) || ("*" as string);
  // const registeredSearchType = queryParams.get(SEARCH_TYPE_KEY) as SearchType;
  // const fullRegisteredSearchType = SEARCH_TYPES_DICT[registeredSearchType || ""];
  const shouldSearch = !!registeredQuery && !!professionSearch;
  const [sort, setSort] = useStateUrl<string>("sort", getSortDefinition(professionSearch).label);

  // Top page form state (unplugged to search until form is submitted):
  const filtersDict = filtersDictFromGroups(professionSearch.filtersGroups);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotOnTop, setIsNotOnTop] = useState<boolean>(false);
  const [filtersState, setFiltersState] = useState<FiltersState>(getFiltersState(queryParams, filtersDict));

  const [results, setResults] = useState<{ list: PlainObject[]; total: number } | null>(null);

  useEffect(() => {
    const currentFilterState = getFiltersState(new URLSearchParams(location.search), filtersDict);
    setFiltersState(currentFilterState);
    if (shouldSearch) {
      setLoading(true);
      setResults(null);
      search(
        {
          index: professionSearch.index,
          query: registeredQuery,
          filters: currentFilterState,
          sort: getSortDefinition(professionSearch, sort),
        },
        identity,
        0,
        SIZE,
        undefined,
      ).then((newResults) => {
        setLoading(false);
        setResults(omit(newResults, "histogram"));
      });
    }
  }, [location.search]); // eslint-disable-line

  /**
   * This function checks if the page is scrolled to the bottom (or near the
   * bottom), and, if there is no data loading and there are more results to
   * fetch, it will load the next N results.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function checkScroll() {
    const isNearBottom = window.scrollY + window.innerHeight > document.body.offsetHeight - 500;

    setIsNotOnTop(window.scrollY > window.innerHeight);

    if (isNearBottom && !loading && results && results.list.length < results.total) {
      setLoading(true);
      search(
        {
          index: professionSearch.index,
          query: registeredQuery,
          filters: filtersState,
          sort: getSortDefinition(professionSearch, sort),
        },
        identity,
        results.list.length,
        SIZE,
      ).then((newResults) => {
        setLoading(false);
        setResults({ total: newResults.total, list: results.list.concat(newResults.list) });
      });
    }
  }

  // Check scroll on window scroll:
  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return function cleanup() {
      window.removeEventListener("scroll", checkScroll);
    };
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
          <FiltersPanel
            state={filtersState}
            setState={(newFiltersState) => {
              history.push(getSearchURL(registeredQuery, newFiltersState));
            }}
            query={registeredQuery}
            searchTypeDefinition={professionSearch}
          />
        </div>
        <div className="col-8">
          <ProfessionList professions={results} />
        </div>
      </div>
    </div>
  );
};
