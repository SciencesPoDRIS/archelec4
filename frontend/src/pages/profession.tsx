import React from "react";
import { Loader } from "../components/loader";
import { MetadataPanel } from "../components/metadata-panel";
import { config } from "../config";
import { useGet } from "../hooks/api";
import { PlainObject } from "../types";

interface Props {
  id: string;
}
export const Profession: React.FC<Props> = (props: Props) => {
  const { id } = props;

  const { data: profession, loading } = useGet<PlainObject>(`${config.api_path}/elasticsearch/proxy/_doc/${id}`);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">{loading ? <Loader /> : <MetadataPanel />}</div>
        <div className="col-8">
          {loading && <Loader />}
          {id && (
            <iframe
              title={"profession.title"}
              src={`https://archive.org/embed/${id}`}
              width="560"
              height="384"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};
