import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { isArray } from "lodash";
import { getLogger } from "./services/logger";
import { ArchiveElectoralProfessionDeFoi, ArchiveElectoralCandidat } from "./services/import";
import { config } from "./config";

/**
 * Logger instance for this module.
 */
const LOG = getLogger("Utils");

/**
 * Generic method that perfoms a http call and handle errors.
 *
 * @param request The Axios request
 * @param retry How many retry we need to do if a request failed
 * @returns The API body response as promise
 */
export async function makeHttpCall<T>(request: AxiosRequestConfig, retry = config.axios.nb_retry): Promise<T> {
  LOG.info(`Make request ${JSON.stringify(request, null, 2)}`);
  try {
    const response = await axios({ ...request, timeout: config.axios.timeout });
    return response.data;
  } catch (e) {
    if (retry > 0) {
      LOG.info(`Retry request ${JSON.stringify(request, null, 2)}`);
      return makeHttpCall(request, retry--);
    } else {
      let error = `Failed to retrieve data for ${request.url} : `;
      if (e.response) error += `response status is ${e.response.status} - ${e.response.data}`;
      else if (e.request) {
        error += `no response from the server -> ${e.message}`;
      } else error += e.message;
      throw new Error(error);
    }
  }
}

/**
 * Given a list of async function, this method will execute them in a serial way
 *
 * @param tasks The list of async function (task) to execute in serial
 * @returns An array of result as a promise
 */
export async function taskInSeries<T>(tasks: Array<() => Promise<T>>): Promise<Array<T>> {
  return tasks.reduce((promiseChain, currentTask, index) => {
    return promiseChain.then((chainResults) => {
      LOG.info(`Task ${index + 1} / ${tasks.length} started`);
      return currentTask().then((currentResult) => {
        LOG.info(`Task ${index + 1} / ${tasks.length} completed`);
        return [...chainResults, currentResult];
      });
    });
  }, Promise.resolve([] as Array<T>));
}

/**
 * Split the `items` array into multiple, smaller arrays of the given `size`.
 *
 * @param items The array to split in chuncks
 * @param size Size of a chunck
 */
export function chunck<T>(items: Array<T>, size: number): Array<Array<T>> {
  const chunks: Array<Array<T>> = [];
  // Copy the list to avoid to modify it
  const list = [...items];
  while (list.length > 0) {
    chunks.push(list.splice(0, size));
  }
  return chunks;
}

/**
 * Cast an ES object ArchiveElectoralProfessionDeFoi to our custom type.
 * NB: This method was mainly created to handle arrays, ES has no array type so it returns a string or a string[]
 *
 */
export function esCastArchiveElectoralProfessionDeFoi(item: any): ArchiveElectoralProfessionDeFoi {
  const result = item as ArchiveElectoralProfessionDeFoi;
  if (!isArray(item.subject)) result.subject = item.subject ? [item.subject] : [];
  if (!isArray(item.images)) result.images = item.images ? [item.images] : [];
  if (!isArray(item.candidats)) result.candidats = item.candidats ? [item.candidats] : [];
  result.candidats = result.candidats.map((candidat: ArchiveElectoralCandidat) => {
    if (!isArray(candidat.profession)) candidat.profession = candidat.profession ? [candidat.profession] : [];
    if (!isArray(candidat["mandat-en-cours"]))
      candidat["mandat-en-cours"] = candidat["mandat-en-cours"] ? [candidat["mandat-en-cours"]] : [];
    if (!isArray(candidat["mandat-passe"]))
      candidat["mandat-passe"] = candidat["mandat-passe"] ? [candidat["mandat-passe"]] : [];
    if (!isArray(candidat.associations)) candidat.associations = candidat.associations ? [candidat.associations] : [];
    if (!isArray(candidat["autres-statuts"]))
      candidat["autres-statuts"] = candidat["autres-statuts"] ? [candidat["autres-statuts"]] : [];
    if (!isArray(candidat.soutien)) candidat.soutien = candidat.soutien ? [candidat.soutien] : [];
    if (!isArray(candidat.liste)) candidat.liste = candidat.liste ? [candidat.liste] : [];
    return candidat;
  });
  return result;
}

/**
 * Given a age number, it return the range decade.
 * Ex : 29 -> 20-29
 * @param age The age on which we compute the range
 * @returns The computed range
 */
function computeAgeRange(age: number): string {
  const decade = Math.trunc(age / 10) * 10;
  return `${decade}-${decade + 9}`;
}

/**
 * Compute the age from a date and an input age that can be
 *  - a two digit (the age)
 *  - a four digit (the birth year)
 *  - NR
 *  - Some strings ...
 * @param dateElection The date of the election so we can compute the age if we have a year
 * @param age The age input
 * @returns An object with the computed age and range
 */
export function computeAge(dateElection: Date, age: string): { age: string; range: string } | null {
  let result = { age: "imprécis", range: "indéterminé" };
  if (age === "NR") {
    result = null;
  } else if (/^[0-9]{2}$/.test(age)) {
    result.age = age;
    result.range = computeAgeRange(Number.parseInt(age));
  } else if (/^[0-9]{4}$/.test(age)) {
    const computedAge = dateElection.getFullYear() - Number.parseInt(age);
    result.age = `${computedAge}`;
    result.range = computeAgeRange(computedAge);
  } else if (age === "192X") {
    // nothing to do (default value)
  } else if (age === "23 et demi") {
    result.range = "20-29";
  } else if (age === "29 ou 28") {
    result.range = "20-29";
  } else if (age === "30 ou 29") {
    result.range = "30-39";
  } else if (age === "33 ou 30") {
    result.range = "30-39";
  } else if (age === "37 ou 36") {
    result.range = "30-39";
  } else if (age === "38 ou 37") {
    result.range = "30-39";
  } else if (age === "40 ou 39") {
    result.range = "40-49";
  } else if (age === "41 ou 40") {
    result.range = "40-49";
  } else if (age === "60 au moins") {
    result.range = "60-69";
  } else if (age === "doyen") {
    // nothing to do (default value)
  } else if (age === "moins de 30") {
    result.range = "20-29";
  } else if (age === "moins de 40") {
    result.range = "30-39";
  } else if (age === "quarantaine") {
    result.range = "40-49";
  }

  return result;
}

export function archiveElectoralCandidatToArrayFields(candidat: Partial<ArchiveElectoralCandidat>): Array<string> {
  return [
    candidat.nom,
    candidat.prenom,
    candidat.sexe,
    candidat.age,
    candidat["age-calcule"],
    candidat["age-tranche"],
    (candidat.profession || []).join(";"),
    (candidat["mandat-en-cours"] || []).join(";"),
    (candidat["mandat-passe"] || []).join(";"),
    (candidat.associations || []).join(";"),
    (candidat["autres-statuts"] || []).join(";"),
    (candidat.soutien || []).join(";"),
    (candidat.liste || []).join(";"),
    candidat.decorations,
  ];
}

export function archiveElectoralProfessionDeFoiToCsvLine(esItem: ArchiveElectoralProfessionDeFoi): string {
  const item = esCastArchiveElectoralProfessionDeFoi(esItem);
  const electionValue = [
    item.id,
    item.date
      ? item.date
          .toLocaleString("fr-FR", { year: "numeric", month: "numeric", day: "numeric" })
          .replace("T00:00:00.000Z", "")
      : "",
    item.subject.join(";"),
    item.title,
    item["contexte-election"],
    item["contexte-tour"],
    item.cote,
    item.departement,
    item["departement-nom"],
    item["departement-insee"],
    item.circonscription,
    item.images.map((i) => i.url).join(";"),
    item.pdf,
    item.ocr_url,
  ];

  const titulaire: Partial<ArchiveElectoralProfessionDeFoi> = item.candidats.find((c) => c.type === "titulaire") || {};
  const suppleant: Partial<ArchiveElectoralProfessionDeFoi> = item.candidats.find((c) => c.type === "suppléant") || {};

  const columnsValue = electionValue
    .concat(archiveElectoralCandidatToArrayFields(titulaire))
    .concat(archiveElectoralCandidatToArrayFields(suppleant));
  return columnsValue.map((e) => (e ? `"${e.replace(/"/, '""')}"` : "")).join(",");
}

export const ArchiveElectoralProfessionDeFoiCsvHeader = [
  "id",
  "date",
  "subject",
  "title",
  "contexte-election",
  "contexte-tour",
  "cote",
  "departement",
  "departement-nom",
  "departement-insee",
  "circonscription",
  "images",
  "pdf",
  "ocr_url",
  "titulaire-nom",
  "titulaire-prenom",
  "titulaire-sexe",
  "titulaire-age",
  "titulaire-age-calcule",
  "titulaire-age-tranche",
  "titulaire-profession",
  "titulaire-mandat-en-cours",
  "titulaire-mandat-passe",
  "titulaire-associations",
  "titulaire-autres-statuts",
  "titulaire-soutien",
  "titulaire-liste",
  "titulaire-decorations",
  "suppleant-nom",
  "suppleant-prenom",
  "suppleant-sexe",
  "suppleant-age",
  "suppleant-age-calcule",
  "suppleant-age-tranche",
  "suppleant-profession",
  "suppleant-mandat-en-cours",
  "suppleant-mandat-passe",
  "suppleant-associations",
  "suppleant-autres-statuts",
  "suppleant-soutien",
  "suppleant-liste",
  "suppleant-decorations",
];
