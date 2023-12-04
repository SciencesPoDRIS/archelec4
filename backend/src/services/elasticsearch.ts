import { Singleton } from "typescript-ioc";
import { Client } from "@elastic/elasticsearch";
import { Readable } from "stream";
import { getLogger } from "./logger";
import { config } from "../config";

export interface BulkError {
  doc: string;
  status: string;
  error: string;
}
type BulkErrorReport = Array<BulkError>;

export type SearchRequest = { body: Record<string, unknown>; index: string; scroll?: string };
export type SearchResponse<T> = {
  _scroll_id?: string;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
    }>;
  };
};

@Singleton
export class ElasticSearch {
  /**
   * Logger.
   */
  public log = getLogger("ElasticSearch");
  /**
   * Node Elastic client.
   */
  public client: Client;

  /**
   *  ElasticSearch default constructor.
   */
  constructor() {
    this.client = new Client(config.elasticsearch);
  }

  /**
   * Method to get an element in an index.
   *
   * @param index The name of the index where to find the element
   * @param id The id of the element to search
   * @param cast (optional) A function that can be used to cast an ES object to a business object
   */
  async get<T>(index: string, id: string, cast?: (e: Record<string, unknown>) => T): Promise<T> {
    const result = await this.client.get({ index, id });
    return cast ? cast(result.body._source) : (result.body._source as T);
  }

  /**
   * Method to search on ES.
   *
   * @param request The search request to send to ES
   * @param cast (optional) A function that can be used to cast an ES object to a business object
   */
  async search<T>(request: SearchRequest, cast?: (e: Record<string, unknown>) => T): Promise<SearchResponse<T>> {
    const { body } = await this.client.search(request);
    if (cast) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body.hits.hits = body.hits.hits.map((hit: any) => {
        hit._source = cast(hit._source);
        return hit;
      });
    }
    return body as SearchResponse<T>;
  }

  /**
   * Search documents and send them as a stream
   */
  fullSearchAsStream<T>(
    request: SearchRequest,
    transform: (i: T) => string,
    stream_opts: { batchSize: number; prefix?: string } = { batchSize: 500 },
  ): ElasticSearchReadable<T> {
    return new ElasticSearchReadable(this, request, transform, stream_opts);
  }

  /**
   * Create the index if it not already exists the index.
   *
   * @param {string} index The name of the index to create
   * @param config The ES index configuration
   * @returns {boolean} <code>true</code> if the index has been created, <code>false</code> otherwise.
   * @throws {Error} When an ES call failed
   */
  async createIndex(index: string, config?: Record<string, unknown>): Promise<boolean> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createIndexAlias(name: string, index: string, body?: any): Promise<string[] | null> {
    let previousIndex: string[] | null = null;
    let needToBeCreated = true;

    // Search if the alias exist
    this.log.info(`Create index alias ${name}:${index}`);
    const result = await this.client.indices.existsAlias({ name });

    // if it exist
    if (result.statusCode !== 404) {
      // Check if it's on the same index
      const alias = await this.client.indices.getAlias({ name });
      if (Object.keys(alias.body).includes(index)) {
        needToBeCreated = false;
        this.log.debug(`Alias ${name} already exist for index ${index}. Nothing to do.`);
      } else {
        this.log.debug(`Delete index alias ${name}`);
        await Promise.all(Object.keys(alias.body).map((i) => this.client.indices.deleteAlias({ index: i, name })));
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
  async bulkImport<T extends { id: string }>(index: string, data: Array<T>): Promise<BulkErrorReport> {
    if (data.length === 0) {
      this.log.warn("There is no data to index");
      return [];
    }

    this.log.info(`ES Bulk import on index ${index} with ${data.length} documents`);
    const body = data.flatMap((doc) => [{ index: { _index: index, _id: doc.id } }, doc]);
    this.log.info(`Indexing ${data.length} documents in index ${index}`);

    const response = await this.client.bulk({
      refresh: true,
      body,
    });
    this.log.debug(
      `ES bulk executed in ${response.body.took}ms ${response.body.errors ? "with errors" : "without error"}`,
    );

    if (response.body.errors) {
      const erroredDocuments: BulkErrorReport = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.body.items.forEach((action: any) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            doc: action[operation]._id,
            status: action[operation].status,
            error: JSON.stringify(action[operation].error),
          });
        }
      });
      return erroredDocuments;
    }

    return [];
  }
}

class ElasticSearchReadable<T> extends Readable {
  service: ElasticSearch;
  request: SearchRequest;
  transform: (e: T) => string;
  options: { batchSize: number; prefix?: string };
  nbParsedDocument = 0;
  scroll_id = "";

  constructor(
    service: ElasticSearch,
    request: SearchRequest,
    transform: (e: T) => string,
    options: { batchSize: number; prefix?: string },
  ) {
    super();
    this.service = service;
    this.request = request;
    this.transform = transform;
    this.options = options;
    console.log(options);
  }
  _read() {
    this.service.log.debug(`Streaming from ${this.nbParsedDocument}`);

    if (this.nbParsedDocument > 0) {
      this.service.client
        .scroll({ scroll_id: this.scroll_id, scroll: "30s" })
        .then((r) => this._parseEsResponse(r.body as SearchResponse<T>))
        .catch((e) => {
          this.service.log.error(`Fail to compute chunk for stream`, e);
          this.destroy(e);
        });
    } else {
      const request = this.request;
      request.body.from = 0;
      request.body.size = this.options.batchSize;
      request.scroll = "30s";
      this.service
        .search<T>(request)
        .then((r) => this._parseEsResponse(r, this.options.prefix))
        .catch((e) => {
          this.service.log.error(`Fail to compute chunk for stream`, e);
          this.destroy(e);
        });
    }
  }

  _parseEsResponse(result: SearchResponse<T>, prefix?: string): void {
    const items = result.hits.hits || [];
    this.nbParsedDocument += items.length;
    this.scroll_id = `${result._scroll_id}`;
    // if result is empty, so we reach the end
    if (items.length === 0) this.push(null);
    // TODO cast
    else this.push((prefix ? prefix + "\n" : "") + items.map((i) => this.transform(i._source) + "\n").join(""));
  }
}
