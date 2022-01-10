// Visualization data types

// Cartography

export type CartographyDataItemType = {
  departement: string; // to match map polygon
  "departement-insee": string;
  "departement-nom": string;
  doc_count: number;
};

export type CartographyDataType = CartographyDataItemType[];

// Timeline

export type TimelineDataItemType = {
  dates: Date[]; // could also be string and let the viz do the format into date
  annee: string;
  doc_count: number;
};
export type TimelineDataType = TimelineDataItemType[];

// it's important to keep all available years in the agregation event if empty.
// so We must use a 0 min_doc_count to makes empty years be present in the agregated data
// {
//     "size": 0,
//     "query":{
// 			"term":{"annee.raw": "1993"}
// 		},
//   "aggs": {
//     "annees": {
//       "terms": { "field": "annee.raw", "min_doc_count": 0, "size":100

// 							 },
// 			"aggs": {
// 								 "dates":{"terms":{"field" : "date"}}
// 							 }
//     }
//   }
// }

export type AgePyramidDataItemType = {
  sexe: string;
  "age-tranche": string;
  candidat_count: number;
};

export type AgePyramideDataType = AgePyramidDataItemType[];
// {
//     "size": 0,
//   "aggs": {
// 		"candidats": {

// 			"nested":{ "path" : "candidats" },
// 			"aggs": {
//     "sexe": {
//       "terms": { "field": "candidats.sexe.raw"

// 							 },
// 			"aggs": {
// 								 "age":{"terms":{"field" : "candidats.age-tranche.raw"}}
// 							 }
//     }}
// 		}

//   }

// }

export type TopValuesDataType = {
  field: string;
  tops: {
    key: string;
    cov_count: number;
  }[];
};
