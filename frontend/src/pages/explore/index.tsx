import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";

import { DatesFilterState, FiltersState, FilterType, PageProps, PlainObject } from "../../types";
import { professionSearch } from "../../config/searchDefinitions";
import { useStateUrl } from "../../hooks/state-url";
import { search } from "../../elasticsearchClient";
import { filtersDictFromGroups, SEARCH_QUERY_KEY, SEARCH_TYPE_KEY, SEPARATOR } from "../../components/filters/utils";
import { FiltersPanel } from "../../components/filters/filters-panel";
import { getSortDefinition } from "../../components/filters/utils";
import { Loader } from "../../components/loader";
import { ResultHeader } from "./ResultHeader";
import { modes, ModeType, ModeTypeData } from "./config";

const filtersDict = filtersDictFromGroups(professionSearch.filtersGroups);

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
        state[key] = {
          type: "terms",
          value: (state[key].value as string[]).concat(value.split(SEPARATOR)),
          spec: filter,
        };
      } else {
        state[key] = { type: "terms", value: value.split(SEPARATOR), spec: filter };
      }
    }

    if (filter.type === "dates" && (param === "min" || param === "max") && parseInt(value) + "" === value) {
      state[field] = {
        type: "dates",
        value: { ...(state[field] as DatesFilterState)?.value, [param]: +value },
        spec: filter,
      };
    }

    if (filter.type === "query") {
      if (state[key]) {
        state[key] = { type: "query", value: (state[key].value as string) + value, spec: filter };
      } else {
        state[key] = { type: "query", value: value, spec: filter };
      }
    }
  }

  return state;
}

export const Explore: React.FC<PageProps> = (props: PageProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // container ref
  const containerRef = useRef<HTMLDivElement>(null);

  // display mode
  const [modeUrlParam, setModeUrlParam] = useStateUrl<string>("mode", "list");
  const [selectedMode, setSelectedMode] = useState<ModeType<any>>(modes[0]);

  // TODO : enable changing sort ?
  const [sort] = useStateUrl<string>("sort", getSortDefinition(professionSearch).label);

  // Top page form state (unplugged to search until form is submitted):
  const [loading, setLoading] = useState<boolean>(false);
  const [filtersState, setFiltersState] = useState<FiltersState>(getFiltersState(queryParams, filtersDict));
  const [result, setResult] = useState<ModeTypeData<any> | null>(null);

  useEffect(() => {
    const newMode = modes.find((m) => m.id === modeUrlParam);
    if (newMode) setSelectedMode(newMode);
    else setSelectedMode(modes[0]);
  }, [modeUrlParam]);

  //TODO: refacto the two useEffects into one ?
  useEffect(() => {
    const lastFilterState = filtersState;
    const currentFilterState = getFiltersState(new URLSearchParams(location.search), filtersDict);
    setFiltersState(currentFilterState);
    console.log("fetch data");

    setLoading(true);
    selectedMode
      .fetchData({
        index: professionSearch.index,
        filters: currentFilterState,
        sort: getSortDefinition(professionSearch, sort),
      })
      .then((data) => {
        setResult(data);
      })
      .finally(() => setLoading(false));
  }, [location.search, selectedMode]); // eslint-disable-line

  return (
    <div className="home container-fluid">
      <div className="row">
        {/*  Filters panel */}
        <div className="col-xl-3 col-sm-4">
          <div className="side-bar full-height">
            <div className="panel-header" aria-level={2} role="heading">
              Filtrer
            </div>
            <FiltersPanel state={filtersState} searchTypeDefinition={professionSearch} />
          </div>
        </div>
        {/*  Result panel */}
        <div ref={containerRef} className="col-xl-9 col-sm-8 full-height result-column">
          <ResultHeader
            esContext={{
              index: professionSearch.index,
              filters: filtersState,
              sort: getSortDefinition(professionSearch, sort),
            }}
            nbProfession={result?.total}
            selectedMode={modeUrlParam}
            onModeChange={(e) => setModeUrlParam(e)}
          />

          {loading && <Loader />}

          {!loading && result && (
            <selectedMode.component
              containerRef={containerRef}
              context={{
                index: professionSearch.index,
                filters: filtersState,
                sort: getSortDefinition(professionSearch, sort),
              }}
              result={result}
            />
          )}
        </div>
      </div>
    </div>
  );
};
