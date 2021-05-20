import React, { FC, useEffect, useState } from "react";
import { sortBy } from "lodash";

import { OptionType } from "../custom-select";
import { ESSearchQueryContext, FiltersState, SearchTypeDefinition } from "../../types";
import { getTerms } from "../../elasticsearchClient";

import { DatesFilter } from "./dates-filter";
import { TermsFilter } from "./term-filter";
import { QueryFilter } from "./query-filter";
import { useStateUrl } from "../../hooks/state-url";

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

const OPENED_SEPARATOR = "|";

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

  const openedByDefault = sortBy(
    props.searchTypeDefinition.filtersGroups.filter((g) => g.openByDefault).map((g) => g.id),
  );
  const [openedUrl, setOpenedUrl] = useStateUrl<string>("opened", openedByDefault.join(OPENED_SEPARATOR));
  const [openedAsList, setOpenedAsList] = useState<string[]>([]);
  useEffect(() => {
    setOpenedAsList(openedUrl && openedUrl !== "" ? openedUrl?.split(OPENED_SEPARATOR) : []);
  }, [openedUrl]);

  return (
    <div className="filters">
      {props.searchTypeDefinition.filtersGroups.map((group, gi) => (
        <details
          className="filters-group"
          key={gi}
          open={openedAsList.includes(group.id)}
          //open={!!opened && opened.indexOf(group.id) !== -1}
          onToggle={(e) => {
            if (!(e.target as any).open && openedAsList.includes(group.id)) {
              // remove current group from opened list
              let newOpened: string | null = sortBy(openedAsList.filter((id) => id !== group.id)).join(
                OPENED_SEPARATOR,
              );
              setOpenedUrl(newOpened);
            } else if ((e.target as any).open && !openedAsList.includes(group.id)) {
              const newOpened = sortBy([...openedAsList, group.id]).join(OPENED_SEPARATOR);
              setOpenedUrl(newOpened);
            }
          }}
        >
          <summary className="filters-group-label">
            {group.label}{" "}
            {!openedAsList.includes(group.id) &&
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
