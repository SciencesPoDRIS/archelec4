import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Loader } from "../components/loader";
import { MetadataPanel } from "../components/metadata-panel";
import { useGet } from "../hooks/api";
import { useStateUrl } from "../hooks/state-url";
import { ProfessionDeFoi } from "../types";

export const Profession: FC = () => {
  const { id } = useParams<string>();
  const [viewMode, setViewMode] = useStateUrl<string>("view", "original");
  const { data: professionDeFoi, loading } = useGet<ProfessionDeFoi>(`/professiondefoi/${id}`);

  useEffect(() => {
    if (professionDeFoi && professionDeFoi.title) document.title = professionDeFoi.title;
    else document.title = `Profession de foi ${id}`;
  }, [id, professionDeFoi]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-3 col-sm-5 metadata-sidebar full-height">
          {loading && <Loader />}
          {professionDeFoi && (
            <MetadataPanel
              professionDeFoi={professionDeFoi as ProfessionDeFoi}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
        </div>
        <div className="col-xl-9 col-sm-7 full-height">
          {loading && <Loader />}

          {id && (viewMode !== "ocr" || professionDeFoi?.ocr_url) && (
            <iframe
              key={viewMode}
              title={"profession.title"}
              src={!viewMode || viewMode !== "ocr" ? `https://archive.org/embed/${id}` : professionDeFoi?.ocr_url}
              width="100%"
              frameBorder="0"
              allowFullScreen
              className="full-height"
            ></iframe>
          )}
          {viewMode === "ocr" && professionDeFoi && !professionDeFoi.ocr_url && (
            <h4 className="mt-2">
              <i className="fas fa-exclamation m-2"></i>Transciprtion par OCR non disponible.
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};
