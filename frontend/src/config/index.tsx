import { Configuration } from "./type";

export * from "./type";
export const config: Configuration = {
  api_path: "/api/v1",
  pagination_size: 50,
  minYear: 1940,
  maxYear: 2000,
};
