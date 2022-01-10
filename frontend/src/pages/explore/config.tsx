import { RefObject } from "react";
import { FaChartArea, FaRegListAlt } from "react-icons/fa";
import { config } from "../../config";
import { ESSearchQueryContext, ProfessionDeFoi, PlainObject } from "../../types";
import { search, fetchDashboardData } from "../../elasticsearchClient";
import { ResultList } from "./ResultList";
import { ResultDashboard } from "./ResultDashboard";

export type ModeTypeData<T> = { data: T } & { total: number };

export type ModeType<T> = {
  id: string;
  title: string;
  icon: JSX.Element;
  /**
   * Function to fetch the data for the component.
   * @param search The es search context
   * @param signal A cancelable signal (see AbortController)
   */
  fetchData: (search: ESSearchQueryContext, signal: AbortSignal) => Promise<ModeTypeData<T>>;
  component: (props: {
    containerRef: RefObject<HTMLDivElement>;
    context: ESSearchQueryContext;
    result: ModeTypeData<T>;
  }) => JSX.Element | null;
};

export const modes = [
  {
    id: "list",
    title: "Affichage en liste des professions de foi",
    icon: <FaRegListAlt />,
    fetchData: (context: ESSearchQueryContext, signal) => {
      return search<ProfessionDeFoi>(
        context,
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        0,
        config.pagination_size,
        signal,
      );
    },
    component: ResultList,
  } as ModeType<Array<ProfessionDeFoi>>,
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <FaChartArea />,
    fetchData: fetchDashboardData,
    component: ResultDashboard,
  } as ModeType<number>,
];
