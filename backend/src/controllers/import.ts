import { Body, Controller, Post, Response, Route, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import { getLogger, Logger } from "../services/logger";
import { Import, ImportOptions, ImportReport } from "../services/import";

@Tags("Import")
@Route("import")
export class ImportController extends Controller {
  /**
   * Logger
   */
  private log: Logger = getLogger("ImportController");

  @Inject
  private proc: Import;

  @Post()
  @Response("500", "Internal Error")
  public async import(@Body() options?: ImportOptions): Promise<ImportReport> {
    const result = await this.proc.execution(options);
    return result;
  }
}
