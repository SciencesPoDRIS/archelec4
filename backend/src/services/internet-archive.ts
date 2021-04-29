import { Singleton } from "typescript-ioc";
import { AxiosRequestConfig } from "axios";
import { getLogger } from "./logger";
import { config } from "../config";
import { makeHttpCall } from "../utils";

/**
 * The response type for scrapping API of internet archive
 */
interface IAScrapResponse {
  items: Array<{ identifier: string }>;
  count: number;
  cursor?: string;
  total: number;
}

/**
 * The response type for get metadata API of internet archive
 */
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

/**
 * Custom response type for our getMetadata.
 * We just add the full urlm on each files
 */
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
    const result = await makeHttpCall<IAMetadataResponse>(
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
      const data = await makeHttpCall<IAScrapResponse>(request, config.internet_archive.nb_retry);
      result = result.concat(data.items.map((item) => item.identifier));
      this.log.debug(`Scrapping ${result.length},  ${data.total} remaining`);

      if (data.cursor) {
        request.params["cursor"] = data.cursor;
      } else {
        hasMore = false;
      }
    }
    return result;
  }
}
