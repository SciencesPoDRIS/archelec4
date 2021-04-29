import React from "react";
import { Filters } from "../components/filters";
import { ProfessionList } from "../components/profession-list";

export const Home: React.FC<{}> = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
          <Filters />
        </div>
        <div className="col-8">
          <ProfessionList />
        </div>
      </div>
    </div>
  );
};
