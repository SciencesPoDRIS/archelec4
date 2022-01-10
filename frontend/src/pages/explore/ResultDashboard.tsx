import { FC } from "react";
import { ProfessionDeFoi, ESSearchQueryContext } from "../../types";

interface ResultDashboardProps {
  context: ESSearchQueryContext;
  result: {
    data: Array<ProfessionDeFoi>;
    total: number;
  };
}
export const ResultDashboard: FC<ResultDashboardProps> = ({ context, result }) => {
  console.log(context, result);
  return <h1>Dashboard</h1>;
};
