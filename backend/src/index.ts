import * as bodyParser from "body-parser";
import * as express from "express";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import { getLogger, Logger } from "./services/logger";
import { errorFilter } from "./error-handler";
import { config } from "./config";
// project's services & controllers
import "./controllers/elasticsearch";
import "./controllers/import";
import "./controllers/miscellaneous";
import "./services/logger";
import "./services/elasticsearch";
import "./services/import";
import "./services/internet-archive";

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
  .use("/api/swagger.json", (req, res) => {
    res.sendFile(__dirname + "/swagger.json");
  })
  .use("/api/docs", swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions: { url: "/api/swagger.json" } }));

// Register the route of the api
RegisterRoutes(app);

// Generic filter to handler errors (with the help of Boom)
app.use(errorFilter);

// Start the server
app.listen(config.port, () => {
  log.info(`✓ Started API server at http://localhost:${config.port}`);
});
