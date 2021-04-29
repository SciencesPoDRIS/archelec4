import { Body, Controller, Post, Route, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import { getLogger, Logger } from "../services/logger";
import { Import, ImportOptions, ImportReport } from "../services/import";

interface ImportRequest {
  date?: Date;
  to?: Date;
  index?: string;
}
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
  public async import(@Body() body?: ImportRequest): Promise<ImportReport> {
    const options = Object.keys(body).includes("date") ? body : null;
    if (options && !options.date) throw new Error("Parameter `date` is mandatory when specifying import options");
    const result = await this.proc.execution(options as ImportOptions);
    return result;
  }
}
