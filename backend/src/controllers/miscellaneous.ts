import { Body, Controller, Get, Post, Route, Tags } from "tsoa";

import { getLogger, Logger } from "../services/logger";

@Tags("Miscellaneous")
@Route("misc")
export class MiscellaneousController extends Controller {
  // logger
  private log: Logger = getLogger("MiscellaneousController");

  /**
   * Just a ping endpoint that respond "pong" to see if the service is alive.
   */
  @Get("ping")
  public async ping(): Promise<string> {
    this.log.debug("ping");
    return "pong";
  }

  /**
   * This echo endpoint respond to you what you give it.
   * It can be usefull to see if the service is alive.
   */
  @Post("echo")
  public async echo(@Body() body: unknown): Promise<unknown> {
    this.log.debug("echo", body);
    return body;
  }
}
