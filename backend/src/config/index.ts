export interface Configuration {
  // The port number of the server
  port: number;
  // Should we display stack on error
  error_with_stack: boolean;
  // Logging configuration
  logs: {
    // debug, info, warn, error
    console_level: string;
    // debug, info, warn, error
    file_level: string;
    // The maximum size of file for the rotation system.
    // Ex : "20m"
    file_maxsize: string;
    // Retention policy for the log files.
    // Can be a number for the number of files we need to keep, or a duration  like 7d
    file_retention: string;
    // folder where we store the logs files
    // it's a relative path from where you start the app or an absolute path (better)
    file_path: string;
  };
  elasticsearch: {
    // List of ES hosts
    nodes: Array<string>;
    // Sniffing : discover cluster member at startup ?
    sniffOnStart: boolean;
    // Sniffing interval
    sniffInterval: number;
  };
}

// Default configuration file
export const config: Configuration = {
  port: process.env.PORT ? Number(process.env.BACKEND_PORT) : 4000,
  error_with_stack: process.env.ERROR_WITH_STACK ? true : false,
  logs: {
    console_level: process.env.LOG_CONSOLE_LEVEL || "info",
    file_level: process.env.LOG_FILE_LEVEL || "error",
    file_maxsize: "200m",
    file_retention: "7d",
    file_path: "./",
  },
  elasticsearch: {
    nodes: [process.env.ELASTIC_URL || "http://localhost:9200"],
    sniffOnStart: false,
    sniffInterval: 60000,
  },
};
