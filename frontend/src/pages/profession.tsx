import React from "react";
import { MetadataPanel } from "../components/metadata-panel";

interface Props {
  id: string;
}
export const Profession: React.FC<Props> = (props: Props) => {
  const { id } = props;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
          <MetadataPanel />
        </div>
        <div className="col-8">Profession {id}</div>
      </div>
    </div>
  );
};
