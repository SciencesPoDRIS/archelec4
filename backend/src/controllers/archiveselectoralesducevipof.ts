import { Body, Controller, Get, Path, Post, Route, Request, Query, Response, Tags } from "tsoa";
import { Inject } from "typescript-ioc";
import * as Boom from "@hapi/boom";
import * as express from "express";
import { Transform, Readable } from "stream";
import { getLogger, Logger } from "../services/logger";
import { ElasticSearch, SearchRequest, SearchResponse } from "../services/elasticsearch";
import { ArchiveElectoralItem } from "../services/import";
import { config } from "../config";

@Tags("Profession de foi")
@Route("archiveselectoralesducevipof")
export class ProfessionDeFoiController extends Controller {
  /**
   * Logger
   */
  private log: Logger = getLogger("ProfessionDeFoiController");

  @Inject
  private es: ElasticSearch;

  @Get("/{id}")
  @Response("404", "Not found")
  @Response("500", "Internal Error")
  public async proxy(@Path("id") id: string): Promise<ArchiveElectoralItem> {
    try {
      const item = await this.es.get<ArchiveElectoralItem>(config.elasticsearch_alias_name, id);
      return item;
    } catch (e) {
      if (e.meta.statusCode === 404) throw Boom.notFound(`Document ${id} not found`);
      throw e;
    }
  }

  @Post("search")
  @Response("500", "Internal Error")
  public async searchAsStream(@Body() params: SearchRequest["body"]): Promise<SearchResponse<ArchiveElectoralItem>> {
    return await this.es.search<ArchiveElectoralItem>({
      index: config.elasticsearch_alias_name,
      body: params,
    });
  }

  @Post("search/csv")
  @Response("500", "Internal Error")
  public async searchAsCsv(@Body() params: SearchRequest["body"], @Query() filename: string): Promise<Readable> {
    this.setStatus(200);
    this.setHeader("Content-Type", "application/csv");
    this.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    return this.es.fullSearchAsStream<ArchiveElectoralItem>(
      {
        index: config.elasticsearch_alias_name,
        body: params,
      },
      //TODO: implement transfo function
      (e: ArchiveElectoralItem) => `${e.id},${e.subject},${e.title}`,
    );
  }
}
