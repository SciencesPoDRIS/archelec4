import React from "react";

import { Candidat, ProfessionDeFoi } from "../types";
import { isNumber } from "../utils";

import byLogo from "../assets/by.png";
import ccLogo from "../assets/cc.png";
import ncLogo from "../assets/nc.png";
import ndLogo from "../assets/nd.png";
import { isArray, isString } from "lodash";

interface Props {
  professionDeFoi: ProfessionDeFoi;
  viewMode: string;
  setViewMode: (viewMode: string) => void;
}

const MetadataList: React.FC<{ list: string[]; label?: string }> = (props: { list: string[]; label?: string }) => {
  const { list, label } = props;
  return (
    <>
      {list && list.length > 0 && (
        <div className={`metadata-line ${list.includes("non mentionné") ? "metadata-unknown" : ""}`}>
          <span className="metadata-field">{label && `${label} : `}</span>
          <span className="metadata-value">{list.join(", ")}</span>
        </div>
      )}
    </>
  );
};

const CandidatMetadata: React.FC<{ candidat: Candidat }> = (props: { candidat: Candidat }) => {
  const { candidat } = props;
  return (
    <div className="metadata-section">
      <h3>
        {candidat.prenom} {candidat.nom} ({candidat.type})
      </h3>
      {candidat.age && (
        <div className="metadata-group">
          <div className={`metadata-line ${["non mentionné"].includes(candidat.age) ? "metadata-unknown" : ""}`}>
            <span className="metadata-field">Âge déclaré : </span>
            <span className="metadata-value">
              {candidat.age || "aucun"}{" "}
              {!["non mentionné"].includes(candidat.age) && candidat["age-calcule"] !== candidat.age && (
                <span>(calculé : {candidat["age-calcule"]})</span>
              )}
            </span>
          </div>
          <div className="metadata-line">
            <span className="metadata-field">Sexe : </span>
            <span className="metadata-value">{candidat.sexe}</span>
          </div>
        </div>
      )}

      <div className="metadata-group">
        <MetadataList list={candidat.profession} label="Profession" />
        <MetadataList list={candidat["mandat-en-cours"]} label="Mandat" />
        <MetadataList list={candidat["mandat-passe"]} label="Mandat passé" />
        <MetadataList list={candidat.associations} label="Association" />
        <MetadataList list={candidat["autres-statuts"]} label="Autre statut" />
        {candidat.decorations && candidat.decorations !== "non" && (
          <div className="metadata-line">
            <span className="metadata-field">Décorations : </span>
            <span className="metadata-value">{candidat.decorations}</span>
          </div>
        )}
      </div>
      <div className="metadata-group">
        <MetadataList list={candidat.liste} label="Liste" />
        <MetadataList list={candidat.soutien} label="Soutien" />
      </div>
    </div>
  );
};

export const MetadataPanel: React.FC<Props> = (props: Props) => {
  const { professionDeFoi, viewMode, setViewMode } = props;
  const titulaire = professionDeFoi.candidats.find((c) => c.type === "titulaire");
  const suppleant = professionDeFoi.candidats.find((c) => c.type === "suppléant");

  return (
    <div className="metadatapanel">
      <>
        <div className="metadata-section">
          <div className="panel-header" role="heading" aria-level={3}>
            Élections{" "}
            {isArray(professionDeFoi["contexte-election"])
              ? professionDeFoi["contexte-election"].join(" ")
              : professionDeFoi["contexte-election"]}{" "}
            de {professionDeFoi.annee}
          </div>
          <h4>
            {professionDeFoi.circonscription}
            {isNumber(professionDeFoi.circonscription) && (
              <sup>{professionDeFoi.circonscription === "1" ? "er" : "e"}</sup>
            )}{" "}
            circ. {professionDeFoi["departement-nom"]} ({professionDeFoi.departement})
          </h4>
          <div className="metadata-group">
            <h5>
              {professionDeFoi["contexte-tour"] === "1" ? "Premier" : "Second"} tour, le{" "}
              {professionDeFoi.date &&
                new Intl.DateTimeFormat("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(professionDeFoi.date))}
            </h5>
          </div>
        </div>
        {titulaire && <CandidatMetadata candidat={titulaire} />}
        {suppleant && <CandidatMetadata candidat={suppleant} />}
        <div className="metadata-section">
          <h3>Accès au document</h3>
          {professionDeFoi.ocr_url && (
            <div className="metadata-group">
              <div className="custom-control custom-switch">
                <label
                  className="left-label"
                  onClick={() => {
                    if (viewMode === "ocr") setViewMode("original");
                  }}
                >
                  Original
                </label>

                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="viewModeSwitch"
                  checked={viewMode === "ocr"}
                  onChange={(e) => {
                    setViewMode(e.target.checked ? "ocr" : "original");
                  }}
                />

                <label className="custom-control-label" htmlFor="viewModeSwitch">
                  Transcrit par OCR
                </label>
              </div>
            </div>
          )}
          <div className="metadata-group">
            <div>
              {professionDeFoi.id} sur{" "}
              <a rel="noopener noreferrer" target="_blank" href={`https://archive.org/details/${professionDeFoi.id}`}>
                Internet Archive
              </a>
            </div>
            <div>
              Cote {professionDeFoi.cote} aux{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.sciencespo.fr/cevipof/fr/content/archives-electorales.html"
              >
                Archives électorales du CEVIPOF
              </a>
            </div>
            <div>
              <a
                className="licenses"
                rel="noopener noreferrer license"
                target="_blank"
                title="Attribution-NonCommercial-NoDerivs 4.0 International"
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
              >
                Licence <img src={ccLogo} alt="Creative Commons License" />
                <img src={byLogo} alt="by" />
                <img src={ncLogo} alt="nc" />
                <img src={ndLogo} alt="nd" />
              </a>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
