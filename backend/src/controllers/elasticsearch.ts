import { Body, Controller, Post, Response, Route, Tags, Query } from "tsoa";
import { Inject } from "typescript-ioc";

import { config } from "../config";
import { getLogger, Logger } from "../services/logger";
import { ElasticSearch, SearchRequest, SearchResponse } from "../services/elasticsearch";

@Tags("ElasticSearch")
@Route("elasticsearch")
export class ElasticSearchController extends Controller {
  /**
   * Logger
   */
  private log: Logger = getLogger("ElasticSearchController");

  @Inject
  private es: ElasticSearch;

  /**
   * This is a proxy method to ElasticSearch "search" on the index 'archiveselectoralesducevipof' per default, but you can specify it.
   * The body will be passed to elasticsearch.
   */
  @Post("proxy_search")
  @Response("500", "Internal Error")
  public async proxy(@Body() params: SearchRequest["body"], @Query() index?: string): Promise<SearchResponse<unknown>> {
    const request = {
      index: index ? index : config.elasticsearch_alias_name,
      body: params,
    };
    this.log.debug("Proxy search", request);
    return await this.es.search(request);
  }
}
