import { FC } from "react";
import { Cartography } from "../../components/viz/Cartography";
import { ESSearchQueryContext } from "../../types";

interface ResultDashboardProps {
  context: ESSearchQueryContext;
  result: {
    data: number;
    total: number;
  };
}
export const ResultDashboard: FC<ResultDashboardProps> = ({}) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Cartography
          height={700}
          width={700}
          data={[
            {
              "departement-insee": "44 - Loire-Atlantique",
              doc_count: 4000,
              "departement-nom": "Loire Atlantique",
              departement: "44",
            },
            {
              "departement-insee": "60 - Oise",
              doc_count: 2000,
              "departement-nom": "Oise",
              departement: "60",
            },
            {
              "departement-insee": "56 - Morbihan",
              doc_count: 1000,
              "departement-nom": "Morbihan",
              departement: "56",
            },
          ]}
        />
      </div>
    </div>
  );
};
