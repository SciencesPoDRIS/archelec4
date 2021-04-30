import { flatten, keyBy } from "lodash";
import { FiltersGroupType, FilterType, SearchTypeDefinition, SortType, FiltersState, FilterState } from "../../types";
import { compact, toPairs } from "lodash";

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

export function getSearchURL(query: string, filters?: FiltersState): string {
  if (!query) return "/";

  const filterPairs: string[][] = toPairs(filters || {}).flatMap(([k, v]: [string, FilterState]) => {
    if (v.type === "terms") {
      return [[k, v.value.join(SEPARATOR)]];
    }
    if (v.type === "dates") {
      const min = v.value.min;
      const max = v.value.max;
      return compact([min ? [`${k}.min`, min + ""] : null, max ? [`${k}.max`, max + ""] : null]);
    }

    return [];
  });

  return (
    "/?" +
    [[SEARCH_QUERY_KEY, query], ...filterPairs]
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(v) ? v.join(SEPARATOR) : v)}`)
      .join("&")
  );
}
