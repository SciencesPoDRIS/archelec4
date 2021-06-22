import React, { FC, useState } from "react";

import { OptionType } from "../custom-select";
import { ESSearchQueryContext, FiltersState, SearchTypeDefinition } from "../../types";
import { getTerms } from "../../elasticsearchClient";

import { DatesFilter } from "./dates-filter";
import { TermsFilter } from "./term-filter";
import { QueryFilter } from "./query-filter";
import { values } from "lodash";

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
              label: "Pour voir plus de résultats, veuillez affiner votre recherche",
              isDisabled: true,
            },
          ]
        : []),
    ]);
}

export const FiltersPanel: FC<{
  // Filters state management:
  state: FiltersState;
  // Surrounding context:
  searchTypeDefinition: SearchTypeDefinition;
}> = (props) => {
  const context: ESSearchQueryContext = {
    filters: props.state,
    index: props.searchTypeDefinition.index,
    sort: null,
  };

  const openedByDefault = props.searchTypeDefinition.filtersGroups
    .filter((g) => (values(props.state).length === 0 ? g.openByDefault : g.filters.some((f) => props.state[f.id])))
    .map((g) => g.label);
  const [openedAsList, setOpenedAsList] = useState<string[]>(openedByDefault);

  return (
    <div className="filters">
      {props.searchTypeDefinition.filtersGroups.map((group, gi) => (
        <details
          className="filters-group"
          key={gi}
          open={openedAsList.includes(group.label) || group.filters.filter((f) => props.state[f.id]).length > 0}
          onToggle={(e) => {
            if (!(e.target as any).open && openedAsList.includes(group.label)) {
              // remove current group from opened list
              let newOpened: string[] = openedAsList.filter((id) => id !== group.label);
              setOpenedAsList(newOpened);
            } else if ((e.target as any).open && !openedAsList.includes(group.label)) {
              const newOpened: string[] = [...openedAsList, group.label];
              setOpenedAsList(newOpened);
            }
          }}
        >
          <summary className="filters-group-label">
            {group.label}{" "}
            {!openedAsList.includes(group.label) &&
              group.filters.filter((f) => props.state[f.id]).length > 0 &&
              ` (${group.filters.filter((f) => props.state[f.id]).length})`}
          </summary>
          {group.filters.map((filter, i) => {
            if (filter.type === "terms")
              return (
                <TermsFilter
                  key={i}
                  filter={{ ...filter, asyncOptions: asyncOptionsFactory(filter.id) }}
                  //histogram={histograms[filter.id] && { ...histograms[filter.id], maxCount }}
                  context={context}
                />
              );
            if (filter.type === "dates") return <DatesFilter key={i} filter={filter} />;
            if (filter.type === "query") return <QueryFilter key={i} filter={filter} />;
            return null;
          })}
        </details>
      ))}
    </div>
  );
};
