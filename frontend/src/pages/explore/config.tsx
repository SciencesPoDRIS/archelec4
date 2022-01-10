import { RefObject } from "react";
import { FaChartArea, FaRegListAlt } from "react-icons/fa";
import { config } from "../../config";
import { ESSearchQueryContext, ProfessionDeFoi, PlainObject } from "../../types";
import { search } from "../../elasticsearchClient";
import { ResultList } from "./ResultList";
import { ResultDashboard } from "./ResultDashboard";

export type ModeTypeData<T> = T & { total: number };
export type ModeType<T> = {
  id: string;
  title: string;
  icon: JSX.Element;
  fetchData: (search: ESSearchQueryContext) => Promise<ModeTypeData<T>>;
  component: (props: {
    containerRef: RefObject<HTMLDivElement>;
    context: ESSearchQueryContext;
    result: { data: T; total: number };
  }) => JSX.Element | null;
};

export const modes = [
  {
    id: "list",
    title: "Affichage en liste des professions de foi",
    icon: <FaRegListAlt />,
    fetchData: function <ListDataFecth>(context: ESSearchQueryContext) {
      return search<ProfessionDeFoi>(
        context,
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        0,
        config.pagination_size,
        undefined,
      );
    },
    component: ResultList,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <FaChartArea />,
    fetchData: function <ListDataFecth>(context: ESSearchQueryContext) {
      return search<ProfessionDeFoi>(
        context,
        (result: PlainObject): ProfessionDeFoi => result as ProfessionDeFoi,
        0,
        config.pagination_size,
        undefined,
      );
    },
    component: ResultDashboard,
  },
];
