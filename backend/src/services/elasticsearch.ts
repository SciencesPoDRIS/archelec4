import { Singleton } from "typescript-ioc";
import { Client } from "@elastic/elasticsearch";
import { Logger, getLogger } from "./logger";
import { config } from "../config";

@Singleton
export class EsService {
  /**
   * Logger.
   */
  private log = getLogger("ElasticSearch");

  /**
   * Node Elastic client.
   */
  private client: Client;

  constructor() {
    this.client = new Client(config.elasticsearch);
  }
}
