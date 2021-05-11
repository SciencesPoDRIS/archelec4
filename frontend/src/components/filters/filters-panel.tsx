import React, { FC } from "react";
import { omit, isEmpty } from "lodash";

import { OptionType } from "../custom-select";
import {
  DatesFilterState,
  ESSearchQueryContext,
  FiltersState,
  SearchTypeDefinition,
  TermsFilterState,
} from "../../types";
import { getTerms } from "../../elasticsearchClient";

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
    filters: props.state,
    index: props.searchTypeDefinition.index,
    sort: null,
  };

  return (
    <div className="filters">
      {props.searchTypeDefinition.filtersGroups.map((group, gi) => (
        <details
          className="filters-group"
          key={gi}
          open={group.openByDefault || group.filters.some((f) => props.state[f.id])}
        >
          <summary className="filters-group-label">{group.label}</summary>
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
                  //histogram={histograms[filter.id] && { ...histograms[filter.id], maxCount }}
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
        </details>
      ))}
    </div>
  );
};
