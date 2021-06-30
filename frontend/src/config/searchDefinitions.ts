import { SearchTypeDefinition } from "../types";

// Default configuration file
export const professionSearch: SearchTypeDefinition = {
  queryType: "profession",
  index: "",
  label: "Profession de foi",
  sorts: [
    {
      label: "Chronologique",
      expression: [
        "date",
        { "departement.raw": "asc" },
        { "circonscription.raw": "asc" },
        "candidats.nom.raw",
        "contexte-tour.raw",
      ],
      default: true,
    },
  ],
  filtersGroups: [
    {
      label: "Élection",
      openByDefault: true,
      filters: [
        {
          id: "annee",
          type: "terms",
          label: "Année",
          isMulti: true,
          order: "key_asc",
        },
        {
          id: "contexte-election",
          type: "terms",
          label: "Type",
          isMulti: true,
          order: "key_asc",
        },
        {
          id: "contexte-tour",
          type: "terms",
          label: "Tour",
          isMulti: true,
          order: "key_asc",
        },
      ],
    },
    {
      label: "Circonscription",
      openByDefault: true,
      filters: [
        {
          id: "departement-insee",
          type: "terms",
          label: "Département",
          isMulti: true,
          order: "key_asc",
        },
        {
          id: "circonscription",
          type: "terms",
          label: "Numéro",
          isMulti: true,
          order: "key_asc",
        },
      ],
    },
    {
      label: "Groupe politique",
      filters: [
        {
          id: "candidats.liste",
          type: "terms",
          label: "Liste",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.soutien",
          type: "terms",
          label: "Organisation",
          isMulti: true,
          order: "count_desc",
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
          order: "count_desc",
        },
        {
          id: "candidats.prenom",
          type: "terms",
          label: "Prénom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.sexe",
          type: "terms",
          label: "Sexe",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.age-tranche",
          type: "terms",
          label: "Tranche d'âge",
          isMulti: true,
          order: "count_desc",
        },
      ],
    },
    {
      label: "Activités candidat⋅e",
      filters: [
        {
          id: "candidats.profession",
          type: "terms",
          label: "Profession",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.mandat-en-cours",
          type: "terms",
          label: "Mandat en cours",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.mandat-passe",
          type: "terms",
          label: "Mandat passé",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.associations",
          type: "terms",
          label: "Association",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.autres-statuts",
          type: "terms",
          label: "Autre statut",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.decorations",
          type: "terms",
          label: "Décoration",
          isMulti: true,
          order: "count_desc",
        },
      ],
    },
    {
      label: "Contenu",
      filters: [
        {
          id: "ocr",
          type: "query",
          label: "Transcription (OCR)",
        },
      ],
    },
  ],
};
