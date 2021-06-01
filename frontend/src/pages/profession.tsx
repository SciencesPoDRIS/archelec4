import React, { useEffect } from "react";
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
  useEffect(() => {
    if (professionDeFoi && professionDeFoi.title) document.title = professionDeFoi.title;
    else document.title = `Profession de foi ${id}`;
  }, [id, professionDeFoi]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-3 col-sm-5">
          {loading && <Loader />}
          {professionDeFoi && <MetadataPanel professionDeFoi={professionDeFoi as ProfessionDeFoi} />}
        </div>
        <div className="col-9 col-sm-7">
          {loading && <Loader />}

          {id && (
            <iframe
              title={"profession.title"}
              src={`https://archive.org/embed/${id}`}
              width="100%"
              frameBorder="0"
              allowFullScreen
              className="full-height"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
