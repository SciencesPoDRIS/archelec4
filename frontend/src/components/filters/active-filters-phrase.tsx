import { flatten, identity } from "lodash";
import { FC } from "react";
import { professionSearch } from "../../config/searchDefinitions";
import { FiltersState, FilterState } from "../../types";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { isWildcardSpecialValue, SEPARATOR, wildcardSpecialLabel } from "./utils";
import { useStateUrl } from "../../hooks/state-url";

export const ActiveFiltersPhrase: FC<{ filtersState: FiltersState }> = ({ filtersState }) => {
  const phraseParts = professionSearch.filtersGroups
    .map<React.ReactNode>((group) => {
      if (group.activeFiltersPhrase) {
        return group.activeFiltersPhrase({ filters: filtersState });
      }
      return null;
    })
    .filter(identity);
  if (phraseParts.length > 0)
    return (
      <span className="active-filters-phrase">
        {" "}
        {phraseParts.reduce((joinedList, el) => [joinedList, <span className="filter-group-glue"> et </span>, el])}
      </span>
    );
  else return null;
};

const FilterValue: FC<{ filterState: FilterState; value: string; label?: string }> = ({
  filterState,
  value,
  label,
}) => {
  const [, setTermsUrl] = useStateUrl<string>(filterState.spec.id, "");
  return (
    <button
      className="filter-value btn btn-link"
      onClick={() =>
        setTermsUrl(
          flatten([filterState.value])
            .filter((v) => v !== value)
            .join(SEPARATOR),
        )
      }
    >
      {label || isWildcardSpecialValue(value) ? wildcardSpecialLabel(value) : value} <IoMdCloseCircleOutline />
    </button>
  );
};

const CommaSeparatedFilterValues: FC<{ filter: FilterState; labelfactory?: (value: string) => string }> = ({
  filter,
  labelfactory,
}) => {
  if (filter.type === "dates")
    return <span className="filter-values">{[filter.value.min || "", filter.value.max || ""].join(" - ")}</span>;
  else {
    const values = flatten([filter.value]);
    return (
      <span className="filter-values">
        {values.map((v, i) => (
          <span key={i}>
            <FilterValue filterState={filter} value={v} label={labelfactory && labelfactory(v)} />
            {values.length > 1 && i < values.length - 1 ? " ou " : ""}
          </span>
        ))}
      </span>
    );
  }
};

export const ElectionGroupPhrase: FC<{ filters: FiltersState }> = ({ filters }) => {
  if (filters["contexte-election"] || filters["contexte-tour"] || filters.annee)
    return (
      <span>
        pour les <span className="group-label">élections</span>&nbsp;
        {filters["contexte-election"] && <CommaSeparatedFilterValues filter={filters["contexte-election"]} />}
        {filters["contexte-tour"] && (
          <>
            au{" "}
            <CommaSeparatedFilterValues
              filter={filters["contexte-tour"]}
              labelfactory={(value) => `${value === "1" ? "premier" : "second"} tour`}
            />
          </>
        )}
        {filters.annee && (
          <span>
            {" "}
            en <CommaSeparatedFilterValues filter={filters.annee} />
          </span>
        )}
      </span>
    );
  else return null;
};

export const CirconscriptionGroupPhrase: FC<{ filters: FiltersState }> = ({ filters }) => {
  if (filters["departement-insee"] || filters["circonscription"])
    return (
      <span>
        en <span className="group-label">circonscription</span>&nbsp;
        {filters["circonscription"] && <CommaSeparatedFilterValues filter={filters["circonscription"]} />}
        {filters["departement-insee"] && (
          <>
            {" "}
            dans <CommaSeparatedFilterValues filter={filters["departement-insee"]} />
          </>
        )}
      </span>
    );
  else return null;
};

export const ContenuPhrase: FC<{ filters: FiltersState }> = ({ filters }) => {
  if (filters["ocr"])
    return (
      <span>
        dont le <span className="group-label">texte</span>&nbsp;contient&nbsp;
        <CommaSeparatedFilterValues filter={filters.ocr} />
      </span>
    );
  else return null;
};

export const GenericFilterGroupPhraseFactory: (label: string, prefix?: string) => FC<{ filters: FiltersState }> = (
  label,
  prefix,
) => ({ filters }) => {
  const group = professionSearch.filtersGroups.find((g) => g.label === label);
  const activeFilters = group && group.filters.map((f) => filters[f.id]).filter(identity);
  if (group && activeFilters && activeFilters.length > 0) {
    return (
      <span>
        {prefix}
        <span className="group-label">{label.toLowerCase()}</span>{" "}
        {activeFilters
          .map<React.ReactNode>((f) => (
            <span key={f.spec.id}>
              de <span className="filter-label-in-phrase">{f.spec.label}</span>{" "}
              <CommaSeparatedFilterValues key={f.spec.id} filter={f} />
            </span>
          ))
          .reduce((joinedList, el) => [joinedList, <> et </>, el])}
      </span>
    );
  } else return null;
};
