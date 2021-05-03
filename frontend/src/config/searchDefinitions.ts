import { SearchTypeDefinition } from "../types";

// Default configuration file
export const professionSearch: SearchTypeDefinition = {
  queryType: "profession",
  index: "",
  label: "Profession de foi",
  sorts: [{ label: "Pertinence", expression: { _score: "desc" }, default: true }],
  filtersGroups: [
    {
      label: "Élection",
      filters: [
        {
          id: "date",
          type: "terms",
          label: "Date",
        },
        {
          id: "contexte-tour",
          type: "terms",
          label: "Tour",
          isMulti: true,
        },
      ],
    },
    {
      label: "Candidat⋅e",
      filters: [
        {
          id: "candidats.nom",
          type: "terms",
          label: "Nom",
          isMulti: true,
        },
        {
          id: "candidats.prenom",
          type: "terms",
          label: "Prénom",
          isMulti: true,
        },
        {
          id: "candidats.position",
          type: "terms",
          label: "Position",
          isMulti: true,
        },
      ],
    },
  ],
};
