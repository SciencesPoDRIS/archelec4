import { Singleton } from "typescript-ioc";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLogger } from "./logger";
import { config } from "../config";

/**
 * The response type for the advance search API of internet archive
 */
interface IAScrapResponse {
  items: Array<{ identifier: string }>;
  count: number;
  cursor?: string;
  total: number;
}

interface IAMetadataResponseFile {
  name: string;
  source: string;
  mtime: string;
  size: string;
  md5: string;
  crc32: string;
  sha1: string;
  format: string;
  rotation?: string;
}
interface IAMetadataResponse {
  created: number;
  item_last_updated: number;
  server: string;
  dir: string;
  files: Array<IAMetadataResponseFile>;
  metadata: { [key: string]: unknown };
}

type GetMetadataResponse = Omit<IAMetadataResponse, "files"> & {
  files: Array<IAMetadataResponseFile & { url: string }>;
};

@Singleton
export class InternetArchive {
  /**
   * Logger
   */
  private log = getLogger("InternetArchive");

  /**
   * Call the IA api for the specified item id, and returns the result.
   */
  public async getMetadata(key: string): Promise<GetMetadataResponse> {
    const url = `${config.internet_archive.url}/metadata/${key}`;
    const result = await this.makeCall<IAMetadataResponse>(
      { url, responseType: "json" },
      config.internet_archive.nb_retry,
    );
    return {
      ...result,
      files: result.files.map((file) => {
        return { ...file, url: `https://${result.server}${result.dir}/${file.name}` };
      }),
    };
  }

  /**
   * Call the IA api to get the identifier list of a collection.
   *
   * @param collection Identifier of the collection
   * @param lastUpdatePeriod (optional) if specified, we only ask for items that were updated in the defined period.
   * @returns An array of identifiers as a promise
   */
  public async getCollectionIds(
    collection: string,
    lastUpdatePeriod?: { from: Date; to: Date } | null,
  ): Promise<Array<string>> {
    const url = `${config.internet_archive.url}/services/search/v1/scrape`;
    let query = `(collection:"${collection}")`;
    if (lastUpdatePeriod)
      query += ` oai_updatedate:[ ${lastUpdatePeriod.from.toISOString()} TO ${lastUpdatePeriod.to.toISOString()} ]`;
    const request: AxiosRequestConfig = {
      url: url,
      params: {
        q: query,
      },
      responseType: "json",
    };

    let result: Array<string> = [];
    let hasMore = true;
    while (hasMore) {
      const data = await this.makeCall<IAScrapResponse>(request, config.internet_archive.nb_retry);
      result = result.concat(data.items.map((item) => item.identifier));
      this.log.debug(`Scrapping ${result.length} on ${data.total}`);

      if (data.cursor) {
        request.params["cursor"] = data.cursor;
      } else {
        hasMore = false;
      }
    }
    return result;
  }

  /**
   * Generic method that perfoms a call to the API and handle errors.
   *
   * @param request The Axios request
   * @param retry How many retry we need to do if a request failed
   * @returns The API body response as promise
   */
  private async makeCall<T>(request: AxiosRequestConfig, retry = 0): Promise<T> {
    this.log.info(`Make request ${JSON.stringify(request, null, 2)}`);
    try {
      const response = await axios({ ...request, timeout: config.axios.timeout });
      return response.data;
    } catch (e) {
      if (retry > 0) {
        this.log.info(`Retry request ${JSON.stringify(request, null, 2)}`);
        return this.makeCall(request, retry--);
      } else {
        let error = `Failed to retrieve data for ${request.url} : `;
        if (e.response) error += `response status is ${e.response.status} - ${e.response.data}`;
        else if (e.request) {
          error += `no response from the server -> ${e.message}`;
          console.log(e);
        } else error += e.message;
        throw new Error(error);
      }
    }
  }
}
