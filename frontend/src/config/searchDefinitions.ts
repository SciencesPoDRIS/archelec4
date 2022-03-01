import {
  GenericFilterGroupPhraseFactory,
  ElectionGroupPhrase,
  CirconscriptionGroupPhrase,
  ContenuPhrase,
} from "../components/filters/active-filters-phrase";
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
      activeFiltersPhrase: ElectionGroupPhrase,
      openByDefault: true,
      filters: [
        {
          id: "annee",
          field: "annee",
          type: "terms",
          label: "Année",
          isMulti: true,
          order: "key_asc",
        },
        {
          id: "contexte-election",
          field: "contexte-election",
          type: "terms",
          label: "Type",
          isMulti: true,
          order: "key_asc",
          wildcardSearch: false,
        },
        {
          id: "contexte-tour",
          field: "contexte-tour",
          type: "terms",
          label: "Tour",
          order: "key_asc",
          wildcardSearch: false,
        },
      ],
    },
    {
      label: "Circonscription",
      activeFiltersPhrase: CirconscriptionGroupPhrase,
      openByDefault: true,
      filters: [
        {
          id: "departement-insee",
          field: "departement-insee",
          type: "terms",
          label: "Département",
          isMulti: true,
          order: "departement-order",
          wildcardSearch: false,
        },
        {
          id: "circonscription",
          field: "circonscription",
          type: "terms",
          label: "Numéro",
          isMulti: true,
          order: "key_asc",
          wildcardSearch: false,
        },
      ],
    },
    {
      label: "Groupe politique",
      activeFiltersPhrase: GenericFilterGroupPhraseFactory("Groupe politique", "dont le "),
      filters: [
        {
          id: "candidats.liste",
          field: "candidats.liste",
          nested: true,
          type: "terms",
          label: "Liste",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.soutien",
          field: "candidats.soutien",
          nested: true,
          type: "terms",
          label: "Soutien",
          isMulti: true,
          order: "count_desc",
        },
      ],
    },
    {
      label: "Candidat-e",
      activeFiltersPhrase: GenericFilterGroupPhraseFactory("Candidat-e", "ayant un-e "),
      filters: [
        {
          id: "candidats.prenom-nom",
          field: "candidats.prenom-nom",
          nested: true,
          type: "terms",
          label: "Prénom Nom",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.nom",
          field: "candidats.nom",
          nested: true,
          type: "terms",
          label: "Nom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.prenom",
          field: "candidats.prenom",
          nested: true,
          type: "terms",
          label: "Prénom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.sexe",
          field: "candidats.sexe",
          nested: true,
          type: "terms",
          label: "Sexe",
          order: "count_desc",
        },
        {
          id: "candidats.age-tranche",
          field: "candidats.age-tranche",
          nested: true,
          type: "terms",
          label: "Tranche d'âge",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.profession",
          field: "candidats.profession",
          nested: true,
          type: "terms",
          label: "Profession",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.mandat-en-cours",
          field: "candidats.mandat-en-cours",
          nested: true,
          type: "terms",
          label: "Mandat en cours",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.mandat-passe",
          field: "candidats.mandat-passe",
          nested: true,
          type: "terms",
          label: "Mandat passé",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.associations",
          field: "candidats.associations",
          nested: true,
          type: "terms",
          label: "Association",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.autres-statuts",
          field: "candidats.autres-statuts",
          nested: true,
          type: "terms",
          label: "Autre statut",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "candidats.decorations",
          field: "candidats.decorations",
          nested: true,
          type: "terms",
          label: "Décoration",
          isMulti: true,
          order: "count_desc",
          wildcardSearch: false,
        },
      ],
    },
    {
      label: "Candidat-e titulaire",
      activeFiltersPhrase: GenericFilterGroupPhraseFactory("Candidat-e titulaire", "ayant un-e "),
      filters: [
        {
          id: "titulaire.prenom-nom",
          field: "candidats.prenom-nom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Prénom Nom",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.nom",
          field: "candidats.nom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Nom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "titulaire.prenom",
          field: "candidats.prenom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Prénom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "titulaire.sexe",
          field: "candidats.sexe",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Sexe",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "titulaire.age-tranche",
          field: "candidats.age-tranche",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Tranche d'âge",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "titulaire.profession",
          field: "candidats.profession",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Profession",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.mandat-en-cours",
          field: "candidats.mandat-en-cours",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Mandat en cours",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.mandat-passe",
          field: "candidats.mandat-passe",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Mandat passé",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.associations",
          field: "candidats.associations",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Association",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.autres-statuts",
          field: "candidats.autres-statuts",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Autre statut",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "titulaire.decorations",
          field: "candidats.decorations",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "titulaire" } },
          type: "terms",
          label: "Décoration",
          isMulti: true,
          order: "count_desc",
          wildcardSearch: false,
        },
      ],
    },
    {
      label: "Candidat-e suppléant-e",
      activeFiltersPhrase: GenericFilterGroupPhraseFactory("Candidat-e suppléant-e", "ayant un-e "),
      filters: [
        {
          id: "suppleant.prenom-nom",
          field: "candidats.prenom-nom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Prénom Nom",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.nom",
          field: "candidats.nom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Nom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "suppleant.prenom",
          field: "candidats.prenom",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Prénom",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "suppleant.sexe",
          field: "candidats.sexe",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Sexe",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "suppleant.age-tranche",
          field: "candidats.age-tranche",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Tranche d'âge",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "suppleant.profession",
          field: "candidats.profession",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Profession",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.mandat-en-cours",
          field: "candidats.mandat-en-cours",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Mandat en cours",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.mandat-passe",
          field: "candidats.mandat-passe",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Mandat passé",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.associations",
          field: "candidats.associations",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Association",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.autres-statuts",
          field: "candidats.autres-statuts",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Autre statut",
          isMulti: true,
          wildcardSearch: true,
          order: "count_desc",
        },
        {
          id: "suppleant.decorations",
          field: "candidats.decorations",
          nested: true,
          extraQueryField: { term: { "candidats.type.raw": "suppléant" } },
          type: "terms",
          label: "Décoration",
          isMulti: true,
          order: "count_desc",
          wildcardSearch: false,
        },
      ],
    },

    {
      label: "Texte",
      activeFiltersPhrase: ContenuPhrase,
      filters: [
        {
          id: "ocr",
          field: "ocr.search",
          type: "query",
          label: "Transcription (OCR)",
        },
      ],
    },
  ],
};
