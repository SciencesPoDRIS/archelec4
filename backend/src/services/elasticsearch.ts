import { Singleton } from "typescript-ioc";
import { Client } from "@elastic/elasticsearch";
import { Logger, getLogger } from "./logger";
import { config } from "../config";

@Singleton
export class EsService {
  // logger
  private log: Logger = getLogger("ElasticSearch");
  // Nodejs es client
  client: Client;

  constructor() {
    this.client = new Client(config.elasticsearch);
  }
}
