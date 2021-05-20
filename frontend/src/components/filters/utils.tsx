import { flatten, keyBy } from "lodash";
import { FiltersGroupType, FilterType, SearchTypeDefinition, SortType } from "../../types";

export const filtersFromGroups = (groups: FiltersGroupType[]): FilterType[] => flatten(groups.map((g) => g.filters));

export const filtersDictFromGroups = (groups: FiltersGroupType[]): { [id: string]: FilterType } =>
  keyBy(filtersFromGroups(groups), (f) => f.id);

/**
 * Get the default sort object for the specified search type.
 * /!\ If search definition has no default sort, an error is throw
 */
export function getSortDefinition(searchDef: SearchTypeDefinition, sort?: string): SortType {
  let sortObj = searchDef.sorts.find((e) => e.label === sort);
  // if not found, we search the default one
  if (!sortObj) {
    sortObj = searchDef.sorts.find((e) => e.default === true);
    if (!sortObj) throw new Error("A search type must have a default sort option");
  }
  return sortObj;
}

/**
 * Generate search URL params from filter state
 */

export const SEARCH_QUERY_KEY = "q";
export const SEARCH_TYPE_KEY = "t";
export const SEPARATOR = "|";
export const SIZE = 50;
