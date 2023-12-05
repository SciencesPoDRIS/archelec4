import { toNumber } from "lodash";
import {
  GenericFilterGroupPhraseFactory,
  ElectionGroupPhrase,
  CirconscriptionGroupPhrase,
  ContenuPhrase,
} from "../components/filters/active-filters-phrase";
import { SearchTypeDefinition } from "../types";
import { isNumber } from "../utils";

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
          description:
            "Les dénominations anciennes sont associées aux appellations actuelles. Il n'est pas tenu compte des modifications de périmètre des territoires concernés.",
          isMulti: true,
          order: "departement-order",
          wildcardSearch: false,
        },
        {
          id: "circonscription",
          field: "circonscription",
          type: "terms",
          label: "Identifiant",
          isMulti: true,
          order: (v1, v2) => {
            if (isNumber(v1.term) && isNumber(v2.term)) {
              return toNumber(v1.term) < toNumber(v2.term) ? -1 : 1;
            }
            if (!isNumber(v1.term) && !isNumber(v2.term)) {
              return v1.term < v2.term ? -1 : 1;
            }
            return isNumber(v1.term) ? -1 : 1;
          },
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
          description:
            "Titre donnée à la profession de foi quand celui-ci est distinct d'un nom d'organisation, mouvement, parti, couleur politique, etc. Ce titre peut inclure ou non le mot 'liste'",
          isMulti: true,
          order: "count_desc",
        },
        {
          id: "candidats.soutien",
          field: "candidats.soutien",
          nested: true,
          type: "terms",
          label: "Soutien",
          description: "Toute organisation constituée citée dans la profession de foi comme soutenant la candidature",
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
          description:
            "activité(s) de nature associative citée(s) par le candidat dans la profession de foi et classée(s) en une vingtaine de thématiques, de animaux (protection, élevage...) à syndicat.",
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
          description:
            "toute information personnelle mentionnée sur la profession de foi : passé militaire, situation de famille, situation vis-à-vis de l’emploi.",
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
          description:
            "mention dans la profession de foi de décoration, prix ou récompense décerné(es) au(x) candidats.",
          isMulti: true,
          order: "count_desc",
          wildcardSearch: false,
        },
      ],
    },
    // TODO: refacto filters definition to avoid duplication
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
          description:
            "activité(s) de nature associative citée(s) par le candidat dans la profession de foi et classée(s) en une vingtaine de thématiques, de animaux (protection, élevage...) à syndicat.",
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
          description:
            "toute information personnelle mentionnée sur la profession de foi : passé militaire, situation de famille, situation vis-à-vis de l’emploi.",
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
          description:
            "mention dans la profession de foi de décoration, prix ou récompense décerné(es) au(x) candidats.",
          isMulti: true,
          order: "count_desc",
          wildcardSearch: false,
        },
      ],
    },
    // TODO: refacto filters definition to avoid duplication
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
          description:
            "activité(s) de nature associative citée(s) par le candidat dans la profession de foi et classée(s) en une vingtaine de thématiques, de animaux (protection, élevage...) à syndicat.",
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
          description:
            "toute information personnelle mentionnée sur la profession de foi : passé militaire, situation de famille, situation vis-à-vis de l’emploi.",
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
          description:
            "mention dans la profession de foi de décoration, prix ou récompense décerné(es) au(x) candidats.",
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
