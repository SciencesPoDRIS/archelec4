import React from "react";
import { Loader } from "../components/loader";
import { MetadataPanel } from "../components/metadata-panel";

import { useGet } from "../hooks/api";
import { ProfessionDeFoi } from "../types";

interface Props {
  id: string;
}
export const Profession: React.FC<Props> = (props: Props) => {
  const { id } = props;

  const { data: professionDeFoi, loading } = useGet<ProfessionDeFoi>(`/professiondefoi/${id}`);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3">
          {loading && <Loader />}
          {professionDeFoi && <MetadataPanel professionDeFoi={professionDeFoi as ProfessionDeFoi} />}
        </div>
        <div className="col-9" style={{ height: "100vh" }}>
          {loading && <Loader />}

          {id && (
            <iframe
              title={"profession.title"}
              src={`https://archive.org/embed/${id}`}
              width="100%"
              frameBorder="0"
              allowFullScreen
              style={{ height: "90vh" }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
