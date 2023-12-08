import { Body, Controller, Get, Path, Post, Route, Query, Response, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import * as Boom from "@hapi/boom";
import { Readable } from "stream";

import { config } from "../config";
import { ElasticSearch, SearchRequest, SearchResponse } from "../services/elasticsearch";
import { getLogger, Logger } from "../services/logger";
import { ArchiveElectoralProfessionDeFoi } from "../services/import";
import {
  archiveElectoralProfessionDeFoiToCsvLine,
  esCastArchiveElectoralProfessionDeFoi,
  ArchiveElectoralProfessionDeFoiCsvHeader,
} from "../utils";

@Tags("Profession de foi")
@Route("professiondefoi")
export class ProfessionDeFoiController extends Controller {
  /**
   * Logger
   */
  private log: Logger = getLogger("ProfessionDeFoiController");

  @Inject
  private es: ElasticSearch;

  /**
   * Returns the corresponding "ArchiveElectoralProfessionDeFoi" object.
   * It's just a do a GET /archiveselectoralesducevipof/id on ElasticSearch and returns the underlying source object.
   */
  @Get("/{id}")
  @Response("200", "Success")
  @Response("404", "Not found")
  @Response("500", "Internal Error")
  public async proxy(@Path("id") id: string): Promise<ArchiveElectoralProfessionDeFoi> {
    this.log.debug("ES proxy", id);
    try {
      const item = await this.es.get<ArchiveElectoralProfessionDeFoi>(
        config.elasticsearch_alias_name,
        id,
        esCastArchiveElectoralProfessionDeFoi,
      );
      return item;
    } catch (e) {
      // eslint-disable-next-line
      if ((e as any).meta.statusCode === 404) throw Boom.notFound(`Document ${id} not found`);
      throw e;
    }
  }

  /**
   * This is a proxy method to ElasticSearch "search" on the index 'archiveselectoralesducevipof'.
   * The body will be passed to elasticsearch.
   * Example : {
   *   "query": {
   *     "simple_query_string": {
   *       "fields": [ "title" ],
   *       "query": "*"
   *     }
   *   }
   * }
   */
  @Post("search")
  @Response("200", "Success")
  @Response("500", "Internal Error")
  public async search(@Body() params: SearchRequest["body"]): Promise<SearchResponse<ArchiveElectoralProfessionDeFoi>> {
    return await this.es.search<ArchiveElectoralProfessionDeFoi>(
      {
        index: config.elasticsearch_alias_name,
        body: params,
      },
      esCastArchiveElectoralProfessionDeFoi,
    );
  }

  /**
   * Given an ES search query, this method will create a CSV file in a stream way of the entire result.
   * Example : {
   *   "query": {
   *     "simple_query_string": {
   *       "fields": [ "title" ],
   *       "query": "*"
   *     }
   *   }
   * }
   */
  @Post("search/csv")
  @Response("200", "Success")
  @Response("500", "Internal Error")
  public async searchAsCsv(@Body() params: SearchRequest["body"], @Query() filename: string): Promise<Readable> {
    this.setStatus(200);
    this.setHeader("Content-Type", "application/csv");
    this.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    return this.es.fullSearchAsStream<ArchiveElectoralProfessionDeFoi>(
      {
        index: config.elasticsearch_alias_name,
        body: params,
      },
      archiveElectoralProfessionDeFoiToCsvLine,
      { batchSize: 500, prefix: ArchiveElectoralProfessionDeFoiCsvHeader.join(",") },
    );
  }
}
