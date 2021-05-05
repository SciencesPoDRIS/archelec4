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

  /**
   * Execute the import.
   *
   * Errors don't block the import process. So the process should never fails,
   * instead it returns the list of errors that the processus has encountered.
   * If you have errors, you should have the list of IDS in the report, and you can retry to import those items
   * by calling this method.
   *
   * NOTE: To trigger a full reindex, just delete the file <code>last_import_date_file_path</code> on the FS
   *
   * IMPORTANT: You can override the period & index name of the import, by specifying the paramater <code>options</code>
   * on this method. It can be usefull to make an import per party (ex: by week slices).
   */
  @Post()
  @Response("500", "Internal Error")
  @Response("206", "Partial import")
  @Response("200", "OK")
  public async import(@Body() options?: ImportOptions): Promise<ImportReport> {
    const result = await this.proc.execution(options);
    if (result.errors && result.errors.length > 0) {
      this.setStatus(206);
    }
    return result;
  }
}
