import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLogger } from "./services/logger";
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
export async function makeHttpCall<T>(request: AxiosRequestConfig, retry = 0): Promise<T> {
  LOG.info(`Make request ${JSON.stringify(request, null, 2)}`);
  try {
    const response = await axios({ ...request, timeout: config.axios.timeout });
    return response.data;
  } catch (e) {
    if (retry > 0) {
      LOG.info(`Retry request ${JSON.stringify(request, null, 2)}`);
      return this.makeCall(request, retry--);
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
