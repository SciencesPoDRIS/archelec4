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
  // Default url for the internat archive (ie. https://archive.org)
  internet_archive_url: string;
  // identifier of the IA collection
  internet_archive_collection: string;
  // Where we save the last import data file (relative to the project path)
  last_import_date_file_path: string;
  // elastic alias name
  elasticsearch_alias_name: string;
  // batch size for the import
  import_batch_size: number;
  // max nb of concurrent request we do to IA
  import_api_max_concurrency: number;
  axios: {
    timeout: number;
    nb_retry: number;
  };
}

// Default configuration file
export const config: Configuration = {
  port: process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 4000,
  error_with_stack: process.env.ERROR_WITH_STACK ? true : false,
  logs: {
    console_level: process.env.LOG_CONSOLE_LEVEL || "debug",
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
  internet_archive_url: "https://archive.org",
  internet_archive_collection: "archiveselectoralesducevipof",
  last_import_date_file_path: ".last_import.txt",
  elasticsearch_alias_name: "archiveselectoralesducevipof",
  import_batch_size: 1000,
  import_api_max_concurrency: 50,
  axios: {
    timeout: 60000,
    nb_retry: 3,
  },
};
