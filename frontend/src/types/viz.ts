// Visualization data types

// Cartography
export type CartographyDataItemType = {
  departement: string; // to match map polygon
  "departement-insee": string;
  "departement-nom": string;
  doc_count: number;
};

// Timeline
export type TimelineDataItemType = {
  dates: Date[]; // could also be string and let the viz do the format into date
  annee: string;
  doc_count: number;
};

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

export type TopValuesDataType = {
  field: string;
  tops: Array<{
    key: string;
    count: number;
  }>;
};

export interface DashboardDataType {
  agePyramid: Array<AgePyramidDataItemType>;
  timeline: Array<TimelineDataItemType>;
  carto: Array<CartographyDataItemType>;
  topListes: TopValuesDataType;
  topSoutiens: TopValuesDataType;
  topMandats: TopValuesDataType;
  topOcr: TopValuesDataType;
}
