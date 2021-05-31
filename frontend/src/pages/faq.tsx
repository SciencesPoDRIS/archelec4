import React from "react";

interface Props {}
export const FAQ: React.FC<Props> = (props: Props) => {
  return (
    <div className="container full-height faq">
      <div className="row mt-3">
        <h1>Foire Aux Questions</h1>
      </div>
      <div className="row mt-3">
        <div className="question">
          <h2>Dans quels documents s’effectue la recherche avec Archelec Explore ?</h2>
          <p>
            Les professions de foi des élections législatives de 1958 à 1993. D’autres documents sont disponibles sur
            Internet Archive (+ lien) et sur la Bibliothèque numérique (+ lien), mais ils ne sont pas encore versés sur
            Archelec Explore.
          </p>
        </div>
        <div className="question">
          <h2>Pourquoi est-on obligé de choisir dans une liste fermée de valeurs ?</h2>
          <p>
            Afin de limiter au maximum les recherches infructueuses avec un terme ou une expression absent(e) des
            données disponibles (+ lien vers entrepôt de données). La recherche libre est possible dans le texte
            intégral.
          </p>
        </div>
        <div className="question">
          <h2>A-t-on accès à l’ensemble des données disponibles ?</h2>
          <p>
            Les données interrogées par Archelec Explore sont disponibles au téléchargement en format csv sur l’entrepôt
            de données de Sciences Po (+ lien vers entrepôt de données).
          </p>
        </div>
        <div className="question">
          <h2>
            Peut-on télécharger les documents, les images, les données descriptives, l’OCR depuis cette interface ?
          </h2>
          <p></p>
        </div>
        <div className="question">
          <h2>Peut-on réutiliser les résultats et les données des recherches effectuées ?</h2>
          <p></p>
        </div>
        <div className="question">
          <h2>Comment signaler une erreur dans les données ?</h2>
          <p>
            {" "}
            <a href="mailto:archelec.cevipof@sciencespo.fr">Contactez-nous</a>
          </p>
        </div>
        <div className="question">
          <h2>Les critères de recherche dont j’ai besoin ne sont pas disponibles. Que faire ?</h2>
          <p>
            {" "}
            Les critères ont été établis en fonction d’informations disponibles sur les archives électorales. Essayez la
            recherche dans le texte intégral ou <a href="mailto:archelec.cevipof@sciencespo.fr">contactez-nous</a>.
          </p>
        </div>
        <div className="question">
          <h2>Ma recherche ne donne aucun résultat. Pourquoi ?</h2>
          <p>
            {" "}
            Il peut y avoir plusieurs explications : Trop de critères ? Essayez de reformuler la requête. La collection
            n’est pas tout-à-fait complète :
            <a href="https://archive.org/details/archiveselectoralesducevipof?tab=about">
              liste des documents manquants ici
            </a>
            .
          </p>
        </div>
        <div className="question">
          <h2>Autres questions</h2>
          <p>
            <a href="https://archive.org/details/archiveselectoralesducevipof?tab=about">
              Voir la page de la collection sur Internet Archive
            </a>{" "}
            ou <a href="mailto:archelec.cevipof@sciencespo.fr">contactez-nous</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
