import { listenerCount } from "node:events";
import React from "react";
import { Candidat, ProfessionDeFoi } from "../types";

interface Props {
  professionDeFoi: ProfessionDeFoi;
}

const MetadataList: React.FC<{ list: string[]; label?: string }> = (props: { list: string[]; label?: string }) => {
  const { list, label } = props;
  return (
    <>
      {list && (
        <div className="metadata-line">
          <i>{label && `${label} : `}</i>
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
          <div>Genre : {candidat.sexe}</div>
        </div>
      )}

      <div className="metadata-group">
        <MetadataList list={candidat.profession} label="Profession" />
        <MetadataList list={candidat["mandat-en-cours"]} label="Mandat" />
        <MetadataList list={candidat["mandat-passe"]} label="Mandat passé" />
        <MetadataList list={candidat.associations} label="Associations" />
        <MetadataList list={candidat["autres-statuts"]} label="Autres" />
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

  const suppleant = professionDeFoi.candidats.find((c) => c.type === "suppleant");
  return (
    <div className="metadatapanel">
      <>
        <div className="metadata-section">
          <h3>
            Élection {professionDeFoi["contexte-election"]} de {professionDeFoi.annee}
          </h3>
          <h4>
            {professionDeFoi.circonscription}
            <sup>{professionDeFoi.circonscription === "1" ? "ère" : "ème"}</sup> circonscription de{" "}
            {professionDeFoi["departement-nom"]} ({professionDeFoi.departement})
          </h4>
          <div className="metadata-group">
            <div>
              {professionDeFoi["contexte-tour"] === "1" ? "Premier" : "Second"} tour, le{" "}
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(professionDeFoi.date))}
            </div>
          </div>
        </div>
        {titulaire && <CandidatMetadata candidat={titulaire} />}
        {suppleant && <CandidatMetadata candidat={suppleant} />}
        <div className="metadata-section">
          <h3>Accès au document</h3>
          <div className="metadata-group">
            <div>
              Côte {professionDeFoi.cote} aux{" "}
              <a href="https://www.sciencespo.fr/cevipof/fr/content/archives-electorales.html">
                Archives électorales du CEVIPOF
              </a>
            </div>
            <div>
              Id {professionDeFoi.id} sur{" "}
              <a href={`https://archive.org/details/${professionDeFoi.id}`}>Internet Archive</a>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
