import { FC, useEffect } from "react";
import { modes } from "./config";
import { ESSearchQueryContext } from "../../types";
import { ActiveFiltersPhrase } from "../../components/filters/active-filters-phrase";
import { ProfessionDownload } from "../../components/profession-download";
import { numberFormat } from "../../components/viz/utils";

interface ResultHeaderProps {
  esContext: ESSearchQueryContext;
  nbProfession?: number;
  selectedMode: string;
  onModeChange: (mode: string) => void;
}
export const ResultHeader: FC<ResultHeaderProps> = ({ esContext, nbProfession, selectedMode, onModeChange }) => {
  useEffect(() => {
    document.title = "Archelec: exploration des professions de foi électorales";
  }, []);

  return (
    <div className="panel-header">
      <div>
        <span aria-level={2} role="heading">
          <span className="highlight">{nbProfession ? numberFormat.format(nbProfession) : 0}</span> professions de foi
        </span>
        <ActiveFiltersPhrase filtersState={esContext.filters} />
      </div>

      <div className="d-flex align-items-center">
        <ProfessionDownload esContext={esContext} />
        <span>
          <div className="btn-group" role="group">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`btn btn-outline-primary ${mode.id === selectedMode ? "active" : ""}`}
                title={mode.title}
                onClick={() => onModeChange(mode.id)}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
};
