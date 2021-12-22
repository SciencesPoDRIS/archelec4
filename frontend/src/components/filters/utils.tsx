import { flatten, keyBy } from "lodash";
import { professionSearch } from "../../config/searchDefinitions";
import { FiltersGroupType, FilterType, SearchTypeDefinition, SortType } from "../../types";

export const filtersFromGroups = (groups: FiltersGroupType[]): FilterType[] => flatten(groups.map((g) => g.filters));

export const filtersDictFromGroups = (groups: FiltersGroupType[]): { [id: string]: FilterType } =>
  keyBy(filtersFromGroups(groups), (f) => f.id);
export const filtersDict = filtersDictFromGroups(professionSearch.filtersGroups);

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

/**
 * Wildcard choices in filters management
 */

export const wildcardSpecialValue = (value: string): string => `wildcard::${value}`;
// Label can be generated from normal or special value
export const wildcardSpecialLabel = (value: string): string => `incluant '${valueFromWildcardSpecialValue(value)}'`;
export const isWildcardSpecialValue = (value: string): boolean => value.startsWith("wildcard::");
export const valueFromWildcardSpecialValue = (value: string): string => {
  if (isWildcardSpecialValue(value)) return value.split("::")[1];
  // if it's not a wildcard value return as is
  else return value;
};
