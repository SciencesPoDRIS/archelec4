import { Inject, Singleton } from "typescript-ioc";
import * as fs from "fs";
import * as path from "path";
import pLimit from "p-limit";
import { InternetArchive } from "./internet-archive";
import { BulkError, ElasticSearch } from "./elasticsearch";
import { chunck, computeAge, makeHttpCall, taskInSeries } from "../utils";
import { getLogger } from "./logger";
import { config } from "../config";
import { GetMetadataResponse } from "./internet-archive";
import { departments } from "../config/departments";

/**
 * Error object for import report.
 */
interface ReportError {
  name: string;
  message: string;
  items: Array<string>;
}

/**
 * Report for imports
 */
interface Report {
  /**
   * Duration (in ms) of the import.
   */
  took: number;
  /**
   * Number of item imported
   */
  total: number;
  /**
   * List of errors
   */
  errors: Array<ReportError>;
}

/**
 * Options for the import execution.
 */
export interface ImportOptions {
  /**
   * (optional if ids is defined) The date from which we need to retrieve the last modified item
   */
  date?: Date;
  /**
   * (optional) The date to which we need to retrieve the last modified item
   */
  to?: Date;
  /**
   * (optional) The name of the ES index
   */
  index?: string;
  /**
   * (optional) A list of ids to import
   */
  ids?: Array<string>;
}

/**
 * Import report
 */
export interface ImportReport extends Report {
  /**
   * Settings used for the import
   */
  settings: { from: Date; to: Date; index: string };
}

export interface ArchiveElectoralCandidat {
  nom: string;
  prenom: string;
  type: string;
  sexe: string;
  age?: string;
  "age-calcule"?: string;
  "age-tranche"?: string;
  profession: string;
  "mandat-en-cours": string;
  "mandat-passe": string;
  associations: string;
  "autres-statuts": string;
  soutien: string;
  liste: string;
  decorations: string;
}

export interface ArchiveElectoralProfessionDeFoi {
  id: string;
  candidats: Array<ArchiveElectoralCandidat>;
  date: Date;
  annee: string;
  subject: Array<string>;
  title: string;
  type: string;
  "contexte-election": string;
  "contexte-tour": string;
  cote: string;
  departement: string;
  "departement-insee": string;
  "departement-nom": string;
  circonscription: string;
  // custom field
  images: Array<{ url: string; thumb?: string }>;
  pdf: string;
}

type ArchiveElectoralImportProfessionDeFoi = ArchiveElectoralProfessionDeFoi & { ocr?: string };

@Singleton
export class Import {
  /**
   * Logger
   */
  private log = getLogger("Import");

  @Inject
  private ia: InternetArchive;

  @Inject
  private es: ElasticSearch;

  /**
   * Execute the import of the collection into elasticsearch
   *
   * Errors don't block the import process. So the process should never fails,
   * instead it returns the list of errors that the processus has encountered.
   * If you have errors, you should have the list of IDS in the report, and you can retry to import those items
   * by calling the method
   *
   * NOTE: To trigger a full reindex, just delete the file <code>last_import_date_file_path</code> on the FS
   *
   * IMPORTANT: You can override the period & index name of the import, by specifying the paramater <code>options</code>
   * on this method. It can be usefull to make an import per party (ex: by week slices).
   */
  public async execution(options?: ImportOptions): Promise<ImportReport> {
    const now = Date.now();

    // Init variables
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const lastImportData = this.getLastExecutionData();
    const settings: ImportOptions | null =
      lastImportData || options ? { ...(lastImportData || {}), ...(options || {}) } : null;

    const indexName = settings && settings.index ? settings.index : `${config.elasticsearch_alias_name}_${Date.now()}`;
    const period: { from: Date; to: Date } | null = settings.date
      ? {
          from: settings.date,
          to: settings.to ? settings.to : new Date(),
        }
      : null;

    this.log.debug("Make import with settings", { settings, indexName, period });

    // Make calls to IA get collection ids
    const collectionIds = (
      await (settings.ids
        ? Promise.resolve(settings.ids)
        : this.ia.getCollectionIds(config.internet_archive_collection, config.internet_archive_collection_type, period))
    ).filter((id) => !id.endsWith("Pdfmasterocr"));

    // Create the ES index if needed
    await this.es.createIndex(indexName, config.elastic_index_configuration);

    // Create chunks
    const chuncks = chunck(collectionIds, config.import_batch_size);

    // import chunks in serial way
    const reports = await taskInSeries(
      chuncks.map((ids, index) => {
        return async () => {
          const report = await this.taskImportForIds(ids, indexName);
          this.log.debug(`Task ${index + 1} report`, report);
          return report;
        };
      }),
    );

    // Change / create the alias if needed.
    // If the alias already points to the index, nothing is done.
    // If the alias doesn't point to the index, it is changed, and the previous pointed index is deleted
    const prevIndices = await this.es.createIndexAlias(config.elasticsearch_alias_name, indexName);
    if (prevIndices) {
      await Promise.all(prevIndices.map((i) => this.es.deleteIndex(i)));
    }

    // Only save import data if it was a period import
    // So users are able to import a list of ids without to change the last date import
    // Question : do we need save only if the date is higher than the one stored ??
    if (!settings.ids) this.saveLastExecution(period ? period.to : new Date(now), indexName);

    const report = {
      settings: { ...period, index: indexName },
      errors: reports.flatMap((r) => r.errors),
      took: Date.now() - now,
      total: collectionIds.length,
    };

    this.log.debug("Import report", report);

    return report;
  }

  /**
   * Save the specified last execution data on the disk.
   *
   * @param data The date to save
   * @param index The ES index name
   * @throw An exeption if an error occured
   */
  public saveLastExecution(date: Date, index: string): void {
    this.log.info(`Saving last execution on file system : ${date.toISOString()} | ${index}`);
    try {
      fs.writeFileSync(
        path.join(__dirname, "../../", config.last_import_date_file_path),
        JSON.stringify({ date: date.toISOString(), index }),
      );
    } catch (e) {
      throw new Error(`An error occured when saving on disk : ${e}`);
    }
  }

  /**
   * Retrieve the last execution data on the disk if exists.
   */
  private getLastExecutionData(): { date: Date; index: string } | null {
    let result: { date: Date; index: string } | null = null;
    const filePath = path.join(__dirname, "../../", config.last_import_date_file_path);
    this.log.info(`Loading file`, filePath);
    if (fs.existsSync(filePath)) {
      try {
        const txt = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(txt);
        result = { date: new Date(json.date), index: json.index };
      } catch (e) {
        throw new Error("Fail to retrieve last update date from the file system : " + e.message);
      }
    }
    this.log.debug(`Last execution data`, result);
    return result;
  }

  /**
   * Do the import process for the given list of item's id.
   * /!\ Should always returns a resolved promise, errors are in the returned report.
   * @param ids An array of id
   * @param index ES index name where to send the data
   * @returns A resolved promise that contains the report of the import with a list of encountered errors.
   */
  private async taskImportForIds(ids: Array<string>, index: string): Promise<Report> {
    const now = Date.now();
    const errors: Array<ReportError> = [];

    try {
      // limit the concurrency
      const limit = pLimit(config.import_api_max_concurrency);

      // Retrieve the metadata item and cast it
      const data = await Promise.all(
        ids.map((id) => {
          return limit(async () => {
            try {
              const item = await this.ia.getMetadata(id);
              return await this.postProcessItem(item);
            } catch (e) {
              errors.push({ name: `Failed to build object ${id}`, items: [id], message: e.message });
              return null;
            }
          });
        }),
      );

      // Send the (available) data to ES
      const esErrors = await this.es.bulkImport(
        index,
        data.filter((i) => i !== null),
      );
      (esErrors ? esErrors : []).forEach((error: BulkError) =>
        errors.push({ name: error.status, message: error.error, items: [error.doc] }),
      );
    } catch (e) {
      errors.push({ name: `Unknown error on ids import for list`, items: ids, message: e.message });
    }

    return {
      took: Date.now() - now,
      total: ids.length,
      errors: errors,
    };
  }

  /**
   * Method that cast an item return by metadata api to our business object.
   * @param item The object returned by the metadata API
   * @returns The object that will be indexed by elastic or null
   */
  private async postProcessItem(item: GetMetadataResponse): Promise<ArchiveElectoralImportProfessionDeFoi> {
    const result: Partial<ArchiveElectoralImportProfessionDeFoi> = {
      id: item.id,
    };

    const titulaire: Partial<ArchiveElectoralCandidat> = { type: "titulaire" };
    const suppleant: Partial<ArchiveElectoralCandidat> = { type: "suppleant" };

    // Take each metadata and remove the prefix
    Object.keys(item.metadata).forEach((key: string) => {
      // Check if the key validate the spec
      if (config.internet_archive_collection_metadata_filters.find((e) => key.endsWith(e))) {
        const value: any = key.endsWith("date") ? new Date(item.metadata[key] as any) : item.metadata[key];
        const newKey = key.replace(/^[a-z]{2}-/, "");

        if (value !== "NR" && value !== "") {
          if (key.endsWith("-titulaire")) titulaire[newKey.replace("-titulaire", "")] = value;
          else if (key.endsWith("-suppleant")) suppleant[newKey.replace("-suppleant", "")] = value;
          else if (key === "subject") {
            result[newKey] = typeof value === "string" ? value.split(";") : value;
          } else if (key === "departement") {
            result[newKey] = value;
            result["departement-insee"] = departments[value];
          } else if (key === "date") {
            result[newKey] = value;
            // compute year of election for search facet
            result["annee"] = new Date(value).getFullYear() + "";
          } else result[newKey] = value;
        }
      }
    });

    result.candidats = [];
    if (Object.keys(titulaire).length > 1) {
      const ageObject = computeAge(result["date"], titulaire["age"]);
      if (ageObject) {
        titulaire["age-calcule"] = ageObject.age;
        titulaire["age-tranche"] = ageObject.range;
      }
      result.candidats.push(titulaire as ArchiveElectoralCandidat);
    }
    if (Object.keys(suppleant).length > 1) {
      const ageObject = computeAge(result["date"], result["age"]);
      if (ageObject) {
        suppleant["age-calcule"] = ageObject.age;
        suppleant["age-tranche"] = ageObject.range;
      }
      result.candidats.push(suppleant as ArchiveElectoralCandidat);
    }

    // PDF Files
    const pdf = item.files.find((f) => f.format === "Image Container PDF");
    if (pdf) result.pdf = pdf.url;

    // OCR file
    const ocr = item.files.find((f) => f.format === "DjVuTXT");
    if (ocr) result.ocr = await makeHttpCall({ url: ocr.url });

    // JPEG
    result.images = item.files
      .filter((f) => f.format === "JPEG")
      .map((f) => {
        const thumb = item.files.find((f2) => f2.original === f.name && f2.format === "JPEG Thumb");
        return {
          url: f.url,
          thumb: thumb ? thumb.url : null,
        };
      });

    return result as ArchiveElectoralImportProfessionDeFoi;
  }
}
