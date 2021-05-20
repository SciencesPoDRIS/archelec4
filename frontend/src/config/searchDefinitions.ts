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
      id: "elec",
      label: "Élection",
      openByDefault: true,
      filters: [
        {
          id: "annee",
          type: "terms",
          label: "Année",
          isMulti: true,
        },
        {
          id: "contexte-election",
          type: "terms",
          label: "Type",
          isMulti: true,
        },
        {
          id: "contexte-tour",
          type: "terms",
          label: "Tour",
        },
      ],
    },
    {
      id: "circ",
      label: "Circonscription",
      openByDefault: true,
      filters: [
        {
          id: "departement-insee",
          type: "terms",
          label: "Département",
          isMulti: true,
        },
        {
          id: "circonscription",
          type: "terms",
          label: "Numéro",
          isMulti: true,
        },
      ],
    },
    {
      id: "pol",
      label: "Groupe politique",
      filters: [
        {
          id: "candidats.liste",
          type: "terms",
          label: "Liste",
          isMulti: true,
        },
        {
          id: "candidats.soutien",
          type: "terms",
          label: "Organisation",
          isMulti: true,
        },
      ],
    },
    {
      id: "candidat",
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
          id: "candidats.sexe",
          type: "terms",
          label: "Sexe",
          isMulti: true,
        },
        {
          id: "candidats.age-tranche",
          type: "terms",
          label: "Âge",
          isMulti: true,
        },
      ],
    },
    {
      id: "act",
      label: "Activités candidat⋅e",
      filters: [
        {
          id: "candidats.profession",
          type: "terms",
          label: "Profession",
          isMulti: true,
        },
        {
          id: "candidats.mandat-en-cours",
          type: "terms",
          label: "Mandat en cours",
          isMulti: true,
        },
        {
          id: "candidats.mandat-passe",
          type: "terms",
          label: "Mandat passé",
          isMulti: true,
        },
        {
          id: "candidats.associations",
          type: "terms",
          label: "Association",
          isMulti: true,
        },
        {
          id: "candidats.autres-statuts",
          type: "terms",
          label: "Autre statut",
          isMulti: true,
        },
        {
          id: "candidats.decorations",
          type: "terms",
          label: "Décoration",
          isMulti: true,
        },
      ],
    },
    {
      id: "cont",
      label: "Contenu",
      filters: [
        {
          id: "ocr",
          type: "query",
          label: "Transcription par OCR",
        },
      ],
    },
  ],
};
