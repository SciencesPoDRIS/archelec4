import { FC, ReactElement, useEffect, useRef, useState } from "react";

import { OptionType } from "../custom-select";
import { ESSearchQueryContext, FiltersState, SearchTypeDefinition, TermsFilterType } from "../../types";
import { getTerms } from "../../elasticsearchClient";

import { DatesFilter } from "./dates-filter";
import { TermsFilter } from "./term-filter";
import { QueryFilter } from "./query-filter";
import { values } from "lodash";
import { wildcardSpecialLabel, wildcardSpecialValue } from "./utils";
import { tooltipPosition } from "../../utils";

/**
 * Helper to get the properly typed function to retrieve options for a given
 * TERMS field.
 */
function asyncOptionsFactory(
  filter: TermsFilterType,
  count: number = 200,
): (inputValue: string, context: ESSearchQueryContext) => Promise<OptionType[]> {
  return async (inputValue: string, context: ESSearchQueryContext) =>
    getTerms(context, filter, inputValue, count + 1).then((terms) => [
      // create a wildcardSpecialValue which allow wildCard search on terms
      ...(filter.wildcardSearch && inputValue !== "" && terms.length > 0
        ? [
            {
              value: wildcardSpecialValue(inputValue),
              label: wildcardSpecialLabel(inputValue),
            },
          ]
        : []),
      ...terms.map(({ term, count: c }) => ({ label: `${term} (${c})`, value: term })),
      ...(terms.length > count
        ? [
            {
              value: "ARCHELEC::DISABLED",
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

  // TOOLTIP
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipMessage, setTooltipMessage] = useState<{ element: ReactElement; x: number; y: number } | null>(null);
  // Helper function to display the tooltip
  useEffect(() => {
    if (tooltipRef.current) {
      if (tooltipMessage) {
        tooltipRef.current.style.display = "block";
        tooltipPosition([tooltipMessage.x, tooltipMessage.y], tooltipRef.current);
      } else tooltipRef.current.style.display = "none";
    }
  }, [tooltipMessage]);

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
                  //TODO: add sort options configuration here
                  filter={{
                    ...filter,
                    asyncOptions: asyncOptionsFactory(filter),
                  }}
                  context={context}
                  setTooltipMessage={setTooltipMessage}
                />
              );
            if (filter.type === "dates") return <DatesFilter key={i} filter={filter} />;
            if (filter.type === "query") return <QueryFilter key={i} filter={filter} />;
            return null;
          })}
        </details>
      ))}
      {tooltipMessage && (
        <div className="tooltip" ref={tooltipRef} style={{ visibility: "visible", display: "none", opacity: 1 }}>
          {tooltipMessage.element}
        </div>
      )}
    </div>
  );
};
