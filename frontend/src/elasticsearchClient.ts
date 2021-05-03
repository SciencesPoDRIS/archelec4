import { omit, omitBy, isUndefined, isEmpty, toPairs } from "lodash";
import { config } from "./config";
import { ESSearchQueryContext, FilterHistogramType, FiltersState, FilterState, PlainObject } from "./types";

function getESQueryFromFilter(field: string, filter: FilterState): any | any[] {
  if (filter.type === "terms") return filter.value.map((v) => ({ terms: { [`${field}.keyword`]: [v] } }));
  if (filter.type === "dates")
    return {
      range: { [field]: omitBy({ gte: filter.value.min, lte: filter.value.max, format: "yyyy" }, isUndefined) },
    };
}

// TODO : remove query
function getESQueryBody(
  query: string,
  filters: FiltersState,
  suggestFilter?: { field: string; value: string | undefined },
) {
  const contextFilters = suggestFilter ? omit(filters, [suggestFilter.field]) : filters;
  const queries = [
    ...(!isEmpty(contextFilters)
      ? toPairs(contextFilters).flatMap(([field, filter]) => getESQueryFromFilter(field, filter))
      : []),
  ];

  if (suggestFilter && suggestFilter.value) {
    queries.push({
      wildcard: {
        [suggestFilter.field]: {
          value: `*${suggestFilter.value}*`,
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
 * Cast an ES object to an heurist one.
 * For this, an ES object MUST have a `type` field with the name of the heurist model.
 * But this is the case.
//  */
// export function esObjectToHeurist<T>(object: any): T {
//   const type: string = object.type;
//   const heurist: any = Object.assign({}, object);
//   const definition: SchemaModelDefinition | undefined = schema.find((model) => model.name === type);
//   if (!definition)
//     throw new Error(`${type} not found in heurist schema definition on object ${JSON.stringify(object)}`);

//   Object.keys(object).forEach((field: string) => {
//     const fieldDefinition = definition.fields.find((def) => def.name === field);
//     if (fieldDefinition && object[field] !== null && object[field] !== undefined) {
//       // Transform in array if needed
//       if (object[field] && !Array.isArray(object[field]) && fieldDefinition.isArray) {
//         heurist[field] = [heurist[field]];
//       }

//       // Check for dateRange
//       if (fieldDefinition.type === "dateRange") {
//         if (fieldDefinition.isArray) {
//           heurist[field] = heurist[field].map((value: any) => {
//             return {
//               type: value.type,
//               date: new Date(value.date),
//               range: {
//                 lte: new Date(value.range.lte),
//                 gte: new Date(value.range.gte),
//               },
//             };
//           });
//         } else {
//           heurist[field] = {
//             type: heurist[field].type,
//             date: new Date(heurist[field].date),
//             range: {
//               lte: new Date(heurist[field].range.lte),
//               gte: new Date(heurist[field].range.gte),
//             },
//           };
//         }
//       }

//       // Check for date
//       if (fieldDefinition.type === "date") {
//         if (fieldDefinition.isArray) {
//           heurist[field] = heurist[field].map((value: any) => {
//             return new Date(value);
//           });
//         } else {
//           heurist[field] = new Date(heurist[field]);
//         }
//       }

//       // Check for nested object for resource type
//       if (fieldDefinition.type === "resource" && fieldDefinition.resourceTypes && (fieldDefinition.depth || 0) > 0) {
//         if (fieldDefinition.isArray) {
//           heurist[field] = heurist[field].map((value: any) => {
//             return esObjectToHeurist(value);
//           });
//         } else {
//           heurist[field] = esObjectToHeurist(heurist[field]);
//         }
//       }

//       // Check for nested object for resource type
//       if (fieldDefinition.type === "relmarker" && fieldDefinition.resourceTypes && (fieldDefinition.depth || 0) > 0) {
//         if (fieldDefinition.isArray) {
//           heurist[field] = heurist[field].map((value: any) => {
//             return { relation: value.relation, direction: value.direction, other: esObjectToHeurist(value.other) };
//           });
//         } else {
//           heurist[field] = {
//             relation: heurist[field].relation,
//             direction: heurist[field].direction,
//             other: esObjectToHeurist(heurist[field].other),
//           };
//         }
//       }

//       // Check for
//       // ID ALEPH to linking to CUJAS catalogue
//       if (field === "idNBibliographique") {
//         if (fieldDefinition.isArray) {
//           heurist[field] = object[field].map((e: any) => (+e + "").padStart(9, "0")); // transform '\d+.0' into '\d'
//         } else {
//           heurist[field] = (+object[field] + "").padStart(9, "0");
//         }
//       }
//     }
//   });
//   return heurist as T;
// }

/***** UTILS */

interface Query {
  index: string;
  query: Object;
}

// newline delemited JSON format for the msearch ES API point
const NDJSON = (queries: Query[]): string => {
  const ndjsonQuery: string = queries.reduce<string>((mqueries: string, q: Query): string => {
    return mqueries + `${JSON.stringify({ index: q.index })}\n${JSON.stringify(q.query)}\n`;
  }, "");
  return ndjsonQuery;
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
    query: getESQueryBody(context.query, context.filters, { field, value }),
    aggs: {
      termsList: {
        terms: {
          field: `${field}.keyword`,
          size: count || 15,
          order: { _key: "desc" },
          include: value ? `.*${getESIncludeRegexp(value)}.*` : undefined,
        },
      },
    },
  };

  return await fetch(`${config.api_path}/elasticsearch/proxy/${context.index}`, {
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
export async function getHistograms(
  context: ESSearchQueryContext,
  fields: string[],
  size: number = 5,
): Promise<PlainObject<FilterHistogramType>> {
  const CARDINALITY_PREFIX = "CARDINALITY::";
  const TERMS_PREFIX = "TERMS::";

  const body: PlainObject = {
    size: 0,
    query: getESQueryBody(context.query, context.filters),
    aggs: fields.reduce(
      (iter, field) => ({
        ...iter,
        [CARDINALITY_PREFIX + field]: { cardinality: { field: field } },
        [TERMS_PREFIX + field]: { terms: { field: field, size } },
      }),
      {},
    ),
  };

  return await fetch(`${config.api_path}/elasticsearch/proxy/${context.index}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) =>
      fields.reduce(
        (iter, field) => ({
          ...iter,
          [field]: {
            total: data.aggregations && data.aggregations[CARDINALITY_PREFIX + field].value,
            values:
              data.aggregations &&
              data.aggregations[TERMS_PREFIX + field].buckets.map((bucket: { key: string; doc_count: number }) => ({
                label: bucket.key,
                count: bucket.doc_count,
              })),
          },
        }),
        {},
      ),
    );
}

export function search(
  context: ESSearchQueryContext,
  cleanFn: (rawData: any) => any,
  from: number,
  size: number,
  histogramField?: string,
): Promise<{ list: PlainObject[]; total: number }> {
  return fetch(`${config.api_path}/elasticsearch/proxy/${context.index}`, {
    body: JSON.stringify(
      omitBy(
        {
          size,
          from,
          query: getESQueryBody(context.query, context.filters),
          sort: context.sort ? context.sort.expression : undefined,
          aggs: histogramField
            ? {
                histogram: {
                  date_histogram: {
                    field: histogramField,
                    calendar_interval: "year",
                    format: "yyyy",
                  },
                },
              }
            : undefined,
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
      list: data.hits.hits.map((d: any) => cleanFn({ ...d._source, books: [] })),
      total: data.hits.total.value,
      histogram: histogramField
        ? data.aggregations.histogram.buckets.map((bucket: PlainObject) => ({
            year: bucket.key_as_string,
            value: bucket.doc_count,
          }))
        : undefined,
    }));
}
