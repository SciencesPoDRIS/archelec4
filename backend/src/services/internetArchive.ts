import { Singleton } from "typescript-ioc";
import { Logger, getLogger } from "./logger";
import { config } from "../config";

@Singleton
export class InternetArchive {
  /**
   * Logger
   */
  private log = getLogger("InternetArchive");

  constructor() {}
}
