import { Inject, Singleton } from "typescript-ioc";
import * as fs from "fs";
import * as path from "path";
import { InternetArchive } from "./internet-archive";
import { ElasticSearch } from "./elasticsearch";
import { getLogger } from "./logger";
import { config } from "../config";

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
   * Execute the import of the collection into elasticsearch.
   *
   * To trigger a full reindex, just delete the file <code>last_import_date_file_path</code> on the FS
   * The algo is the following :
   *  - Check if it's a full import (full) or a delta import by checking the file on the FS
   *  - If it's a full import, we generate a new ES index name, otherwise we take the existant one
   *  - Retieves the ids of the collection
   *  - For each id, retrieves the metadata
   *  - Create (if needed) the ES index
   *  - Load the data in ES
   *  - Change (if needed) the index alias
   *  - Save on the FS the import data
   *
   * IMPORTANT: You can override the period & index name of the import, by specifying the paramater <code>opts</code> on this method.
   * It can be usefull to make an import per party (ex: by week slices).
   */
  public async execution(options?: { date: Date; to?: Date; index: string }): Promise<void> {
    // Init variables
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const settings: { date: Date; to?: Date; index: string } = { ...this.getLastExecutionData(), ...options };
    const indexName = settings.index ? settings.index : `${config.import.elasticsearch_alias_name}_${Date.now()}`;
    const period: { from: Date; to: Date } | null = settings
      ? {
          from: settings.date,
          to: settings.to ? settings.to : new Date(),
        }
      : null;

    // Make calls to IA
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const collectionIds = await this.ia.getCollectionIds(config.import.internet_archive_collection, period);
    // TODO: add a setTimeout for each query to avoid an overload on IA ???
    const data = await Promise.all(collectionIds.map((id) => this.ia.getMetadata(id)));

    // Saving in ES
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    await this.es.createIndex(indexName);
    await this.es.bulkImport(indexName, data);
    const prevIndices = await this.es.createIndexAlias(config.import.elasticsearch_alias_name, indexName);
    if (prevIndices) {
      await Promise.all(prevIndices.map((i) => this.es.deleteIndex(i)));
    }

    // Saving import data
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.saveLastExecution(period.to, indexName);
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
        path.join(__dirname, "../../", config.import.last_import_date_file_path),
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
    const filePath = path.join(__dirname, "../../", config.import.last_import_date_file_path);
    this.log.debug(`Loading file`, filePath);
    if (fs.existsSync(filePath)) {
      try {
        const txt = fs.readFileSync(filePath, "utf8");
        const json = JSON.parse(txt);
        result = { date: new Date(json.date), index: json.index };
      } catch (e) {
        throw new Error("Fail to retrieve last update date from the file system : " + e.message);
      }
    }
    return result;
  }
}
