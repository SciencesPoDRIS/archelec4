import { components } from "./api";
import { OptionType } from "../components/custom-select";
import { QueryDslQueryContainer } from "@elastic/elasticsearch/api/types";
import { FC } from "react";

export type Candidat = components["schemas"]["ArchiveElectoralCandidat"];
export type ProfessionDeFoi = components["schemas"]["ArchiveElectoralProfessionDeFoi"];

/**
 * Util type to represent maps of typed elements, but implemented with
 * JavaScript objects.
 */
export type PlainObject<T = any> = { [k: string]: T };

/**
 * HOMEPAGE-CENTERED TYPES:
 * ************************
 */

// logo might arrive as an other search type soon
export type SearchType = "profession"; // | "logo";

export type FiltersGroupType = {
  label: string;
  activeFiltersPhrase: FC<{ filters: FiltersState }>;
  openByDefault?: boolean;
  filters: FilterType[];
};

export type SortType = {
  label: string; // used to display in select box
  expression: any;
  default?: boolean; //default false
};

export type SearchTypeDefinition = {
  queryType: SearchType;
  filtersGroups: FiltersGroupType[];
  index: string;
  label: string;
  sortField?: string;
  reversedSort?: boolean;
  sorts: Array<SortType>;
};

export type TermsFilterState = {
  type: "terms";
  value: string[];
  spec: TermsFilterType;
};
export type QueryFilterState = {
  type: "query";
  value: string;
  spec: QueryFilterType;
};

export type DatesFilterState = {
  type: "dates";
  value: {
    min?: number;
    max?: number;
  };
  spec: DatesFilterType;
};

export type FilterState = TermsFilterState | DatesFilterState | QueryFilterState;

export type FiltersState = { [key: string]: FilterState };

export type ESSearchQueryContext = {
  index: string;
  filters: FiltersState;
  sort: SortType | null;
};

export type TermsFilterType = {
  id: string;
  field: string;
  nested?: boolean;
  type: "terms";
  label: string;
  description?: string;
  order:
    | "count_desc"
    | "key_asc"
    | "departement-order"
    | ((value1: { term: string; count: number }, value2: { term: string; count: number }) => number);
  extraQueryField?: QueryDslQueryContainer;
  wildcardSearch?: boolean;
  isMulti?: boolean;
  cacheOptions?: boolean;
  options?: OptionType[];
  asyncOptions?: (inputValue: string, context: ESSearchQueryContext) => Promise<OptionType[]>;
};

export type DatesFilterType = {
  id: string;
  type: "dates";
  label: string;
};
export type QueryFilterType = {
  id: string;
  field: string;
  type: "query";
  label: string;
};

export type FilterType = TermsFilterType | DatesFilterType | QueryFilterType;

export type PageProps = { isNearBottom?: boolean; isNotOnTop?: boolean; scrollTo?: (props: PlainObject) => void };

export type SearchResult<O> = O & { highlight: { [key: string]: string } | undefined };
