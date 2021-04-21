import { Body, Controller, Get, Post, Route, Tags } from "tsoa";
import { getLogger, Logger } from "../services/logger";

@Tags("Miscellaneous")
@Route("misc")
export class MiscellaneousController extends Controller {
  // logger
  private log: Logger = getLogger("MiscellaneousController");

  @Get("ping")
  public async ping(): Promise<string> {
    return "pong";
  }

  @Post("echo")
  public async echo(@Body() body: unknown): Promise<unknown> {
    return body;
  }
}
