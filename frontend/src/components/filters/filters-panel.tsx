import React, { FC, useEffect, useRef, useState } from "react";
import { omit, isEmpty, flatten } from "lodash";
import cx from "classnames";

import { OptionType } from "../custom-select";
import {
  DatesFilterState,
  ESSearchQueryContext,
  FilterHistogramType,
  FiltersState,
  PlainObject,
  SearchTypeDefinition,
  TermsFilterState,
} from "../../types";
import { getHistograms, getTerms } from "../../elasticsearchClient";

import { DatesFilter } from "./dates-filter";
import { TermsFilter } from "./term-filter";

/**
 * Helper to get the properly typed function to retrieve options for a given
 * TERMS field.
 */
function asyncOptionsFactory(
  field: string,
  count: number = 200,
): (inputValue: string, context: ESSearchQueryContext) => Promise<OptionType[]> {
  return async (inputValue: string, context: ESSearchQueryContext) =>
    getTerms(context, field, inputValue, count + 1).then((terms) => [
      ...terms.map(({ term }) => ({ label: term, value: term })),
      ...(terms.length > count
        ? [
            {
              value: "HOPPE::DISABLED",
              label: "Pour voir plus de résultats, veuillez affiner votre rechercher",
              isDisabled: true,
            },
          ]
        : []),
    ]);
}

export const FiltersPanel: FC<{
  // Filters state management:
  state: FiltersState;
  setState: (newState: FiltersState) => void;
  // Surrounding context:
  query: string;
  searchTypeDefinition: SearchTypeDefinition;
}> = (props) => {
  const context: ESSearchQueryContext = {
    query: props.query,
    filters: props.state,
    index: props.searchTypeDefinition.index,
    sort: null,
  };
  const contextFingerprint = JSON.stringify(context);

  const [histograms, setHistograms] = useState<PlainObject<FilterHistogramType>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const maxCount = Math.max(
    ...Object.values(histograms).flatMap((histogram) => histogram.values.map((val) => val.count)),
  );

  // Load histograms when context changes:
  useEffect(() => {
    if (!isLoading) {
      setHistograms({});
      setIsLoading(true);
      getHistograms(
        context,
        flatten(props.searchTypeDefinition.filtersGroups.map((group) => group.filters.map((f) => f.id))),
        5,
      ).then((value) => {
        setIsLoading(false);
        setHistograms(value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextFingerprint]);

  // Listen to scroll to detect when block becomes sticked:
  const root = useRef<HTMLDivElement>(null);
  function checkScroll() {
    const top = root.current?.offsetTop;
    const newIsSticky = typeof top === "number" && top !== 0;

    if (newIsSticky !== isSticky) setIsSticky(newIsSticky);
  }
  useEffect(() => {
    window.addEventListener("scroll", checkScroll);
    return function cleanup() {
      window.removeEventListener("scroll", checkScroll);
    };
  });

  return (
    <div className={cx("filters", isSticky && "sticky")} ref={root}>
      <h4>
        <span className="highlight">
          <i className="fas fa-filter mr1" /> Filtres
        </span>
      </h4>

      {props.searchTypeDefinition.filtersGroups.map((group, gi) => (
        <>
          <div key={gi}>{group.label}</div>
          {group.filters.map((filter, i) => {
            if (filter.type === "terms")
              return (
                <TermsFilter
                  key={i}
                  filter={{ ...filter, asyncOptions: asyncOptionsFactory(filter.id) }}
                  setState={(newState) =>
                    props.setState(
                      newState && (newState.value as string[]).length
                        ? { ...props.state, [filter.id]: newState }
                        : omit(props.state, filter.id),
                    )
                  }
                  histogram={histograms[filter.id] && { ...histograms[filter.id], maxCount }}
                  state={(props.state[filter.id] || { type: "terms", value: [] }) as TermsFilterState}
                  context={context}
                />
              );
            if (filter.type === "dates")
              return (
                <DatesFilter
                  key={i}
                  filter={filter}
                  setState={(newState) =>
                    props.setState(
                      newState && !isEmpty(newState.value)
                        ? { ...props.state, [filter.id]: newState }
                        : omit(props.state, filter.id),
                    )
                  }
                  state={(props.state[filter.id] || { type: "dates", value: [] }) as DatesFilterState}
                  context={context}
                />
              );
            return null;
          })}
        </>
      ))}
    </div>
  );
};
