import { listenerCount } from "node:events";
import React from "react";
import { Candidat, ProfessionDeFoi } from "../types";
import byLogo from "../assets/by.png";
import ccLogo from "../assets/cc.png";
import ncLogo from "../assets/nc.png";
import ndLogo from "../assets/nd.png";

interface Props {
  professionDeFoi: ProfessionDeFoi;
}

const MetadataList: React.FC<{ list: string[]; label?: string }> = (props: { list: string[]; label?: string }) => {
  const { list, label } = props;
  return (
    <>
      {list && list.length > 0 && (
        <div className="metadata-line">
          {label && `${label} : `}
          {list.map((p, i) => (
            <span key={i}>
              <span>{p}</span>
              {i < list.length - 1 && ", "}
            </span>
          ))}
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
          <div>
            Âge déclaré : {candidat.age || "aucun"}{" "}
            {candidat["age-calcule"] !== candidat.age && <span>(calculé : {candidat["age-calcule"]})</span>}
          </div>
          <div>Sexe : {candidat.sexe}</div>
        </div>
      )}

      <div className="metadata-group">
        <MetadataList list={candidat.profession} label="Profession" />
        <MetadataList list={candidat["mandat-en-cours"]} label="Mandat" />
        <MetadataList list={candidat["mandat-passe"]} label="Mandat passé" />
        <MetadataList list={candidat.associations} label="Association" />
        <MetadataList list={candidat["autres-statuts"]} label="Autre statut" />
        {candidat.decorations && candidat.decorations !== "non" && <div>Décorations : {candidat.decorations}</div>}
      </div>
      <div className="metadata-group">
        <MetadataList list={candidat.liste} label="Liste" />
        <MetadataList list={candidat.soutien} label="Soutien" />
      </div>
    </div>
  );
};

export const MetadataPanel: React.FC<Props> = (props: Props) => {
  const { professionDeFoi } = props;
  const titulaire = professionDeFoi.candidats.find((c) => c.type === "titulaire");

  const suppleant = professionDeFoi.candidats.find((c) => c.type === "suppléant");
  return (
    <div className="metadatapanel">
      <>
        <div className="metadata-section">
          <div className="panel-header">
            Élections {professionDeFoi["contexte-election"]} de {professionDeFoi.annee}
          </div>
          <h4>
            {professionDeFoi.circonscription}
            <sup>{professionDeFoi.circonscription === "1" ? "er" : "e"}</sup> circ. {professionDeFoi["departement-nom"]}{" "}
            ({professionDeFoi.departement})
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
          <div className="metadata-group">
            <div>
              Cote {professionDeFoi.cote} aux{" "}
              <a href="https://www.sciencespo.fr/cevipof/fr/content/archives-electorales.html">
                Archives électorales du CEVIPOF
              </a>
            </div>
            <div>
              Id {professionDeFoi.id} sur{" "}
              <a href={`https://archive.org/details/${professionDeFoi.id}`}>Internet Archive</a>
            </div>
            <div>
              <a
                className="licenses"
                rel="license"
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
