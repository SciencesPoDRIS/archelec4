import bodyParser from "body-parser";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { config } from "./config";
import { RegisterRoutes } from "./routes";
import { errorFilter } from "./error-handler";
// project's services & controllers
import { getLogger, Logger } from "./services/logger";
import "./services/elasticsearch";
import "./services/import";
import "./services/internet-archive";
import "./controllers/elasticsearch";
import "./controllers/import";
import "./controllers/miscellaneous";

// logger
const log: Logger = getLogger("Server");

// Create an express application
const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Content-Type, Accept, Authorization`);
    next();
  });

// Swagger
app
  .use("/api/swagger.json", (_req, res) => {
    res.sendFile(__dirname + "/swagger.json");
  })
  .use("/api/docs", swaggerUi.serve, swaggerUi.setup(undefined, {}, {}, undefined, undefined, "/api/swagger.json"));

// Register the route of the api
RegisterRoutes(app);

// Generic filter to handler errors (with the help of Boom)
app.use(errorFilter);

// Start the server
app.listen(config.port, () => {
  log.info(`✓ Started API server at http://localhost:${config.port}`);
});
