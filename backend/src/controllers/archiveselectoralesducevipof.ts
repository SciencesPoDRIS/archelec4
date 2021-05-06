import { Body, Controller, Get, Path, Post, Route, Request, Query, Response, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import * as Boom from "@hapi/boom";
import * as express from "express";
import { Transform, Readable } from "stream";
import { getLogger, Logger } from "../services/logger";
import { ElasticSearch, SearchRequest, SearchResponse } from "../services/elasticsearch";
import { ArchiveElectoralProfessionDeFoi } from "../services/import";
import { config } from "../config";
import { archiveElectoralProfessionDeFoiToCsvLine, ArchiveElectoralProfessionDeFoiCsvHeader } from "../utils";

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
    try {
      const item = await this.es.get<ArchiveElectoralProfessionDeFoi>(config.elasticsearch_alias_name, id);
      return item;
    } catch (e) {
      if (e.meta.statusCode === 404) throw Boom.notFound(`Document ${id} not found`);
      throw e;
    }
  }

  /**
   * This is a proxy method to ElasticSearch "search" on the index 'archiveselectoralesducevipof'.
   * The body will be passed to elasticsearch.
   */
  @Post("search")
  @Response("200", "Success")
  @Response("500", "Internal Error")
  public async search(@Body() params: SearchRequest["body"]): Promise<SearchResponse<ArchiveElectoralProfessionDeFoi>> {
    return await this.es.search<ArchiveElectoralProfessionDeFoi>({
      index: config.elasticsearch_alias_name,
      body: params,
    });
  }

  /**
   * Given an ES search query, this method will create a CSV file in a stream way of the entire result.
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
