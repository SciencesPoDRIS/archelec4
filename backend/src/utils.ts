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
