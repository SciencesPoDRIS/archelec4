import { omit, omitBy, isUndefined, isEmpty, toPairs, identity } from "lodash";
import { config } from "./config";
import { ESSearchQueryContext, FiltersState, FilterState, PlainObject, SearchResult } from "./types";

function getESQueryFromFilter(field: string, filter: FilterState): any | any[] {
  if (filter.type === "terms")
    return { bool: { should: filter.value.map((v) => ({ terms: { [`${field}.raw`]: [v] } })) } };
  if (filter.type === "dates")
    return {
      range: { [field]: omitBy({ gte: filter.value.min, lte: filter.value.max, format: "yyyy" }, isUndefined) },
    };
  if (filter.type === "query") return { simple_query_string: { query: filter.value, fields: ["ocr"] } };
}

function getESQueryBody(filters: FiltersState, suggestFilter?: { field: string; value: string | undefined }) {
  const contextFilters = suggestFilter ? omit(filters, [suggestFilter.field]) : filters;
  const queries = [
    ...(!isEmpty(contextFilters)
      ? toPairs(contextFilters).flatMap(([field, filter]) => getESQueryFromFilter(field, filter))
      : []),
  ];

  if (suggestFilter && suggestFilter.value) {
    queries.push({
      wildcard: {
        [`${suggestFilter.field}.raw`]: {
          value: `*${suggestFilter.value}*`,
          case_insensitive: true,
        },
      },
    });
  }
  const esQuery =
    queries.length > 1
      ? {
          bool: {
            must: queries,
          },
        }
      : queries[0];
  return esQuery;
}

function getESHighlight(filters: FiltersState, suggestFilter?: { field: string; value: string | undefined }) {
  // TODO: add highlight conf into filter specs
  return {
    fields: toPairs(filters)
      .map(([field, filter]) => {
        if (filter.type === "query") return { [field]: { number_of_fragments: 2, fragment_size: 50 } };
        return null;
      })
      .filter(identity),
  };
}

export type SchemaFieldDefinition = {
  id: string;
  required: boolean;
  type: string;
  name: string;
  depth?: number;
  isArray?: boolean;
  resourceTypes?: Array<string>;
};

export type SchemaModelDefinition = {
  id: string;
  name: string;
  index_name?: string;
  index_configuration?: any;
  fields: Array<SchemaFieldDefinition>;
};

/**
 * GENERIC FUNCTIONS:
 * ******************
 */
function getESIncludeRegexp(query: string): string {
  return ".*" + [...query.toLowerCase()].map((char) => `[${char}${char.toUpperCase()}]`).join("") + ".*";
}

export async function getTerms(
  context: ESSearchQueryContext,
  field: string,
  value?: string,
  count?: number,
): Promise<{ term: string; count: number }[]> {
  const body: PlainObject = {
    size: 0,
    query: getESQueryBody(context.filters, { field, value }),
    aggs: {
      termsList: {
        terms: {
          field: `${field}.raw`,
          size: count || 15,
          order: { _key: "asc" },
          include: value ? `.*${getESIncludeRegexp(value)}.*` : undefined,
        },
      },
    },
  };

  return await fetch(`${config.api_path}/elasticsearch/proxy_search/${context.index}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) =>
      data.aggregations.termsList.buckets.map((bucket: { key: string; doc_count: number }) => ({
        term: bucket.key,
        count: bucket.doc_count,
      })),
    );
}

export function search<ResultType>(
  context: ESSearchQueryContext,
  cleanFn: (rawData: PlainObject) => ResultType,
  from: number,
  size: number,
  histogramField?: string,
): Promise<{ list: SearchResult<ResultType>[]; total: number }> {
  return fetch(`${config.api_path}/professionDeFoi/search`, {
    body: JSON.stringify(
      omitBy(
        {
          size,
          from,
          query: getESQueryBody(context.filters),
          sort: context.sort ? context.sort.expression : undefined,
          track_total_hits: true,
          highlight: getESHighlight(context.filters),
        },
        isUndefined,
      ),
    ),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((r) => r.json())
    .then((data) => ({
      list: data.hits.hits.map((d: any): ResultType => cleanFn({ ...d._source, highlight: d.highlight })),
      total: data.hits.total.value,
      histogram: histogramField
        ? data.aggregations.histogram.buckets.map((bucket: PlainObject) => ({
            year: bucket.key_as_string,
            value: bucket.doc_count,
          }))
        : undefined,
    }));
}

export function downSearchAsCSV(context: ESSearchQueryContext, filename: string): Promise<void> {
  return fetch(`${config.api_path}/professionDeFoi/search/csv?filename=${filename}`, {
    body: JSON.stringify({
      query: getESQueryBody(context.filters),
      sort: context.sort ? context.sort.expression : undefined,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.setAttribute("href", window.URL.createObjectURL(blob));
      link.setAttribute("download", filename);
      link.click();
    });
}
