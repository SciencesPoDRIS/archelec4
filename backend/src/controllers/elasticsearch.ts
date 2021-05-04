import { Body, Controller, Post, Response, Route, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import { getLogger, Logger } from "../services/logger";
import { ElasticSearch, SearchRequest, SearchResponse } from "../services/elasticsearch";
import { config } from "../config";

@Tags("ElasticSearch")
@Route("elasticsearch")
export class ElasticSearchController extends Controller {
  /**
   * Logger
   */
  private log: Logger = getLogger("ElasticSearchController");

  @Inject
  private es: ElasticSearch;

  @Post("proxy_search")
  @Response("500", "Internal Error")
  public async proxy(@Body() params: SearchRequest["body"]): Promise<SearchResponse<any>> {
    const request = {
      index: config.elasticsearch_alias_name,
      body: params,
    };
    return await this.es.search<any>(request);
  }
}
