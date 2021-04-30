import { OptionType } from "./components/custom-select";

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
};

export type DatesFilterState = {
  type: "dates";
  value: {
    min?: number;
    max?: number;
  };
};

export type FilterState = TermsFilterState | DatesFilterState;

export type FiltersState = { [key: string]: FilterState };

export type ESSearchQueryContext = {
  index: string;
  query: string;
  filters: FiltersState;
  sort: SortType | null;
};

export type TermsFilterType = {
  id: string;
  type: "terms";
  label: string;
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

export type FilterType = TermsFilterType | DatesFilterType;

export type FilterHistogramType = { values: { label: string; count: number }[]; total: number; maxCount?: number };
