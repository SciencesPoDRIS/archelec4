import { Singleton } from "typescript-ioc";
import { Client } from "@elastic/elasticsearch";
import { Logger, getLogger } from "./logger";
import { config } from "../config";

interface BulkError {
  status: string;
  error: string;
}
type BulkErrorReport = Array<BulkError>;

@Singleton
export class ElasticSearch {
  /**
   * Logger.
   */
  private log = getLogger("ElasticSearch");
  /**
   * Node Elastic client.
   */
  private client: Client;

  /**
   *  ElasticSearch default constructor.
   */
  constructor() {
    this.client = new Client(config.elasticsearch);
  }

  /**
   * Create the index if it not already exists the index.
   *
   * @param {string} index The name of the index to create
   * @param config The ES index configuration
   * @returns {boolean} <code>true</code> if the index has been created, <code>false</code> otherwise.
   * @throws {Error} When an ES call failed
   */
  async createIndex(index: string, config?: any): Promise<boolean> {
    this.log.info(`Create index ${index}`);

    // Check if the index already exists
    const result = await this.client.indices.exists({
      index: index,
    });
    if (result.statusCode === 404) {
      // Creating the index
      this.log.debug(`Creating index ${index} with config ${JSON.stringify(config, null, 2)}`);
      await this.client.indices.create({
        index: index,
        body: config,
      });
      return true;
    } else {
      this.log.debug(`Index ${index} already exist`);
      return false;
    }
  }

  /**
   * Delete an ES index.
   *
   * @param {string} index The name of the index to delete
   * @returns {boolean} <code>true</code> if the index was found and deleted, <code>false</code> otherwise.
   * @throws {Error} When an ES call failed
   */
  async deleteIndex(index: string): Promise<boolean> {
    this.log.info(`Delete index ${index}`);
    const result = await this.client.indices.exists({
      index: index,
    });
    if (result.statusCode === 404) {
      return false;
    }
    await this.client.indices.delete({
      index: index,
      allow_no_indices: true,
    });
    return true;
  }

  /**
   * Create (or recreate if needed) an ES index alias.
   * If the alias already exist for the index, we do nothing.
   * If the alias already exists but need to be update, we delete and recreate it and the method
   * returns the list of the previous index of the alias
   *
   * @param {string} name The name of the alias
   * @param {string} index The name of the index to alias
   * @param {object} body The config for the alias
   * @returns {string[] | null} The list of the previous index of the alias if it has been deleted, null otherwise.
   * @throws {Error} When an ES call failed
   */
  async createIndexAlias(name: string, index: string, body?: any): Promise<string[] | null> {
    let previousIndex: string[] | null = null;
    let needToBeCreated = true;

    // Search if the alias exist
    this.log.info(`Create index alias ${name}:${index}`);
    const result = await this.client.indices.existsAlias({ index, name });

    // if it exist
    if (result.statusCode !== 404) {
      // Check if it's on the same index
      const alias = await this.client.indices.getAlias({ index: "_all", name });
      console.log(alias.body, index, Object.keys(alias.body), Object.keys(alias.body).includes(index));
      if (Object.keys(alias.body).includes(index)) {
        needToBeCreated = false;
        this.log.debug(`Alias ${name} already exist for index ${index}. Nothing to do.`);
      } else {
        this.log.debug(`Delete index alias ${name}`);
        await this.client.indices.deleteAlias({ index, name });
        previousIndex = Object.keys(alias.body);
      }
    }

    // Create the alias
    if (needToBeCreated) {
      this.log.debug(`Put index alias ${name}:${index}`);
      await this.client.indices.putAlias({ index, name, body });
    }

    return previousIndex;
  }

  /**
   * Make a bulk import
   * @param {string} index The index where to import the data
   * @param {Array<object>} the data to import
   */
  async bulkImport(index: string, data: Array<any>): Promise<BulkErrorReport> {
    this.log.info(`ES Bulk import on index ${index} with ${data.length} documents`);
    const body = data.flatMap((doc) => [{ index: { _index: index, _id: doc.id } }, doc]);
    this.log.info(`Indexing ${data.length} documents in index ${index}`);

    const response: any = await this.client.bulk({
      refresh: true,
      body,
    });
    this.log.debug(
      `ES bulk executed in ${response.body.took} ${response.body.errors ? "with errors" : "without error"}`,
    );

    if (response.body.errors) {
      const erroredDocuments: BulkErrorReport = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      response.body.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: JSON.stringify(action[operation].error),
          });
        }
      });
      return erroredDocuments;
    }
  }
}
