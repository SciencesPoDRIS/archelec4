import { RefObject } from "react";
import { FaChartArea, FaRegListAlt } from "react-icons/fa";
import { BiGroup } from "react-icons/bi";
import { config } from "../../config";
import { DashboardDataType } from "../../types/viz";
import { ESSearchQueryContext, ProfessionDeFoi, PlainObject } from "../../types";
import { search, fetchDashboardData } from "../../elasticsearchClient";
import { ResultList } from "./ResultList";
import { MainDashboard } from "./MainDashboard";
import { CandidatesDashboard } from "./CandidatesDashboard";

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
    title: "Liste des professions de foi",
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
    id: "main-dashboard",
    title: "Visualisations des professions de foi",
    icon: <FaChartArea />,
    fetchData: fetchDashboardData,
    component: MainDashboard,
  } as ModeType<DashboardDataType>,
  {
    id: "candidates-dashboard",
    title: "Visualisations des candidats",
    icon: <BiGroup />,
    fetchData: fetchDashboardData,
    component: CandidatesDashboard,
  } as ModeType<DashboardDataType>,
];
