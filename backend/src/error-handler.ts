import * as httpStatusCodes from "http-status-codes";
import * as Boom from "@hapi/boom";
import * as express from "express";
import { getLogger, Logger } from "./services/logger";
import { config } from "./config";

// Logger
const log: Logger = getLogger("ErrorHandler");

// Generic interface for errors
interface Error {
  status?: number;
  fields?: string[];
  message: string;
  name: string;
  stack?: string;
}

/**
 * Inspect an error and compute /get the status code.
 * Default code is 500.
 */
function getErrorStatusCode(error: Error): number {
  if (Boom.isBoom(error)) {
    return error.output.statusCode;
  }
  return httpStatusCodes.INTERNAL_SERVER_ERROR;
}

/**
 * Express middleware inspect the error and construct
 * a custom error http response.
 */
function errorFilter(err: Error, _req: express.Request, res: express.Response, next: express.NextFunction): void {
  const code = getErrorStatusCode(err);
  const body = {
    name: err.name,
    message: err.message || "An error occurred",
    fields: err.fields || undefined,
    stack: config.error_with_stack ? err.stack : undefined,
    code,
  };
  log.error(`Url ${_req.originalUrl} produced http error`, body);
  res.status(code).json(body);
  next();
}

export { errorFilter };
