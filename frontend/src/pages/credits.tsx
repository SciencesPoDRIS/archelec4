import { FC } from "react";
import { Link } from "react-router-dom";

export const Credits: FC = () => (
  <div className="container full-height content-page">
    <div className="row mt-3">
      <h1>Générique du projet Archelec 4</h1>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Partenaires</h2>
        Sciences Po :
        <ul>
          <li>
            <a href="https://www.sciencespo.fr/bibliotheque/" title="DRIS">
              Direction des ressources et de l’information scientifique (DRIS)
            </a>{" "}
            : porteur
          </li>
          <li>
            <a href="https://www.sciencespo.fr/cevipof" title="CEVIPOF">
              Centre de recherches politiques (CEVIPOF)
            </a>{" "}
            : co-porteur
          </li>
        </ul>
        CollEx-Persée :{" "}
        <Link to="/collex-persee" title="Projet financé par CollEx-Persée">
          financement
        </Link>
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Pilotage</h2>
        Diego Antolinos-Basso, développeur data-mining ingénieur de recherche au Cevipof et au médialab / Centre des
        politiques de la terre
        <br />
        Pauline Bougon, bibliothécaire chargée de numérisation, Service Numérisation et archivage numérique à la DRIS
        <br />
        Sylvaine Detchemendy, chargée de mission Fonds documentaires à la DRIS, co-pilote du projet Archelec depuis 2013
        <br />
        Olesea Dubois, responsable du service Numérisation et archivage numérique à la DRIS
        <br />
        Sophie Forcadell, chargée de mission science ouverte à la DRIS
        <br />
        Odile Gaultier-Voituriez, responsable du département archives de la DRIS, co-pilote du projet Archelec depuis
        2013
        <br />
        Fiona Lefrère, bibliothécaire coordinatrice des projets de numérisation interne, Service Numérisation et
        archivage numérique à la DRIS
        <br />
        Eleonora Moiraghi, cheffe de projets numériques à la DRIS
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Participants</h2>
        Robin Bouvier, étudiant de l'Université technologique de Compiègne (UTC), stagiaire pour le projet Archelec 4 de
        février à juillet 2020
        <br />
        Pierre Dugué, Marine Garnier, Louis Lhomme et Chloé Mazari, étudiantes et étudiants de Sciences Po, vacataires
        pour le projet en 2018-2019
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Conseil scientifique</h2>
        Equipe de pilotage (cf ci-dessus)
        <br />
        François Cavalier, Directeur de la DRIS
        <br />
        Martial Foucault, Directeur du CEVIPOF et enseignant-chercheur
        <br />
        Caroline Le Pennec-Çaldichoury, Professeure assistante au Département d’économie appliquée à HEC Montréal.
        <br />
        Donatienne Magnier, Responsable du Département Valorisation et numérisation du patrimoine à la DRIS
        <br />
        Nicolas Sauger, professeur associé à Sciences Po, chercheur affilié au Centre d’études européennes (CEE) et au
        Laboratoire interdisciplinaire d'évaluation des politiques publiques (LIEPP), directeur du Centre de données
        socio-politiques (CDSP)
        <br />
        Paul Vertier, Économiste à la Banque de France
        <br />
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Prestataire de développement informatique</h2>
        <a href="https://ouestware.com" title="OuestWare">
          Société OuestWare
        </a>{" "}
        : Paul Girard, Alexis Jacomy et Benoît Simard
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Infrastructure et hébergement</h2>
        DSI de Sciences Po : Grégory Quistrebert et Joris Jourdain
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Crédit photographique</h2>© Caroline Maufroid / Sciences Po
      </p>
    </div>
    <div className="row mt-3">
      <p>
        <h2>Remerciements</h2>
        Jean-Philippe Moreux, expert scientifique de Gallica, BNF
        <br />
        Bernard Poignant, agrégé d’histoire, ancien député-maire de Quimper (Finistère)
        <br />
        Frédéric Salmon, géographe électoral.
        <br />
      </p>
    </div>
  </div>
);
