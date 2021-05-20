import { capitalize, uniq, upperCase } from "lodash";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { ProfessionDeFoi } from "../types";

export const ProfessionCard: FC<{ profession: ProfessionDeFoi }> = (props) => {
  const { profession } = props;
  const titulaire = profession.candidats.find((c) => c.type === "titulaire");
  const suppleant = profession.candidats.find((c) => c.type === "suppléant");
  const soutiens = uniq((titulaire?.soutien || []).concat(suppleant?.soutien || []));

  return (
    <div className="result-card">
      <Link to={`/profession/${profession.id}`} title={profession.title}>
        {profession.images && profession.images.length > 0 && (
          <div>
            <img src={profession.images[0].thumb} title="Page 1" alt="Page 1" />
          </div>
        )}
        <div className="infobox">
          <div>
            {titulaire && (
              <span className="candidat">
                {titulaire.prenom} {titulaire.nom}
              </span>
            )}
            {titulaire && suppleant && <br />}
            {suppleant && (
              <span className="candidat">
                {suppleant.prenom} {suppleant.nom}
              </span>
            )}
          </div>
          <div>
            {soutiens && soutiens.length > 0 && (
              <span>
                {soutiens[0]}
                {soutiens.length > 1 && ",..."}
              </span>
            )}
          </div>
          <div>
            {capitalize(profession["contexte-election"])} {profession.annee}
            <br />
            {profession.circonscription}
            <sup>{profession.circonscription === "1" ? "er" : "e"}</sup> circ. {profession["departement-nom"]}
            <br />
            {profession["contexte-tour"] === "1" ? "Premier tour" : "Second tour"}
          </div>
        </div>
      </Link>
    </div>
  );
};
