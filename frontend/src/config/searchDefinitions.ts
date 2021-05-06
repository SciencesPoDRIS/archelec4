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
          id: "annee",
          type: "terms",
          label: "Date",
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
        {
          id: "candidats.type",
          type: "terms",
          label: "Rang",
          isMulti: true,
        },
      ],
    },
    {
      label: "Circonscription",
      filters: [
        {
          id: "circonscription",
          type: "terms",
          label: "Numéro",
          isMulti: true,
        },
        {
          id: "departement",
          type: "terms",
          label: "Département",
          isMulti: true,
        },
      ],
    },
    {
      label: "Groupe Politique",
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
          label: "Soutien",
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
          id: "candidats.sexe",
          type: "terms",
          label: "Genre",
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
  ],
};
