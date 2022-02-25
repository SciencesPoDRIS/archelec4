import { omit, omitBy, isUndefined, isEmpty, toPairs, identity } from "lodash";
import {
  isWildcardSpecialValue,
  valueFromWildcardSpecialValue,
  wildcardSpecialValue,
} from "./components/filters/utils";
import { config } from "./config";
import { DashboardDataType } from "./types/viz";
import {
  ESSearchQueryContext,
  FiltersState,
  FilterState,
  PlainObject,
  SearchResult,
  TermsFilterState,
  TermsFilterType,
} from "./types";
import {
  AggregationsTermsAggregationOrder,
  QueryDslQueryContainer,
  SearchRequest,
} from "@elastic/elasticsearch/api/types";

function getESQueryFromFilter(field: string, filter: FilterState): QueryDslQueryContainer {
  let query: QueryDslQueryContainer | null = null;

  //todo: move the spec retrieval in filterSatet build stage
  const filterSpec = filter.spec;

  switch (filter.type) {
    case "terms":
      query = {
        bool: {
          should: filter.value.map(
            (v): QueryDslQueryContainer => {
              if (isWildcardSpecialValue(v))
                // special value prefixed with WILDCARD to be used in a wildcard query
                return {
                  wildcard: {
                    [`${field}.raw`]: { value: `*${valueFromWildcardSpecialValue(v)}*`, case_insensitive: true },
                  },
                };
              else return { terms: { [`${field}.raw`]: [v] } };
            },
          ),
        },
      };
      break;
    case "dates":
      query = {
        range: { [field]: omitBy({ gte: filter.value.min, lte: filter.value.max, format: "yyyy" }, isUndefined) },
      };
      break;
    case "query":
      query = { simple_query_string: { query: filter.value, fields: ["ocr.search"] } };
  }
  // add extraQueryField if specified
  if (filterSpec && "extraQueryField" in filterSpec && filterSpec.extraQueryField) {
    query = {
      bool: {
        must: [query, filterSpec.extraQueryField],
      },
    };
  }
  // special case of nested
  if (field.includes(".")) {
    query = {
      nested: {
        path: field.split(".")[0],
        query,
      },
    };
  }
  return query;
}

function getESQueryBody(filters: FiltersState, suggestFilter?: TermsFilterState): QueryDslQueryContainer {
  const contextFilters = suggestFilter ? omit(filters, [suggestFilter.spec.field]) : filters;
  const queries = [
    ...(!isEmpty(contextFilters)
      ? toPairs(contextFilters).flatMap(([field, filter]) =>
          getESQueryFromFilter("field" in filter.spec ? filter.spec.field : field, filter),
        )
      : []),
  ];

  if (suggestFilter && suggestFilter.value) {
    queries.push(getESQueryFromFilter(suggestFilter.spec.field, suggestFilter));
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
  filter: TermsFilterType,
  value?: string,
  count?: number,
): Promise<{ term: string; count: number }[]> {
  const field = filter.field;
  //nested
  const isNested = field.includes(".");
  const nestedPath = isNested ? field.split(".")[0] : null;

  let order: AggregationsTermsAggregationOrder | undefined = undefined;
  switch (filter.order) {
    case "key_asc":
      order = { [filter.extraQueryField ? "extra.key" : "_key"]: "asc" };
      break;
    case "count_desc":
      order = { [filter.extraQueryField ? "extra.doc_count" : "_count"]: "desc" };
      break;
    case "departement-order":
      order = {
        "departement-order": "asc",
      };
      break;
    default:
      order = { _count: "desc" };
  }

  const searchQuery: SearchRequest = {
    body: {
      size: 0,
      query: getESQueryBody(
        context.filters,
        // create a temporaru filterState with a wildcardValue to trigger options suggestions the same way a wildcard choice would do
        value !== undefined ? { spec: filter, value: [wildcardSpecialValue(value)], type: "terms" } : undefined,
      ),
      aggs: {
        termsList: {
          terms: {
            field: `${field}.raw`,
            size: count || 15,
            order,
            include: value ? `.*${getESIncludeRegexp(value)}.*` : undefined,
          },
        },
      },
    },
  };
  // extraQueryField
  if (filter.extraQueryField && searchQuery.body?.aggs?.termsList) {
    searchQuery.body.aggs.termsList.aggs = {
      extra: {
        filter: filter.extraQueryField,
      },
    };
  }
  // departement-order special case
  if (filter.order === "departement-order" && searchQuery.body?.aggs?.termsList) {
    searchQuery.body.aggs.termsList.aggs = {
      "departement-order": { min: { field: "departement-order" } },
    };
  }

  // nested case
  if (isNested && nestedPath && searchQuery.body) {
    searchQuery.body.aggs = {
      [nestedPath]: {
        nested: { path: nestedPath },
        aggs: searchQuery.body.aggs,
      },
    };
  }

  return await fetch(`${config.api_path}/elasticsearch/proxy_search/${context.index}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchQuery.body),
  })
    .then((res) => res.json())
    .then((data) => {
      const buckets =
        isNested && nestedPath ? data.aggregations[nestedPath].termsList.buckets : data.aggregations.termsList.buckets;
      return buckets
        .map((bucket: { key: string; doc_count: number; extra?: { doc_count: number } }) => ({
          term: bucket.key,
          count: filter.extraQueryField && bucket.extra ? bucket.extra.doc_count : bucket.doc_count,
        }))
        .filter((t: { term: string; count: number }) => t.count > 0);
    });
}

export function search<ResultType>(
  context: ESSearchQueryContext,
  cleanFn: (rawData: PlainObject) => ResultType,
  from: number,
  size: number,
  signal?: AbortSignal,
): Promise<{ data: SearchResult<ResultType>[]; total: number }> {
  return fetch(`${config.api_path}/professionDeFoi/search`, {
    signal,
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
      data: data.hits.hits.map((d: any): ResultType => cleanFn({ ...d._source, highlight: d.highlight })),
      total: data.hits.total.value,
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

export async function fetchDashboardData(
  context: ESSearchQueryContext,
  signal: AbortSignal,
): Promise<{ total: number; data: DashboardDataType }> {
  const query = getESQueryBody(context.filters);
  const aggs = {
    carto: {
      multi_terms: {
        size: 150,
        terms: [{ field: "departement-insee.raw" }, { field: "departement-nom.raw" }, { field: "departement.raw" }],
      },
    },
    timeline: {
      terms: {
        field: "annee.raw",
        min_doc_count: 0,
        size: 100,
        order: { _key: "asc" },
      },
      aggs: {
        dates: {
          multi_terms: {
            terms: [
              {
                field: "date",
              },
              { field: "contexte-tour.raw" },
              { field: "contexte-election.raw" },
            ],
            order: { _key: "asc" },
          },
        },
      },
    },
    agePyramid: {
      nested: {
        path: "candidats",
      },
      aggs: {
        sexe: {
          terms: {
            field: "candidats.sexe.raw",
          },
          aggs: {
            age: {
              terms: {
                field: "candidats.age-tranche.raw",
              },
            },
          },
        },
      },
    },
    topListes: {
      nested: {
        path: "candidats",
      },
      aggs: {
        listes: {
          terms: {
            exclude: "non|mentionné",
            field: "candidats.liste",
            size: 12,
          },
        },
      },
    },
    topSoutiens: {
      nested: {
        path: "candidats",
      },
      aggs: {
        soutiens: {
          terms: {
            field: "candidats.soutien.raw",
            size: 12,
          },
        },
      },
    },
    topMandats: {
      nested: {
        path: "candidats",
      },
      aggs: {
        mandats: {
          terms: {
            field: "candidats.mandat-en-cours.raw",
            size: 12,
          },
        },
      },
    },
    topProfessions: {
      nested: {
        path: "candidats",
      },
      aggs: {
        professions: {
          terms: {
            exclude: "non|mentionné",
            field: "candidats.profession",
            size: 12,
          },
        },
      },
    },
  };

  const result = await fetch(`${config.api_path}/professionDeFoi/search`, {
    signal,
    body: JSON.stringify({
      size: 0,
      track_total_hits: true,
      query,
      aggregations: aggs,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const data = await result.json();
  return {
    total: data.hits.total.value,
    data: {
      agePyramid: data.aggregations.agePyramid.sexe.buckets.flatMap((e: any) =>
        e.age.buckets.map((a: any) => ({
          sexe: e.key,
          "age-tranche": a.key,
          candidat_count: a.doc_count,
        })),
      ),
      timeline: data.aggregations.timeline.buckets.flatMap((e: any) => ({
        annee: e.key,
        doc_count: e.doc_count,
        dates_tours: e.dates.buckets.map((d: any) => ({
          date: new Date(d.key[0]),
          tour: d.key[1],
          election: d.key[2],
          doc_count: d.doc_count,
        })),
      })),
      carto: data.aggregations.carto.buckets.flatMap((e: any) => ({
        "departement-insee": e.key[0],
        departement: e.key[2],
        "departement-nom": e.key[1],
        doc_count: e.doc_count,
      })),
      topListes: {
        field: "candidats.liste",

        wildcardSpecialValue: true,
        tops: data.aggregations.topListes.listes.buckets.map((e: any) => ({ key: e.key, count: e.doc_count })),
      },
      topSoutiens: {
        field: "candidats.soutien",
        tops: data.aggregations.topSoutiens.soutiens.buckets.map((e: any) => ({ key: e.key, count: e.doc_count })),
      },
      topMandats: {
        field: "candidats.mandat-en-cours",
        tops: data.aggregations.topMandats.mandats.buckets.map((e: any) => ({ key: e.key, count: e.doc_count })),
      },
      topProfessions: {
        field: "candidats.profession",
        wildcardSpecialValue: true,
        tops: data.aggregations.topProfessions.professions.buckets.map((e: any) => ({
          key: e.key,
          count: e.doc_count,
        })),
      },
    },
  };
}
