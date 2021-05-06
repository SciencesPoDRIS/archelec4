import React from "react";
import { ProfessionDeFoi } from "../types";

interface Props {
  professionDeFoi: ProfessionDeFoi;
}

export const MetadataPanel: React.FC<Props> = (props: Props) => {
  const { professionDeFoi } = props;
  const titulaire = professionDeFoi.candidats.find((c) => c.type === "titulaire");
  return (
    <div>
      <>
        <div>
          <h4>
            Élection {professionDeFoi["contexte-election"]} de {professionDeFoi.annee}
          </h4>
          <div>
            Le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(professionDeFoi.date))}
          </div>
        </div>
        {titulaire && (
          <div>
            <h4>
              {titulaire.prenom} {titulaire.nom} (titulaire)
            </h4>
            <div>
              {titulaire.age} {titulaire["age-calcule"]} {titulaire["age-tranche"]}
            </div>
          </div>
        )}
      </>
    </div>
  );
};
